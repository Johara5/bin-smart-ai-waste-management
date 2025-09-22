from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import DatabaseManager
from analytics import analytics_bp
from feedback_fixed import feedback_bp
from reports import reports_bp
from notifications import notifications_bp
import random
import uuid
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize database manager
db_manager = DatabaseManager()

# Ensure database connection is established
db_manager.connect()

# Register blueprints with URL prefix
app.register_blueprint(analytics_bp, url_prefix='/api')
app.register_blueprint(feedback_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')
app.register_blueprint(notifications_bp, url_prefix='/api')

# Secret key for JWT tokens
SECRET_KEY = os.getenv('JWT_SECRET_KEY', str(uuid.uuid4()))

# Create a session token
def create_session_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Verify token
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Backend is running"})

@app.route('/api/waste-disposal', methods=['POST'])
def record_waste_disposal():
    """Record waste disposal and award points"""
    data = request.get_json()
    user_id = data.get('user_id')
    waste_type = data.get('waste_type')
    quantity = data.get('quantity', 1.0)
    location_lat = data.get('location_lat')
    location_lng = data.get('location_lng')
    bin_id = data.get('bin_id')

    if not user_id or not waste_type:
        return jsonify({"error": "User ID and waste type are required"}), 400

    # Calculate points based on waste type
    points_map = {
        'Plastic': 10,
        'Organic': 5,
        'Paper': 8,
        'E-Waste': 20,
        'Glass': 12
    }

    points_earned = points_map.get(waste_type, 5) * float(quantity)

    # Ensure database connection is active
    if not db_manager.connection or not db_manager.connection.is_connected():
        db_manager.connect()

    try:
        # Record the waste scan
        scan_query = """
            INSERT INTO waste_scans
            (user_id, bin_id, waste_type, points_earned, quantity, location_lat, location_lng)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        db_manager.execute_query(scan_query, (user_id, bin_id, waste_type, points_earned, quantity, location_lat, location_lng))

        # Update user's total points
        update_points_query = """
            UPDATE users SET total_points = total_points + %s WHERE id = %s
        """
        db_manager.execute_query(update_points_query, (points_earned, user_id))

        # Get user's updated total points
        get_points_query = "SELECT total_points FROM users WHERE id = %s"
        result = db_manager.execute_query(get_points_query, (user_id,))
        total_points = result[0]['total_points'] if result else points_earned

        return jsonify({
            "status": "success",
            "message": f"Successfully recorded {waste_type} disposal",
            "points_earned": points_earned,
            "total_points": total_points
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error recording waste disposal: {str(e)}"
        }), 500

@app.route('/api/rewards', methods=['GET'])
def get_rewards():
    """Get available rewards"""
    # Ensure database connection is active
    if not db_manager.connection or not db_manager.connection.is_connected():
        db_manager.connect()

    try:
        query = """
            SELECT * FROM rewards
            WHERE is_active = TRUE
            ORDER BY points_required ASC
        """
        rewards = db_manager.execute_query(query)

        return jsonify({
            "status": "success",
            "rewards": rewards
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error fetching rewards: {str(e)}"
        }), 500

@app.route('/api/rewards/redeem', methods=['POST'])
def redeem_reward():
    """Redeem a reward with user points"""
    data = request.get_json()
    user_id = data.get('user_id')
    reward_id = data.get('reward_id')

    if not user_id or not reward_id:
        return jsonify({"error": "User ID and reward ID are required"}), 400

    # Ensure database connection is active
    if not db_manager.connection or not db_manager.connection.is_connected():
        db_manager.connect()

    try:
        # Get reward details
        reward_query = "SELECT * FROM rewards WHERE id = %s AND is_active = TRUE"
        reward = db_manager.execute_query(reward_query, (reward_id,))

        if not reward:
            return jsonify({"error": "Reward not found or inactive"}), 404

        points_required = reward[0]['points_required']

        # Check if user has enough points
        user_query = "SELECT total_points FROM users WHERE id = %s"
        user = db_manager.execute_query(user_query, (user_id,))

        if not user:
            return jsonify({"error": "User not found"}), 404

        user_points = user[0]['total_points']

        if user_points < points_required:
            return jsonify({
                "status": "error",
                "message": "Not enough points to redeem this reward",
                "user_points": user_points,
                "points_required": points_required
            }), 400

        # Record redemption
        redemption_query = """
            INSERT INTO reward_redemptions
            (user_id, reward_id, points_used)
            VALUES (%s, %s, %s)
        """
        db_manager.execute_query(redemption_query, (user_id, reward_id, points_required))

        # Update user points
        update_points_query = """
            UPDATE users SET total_points = total_points - %s WHERE id = %s
        """
        db_manager.execute_query(update_points_query, (points_required, user_id))

        # Get updated user points
        updated_user = db_manager.execute_query(user_query, (user_id,))
        updated_points = updated_user[0]['total_points']

        return jsonify({
            "status": "success",
            "message": f"Successfully redeemed {reward[0]['name']}",
            "reward": reward[0],
            "remaining_points": updated_points
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error redeeming reward: {str(e)}"
        }), 500

@app.route('/api/db-test', methods=['GET'])
def db_test():
    """Test database connection and functionality"""
    # Ensure database connection is active
    if not db_manager.connection or not db_manager.connection.is_connected():
        db_manager.connect()

    try:
        # Test query to check if we can access data
        result = db_manager.execute_query("SELECT COUNT(*) as user_count FROM users")

        # Get table list to verify database structure
        tables = db_manager.execute_query("SHOW TABLES")

        return jsonify({
            "status": "success",
            "message": "Database connection successful",
            "user_count": result[0]['user_count'] if result else 0,
            "tables": [list(table.values())[0] for table in tables] if tables else []
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Database error: {str(e)}"
        }), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    city = data.get('city', '')

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    # Ensure database connection is active
    if not db_manager.connection or not db_manager.connection.is_connected():
        db_manager.connect()

    # Check if username or email already exists
    check_query = "SELECT * FROM users WHERE username = %s OR email = %s"
    existing_user = db_manager.execute_query(check_query, (username, email))

    if existing_user and len(existing_user) > 0:
        return jsonify({"error": "Username or email already exists"}), 409

    try:
        # Hash the password before storing
        password_hash = generate_password_hash(password)

        query = "INSERT INTO users (username, email, password_hash, region) VALUES (%s, %s, %s, %s)"
        result = db_manager.execute_query(query, (username, email, password_hash, city))

        if result:
            # Get the newly created user
            new_user = db_manager.execute_query("SELECT * FROM users WHERE username = %s", (username,))
            if new_user and len(new_user) > 0:
                # Create a session token
                user_data = new_user[0]
                session_token = create_session_token(user_data['id'])
                return jsonify({
                    "message": "User created successfully",
                    "username": username,
                    "user_id": user_data['id'],
                    "token": session_token
                }), 201
            return jsonify({"message": "User created successfully", "username": username}), 201
        else:
            return jsonify({"error": "Failed to create user"}), 500
    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({"error": f"Failed to create user: {str(e)}"}), 500

@app.route('/api/users/<username>', methods=['GET'])
def get_user(username):
    """Get user by username"""
    query = "SELECT * FROM users WHERE username = %s"
    result = db_manager.execute_query(query, (username,))

    if result and len(result) > 0:
        # Don't return password hash in response
        user_data = result[0]
        if 'password_hash' in user_data:
            del user_data['password_hash']
        return jsonify(user_data)
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/login', methods=['POST'])
def login():
    """Login a user"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Ensure database connection is active
    if not db_manager.connection or not db_manager.connection.is_connected():
        db_manager.connect()

    try:
        # Get user by username
        query = "SELECT * FROM users WHERE username = %s"
        result = db_manager.execute_query(query, (username,))

        if not result or len(result) == 0:
            return jsonify({"error": "Invalid username or password"}), 401

        user_data = result[0]

        # Check if password_hash field exists
        if 'password_hash' not in user_data:
            return jsonify({"error": "User account not properly configured"}), 500

        # Verify password
        if check_password_hash(user_data['password_hash'], password):
            # Create session token
            session_token = create_session_token(user_data['id'])

            # Remove password hash from response
            del user_data['password_hash']

            return jsonify({
                "message": "Login successful",
                "user": user_data,
                "token": session_token
            })
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@app.route('/api/scan', methods=['POST'])
def scan_waste():
    """Process waste scan and save to database"""
    data = request.get_json()
    user_id = data.get('user_id')
    waste_type = data.get('waste_type')
    confidence = data.get('confidence', random.uniform(80, 100))

    # Points mapping
    points_map = {
        'Plastic': 10,
        'Organic': 5,
        'Paper': 8,
        'E-Waste': 20,
        'Glass': 12
    }

    points_earned = points_map.get(waste_type, 0)

    # Insert scan record
    scan_query = """
        INSERT INTO waste_scans (user_id, waste_type, confidence_score, points_earned)
        VALUES (%s, %s, %s, %s)
    """
    scan_result = db_manager.execute_query(scan_query, (user_id, waste_type, confidence, points_earned))

    # Update user points if scan was successful
    if scan_result and user_id:
        update_query = "UPDATE users SET total_points = total_points + %s WHERE id = %s"
        db_manager.execute_query(update_query, (points_earned, user_id))

    if scan_result:
        return jsonify({
            "message": "Scan recorded successfully",
            "waste_type": waste_type,
            "confidence": confidence,
            "points_earned": points_earned
        }), 201
    else:
        return jsonify({"error": "Failed to record scan"}), 500

@app.route('/api/bins', methods=['GET'])
def get_bins():
    """Get all bin locations"""
    query = "SELECT * FROM bins"
    result = db_manager.execute_query(query)

    if result is not None:
        return jsonify(result)
    else:
        return jsonify({"error": "Failed to fetch bins"}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get top users by points"""
    query = """
        SELECT username, total_points, created_at
        FROM users
        ORDER BY total_points DESC
        LIMIT 10
    """
    result = db_manager.execute_query(query)

    if result is not None:
        return jsonify(result)
    else:
        return jsonify({"error": "Failed to fetch leaderboard"}), 500

@app.route('/api/user/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    """Get user statistics"""
    # Get user info
    user_query = "SELECT * FROM users WHERE id = %s"
    user_result = db_manager.execute_query(user_query, (user_id,))

    # Get scan statistics
    stats_query = """
        SELECT
            waste_type,
            COUNT(*) as scan_count,
            SUM(points_earned) as total_points_from_type
        FROM waste_scans
        WHERE user_id = %s
        GROUP BY waste_type
    """
    stats_result = db_manager.execute_query(stats_query, (user_id,))

    if user_result and len(user_result) > 0:
        return jsonify({
            "user": user_result[0],
            "scan_statistics": stats_result or []
        })
    else:
        return jsonify({"error": "User not found"}), 404

def initialize_database():
    """Initialize database and tables"""
    print("Initializing database...")

    # Create database if it doesn't exist
    if not db_manager.create_database_if_not_exists():
        print("Failed to create database")
        return False

    # Connect to database
    if not db_manager.connect():
        print("Failed to connect to database")
        return False

    # Create tables
    db_manager.create_tables()

    # Seed with sample data
    db_manager.seed_data()

    print("Database initialization completed!")
    return True

if __name__ == '__main__':
    if initialize_database():
        port = int(os.getenv('FLASK_PORT', 8080))
        print(f"Starting Flask server on port {port}")
        app.run(debug=True, host='0.0.0.0', port=port)
    else:
        print("Failed to initialize database. Please check your MySQL connection settings.")
