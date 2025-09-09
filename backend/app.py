from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import DatabaseManager
from analytics import analytics_bp
from feedback import feedback_bp
from reports import reports_bp
from notifications import notifications_bp
import random
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize database manager
db_manager = DatabaseManager()

# Ensure database connection is established
db_manager.connect()

# Register blueprints
app.register_blueprint(analytics_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(reports_bp)
app.register_blueprint(notifications_bp)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Backend is running"})

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    
    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400
    
    # Ensure database connection is active
    if not db_manager.connection or not db_manager.connection.is_connected():
        db_manager.connect()
        
    try:
        query = "INSERT INTO users (username, email) VALUES (%s, %s)"
        result = db_manager.execute_query(query, (username, email))
        
        if result:
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
        return jsonify(result[0])
    else:
        return jsonify({"error": "User not found"}), 404

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

@app.route('/api/rewards', methods=['GET'])
def get_rewards():
    """Get all available rewards"""
    query = "SELECT * FROM rewards WHERE is_active = TRUE ORDER BY points_required ASC"
    result = db_manager.execute_query(query)
    
    if result is not None:
        return jsonify(result)
    else:
        return jsonify({"error": "Failed to fetch rewards"}), 500

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
        port = int(os.getenv('FLASK_PORT', 3001))
        print(f"Starting Flask server on port {port}")
        app.run(debug=True, host='0.0.0.0', port=port)
    else:
        print("Failed to initialize database. Please check your MySQL connection settings.")
