from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock data
mock_users = {
    "testuser": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "total_points": 150,
        "created_at": "2024-01-01T00:00:00Z"
    },
    "aishashaikh": {
        "id": 2,
        "username": "aishashaikh",
        "email": "aishashaikh@gmail.com",
        "total_points": 0,
        "created_at": "2024-01-01T00:00:00Z"
    },
    "admin": {
        "id": 3,
        "username": "admin",
        "email": "admin@example.com",
        "total_points": 0,
        "created_at": "2024-01-01T00:00:00Z"
    }
}

mock_rewards = [
    {"id": 1, "name": "Coffee Discount", "description": "10% off at coffee shops", "points_required": 50, "category": "Food", "is_active": True},
    {"id": 2, "name": "Bus Pass", "description": "$5 transport credit", "points_required": 100, "category": "Transport", "is_active": True},
    {"id": 3, "name": "Eco Bag", "description": "Reusable shopping bag", "points_required": 150, "category": "Merchandise", "is_active": True}
]

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Mock server is running (Fixed)"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in mock_users and password == "password":
        user = mock_users[username].copy()
        return jsonify({
            "message": "Login successful",
            "user": user,
            "token": "mock_token_123"
        })
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if username and email and password:
        mock_users[username] = {
            "id": len(mock_users) + 1,
            "username": username,
            "email": email,
            "total_points": 0,
            "created_at": datetime.now().isoformat()
        }
        return jsonify({
            "message": "User created successfully",
            "username": username,
            "user_id": mock_users[username]["id"],
            "token": "mock_token_123"
        }), 201
    return jsonify({"error": "Missing required fields"}), 400

@app.route('/api/rewards', methods=['GET'])
def get_rewards():
    return jsonify({"status": "success", "rewards": mock_rewards})

@app.route('/api/rewards/redeem', methods=['POST'])
def redeem_reward():
    data = request.get_json()
    user_id = data.get('user_id')
    reward_id = data.get('reward_id')

    reward = next((r for r in mock_rewards if r["id"] == reward_id), None)
    if not reward:
        return jsonify({"error": "Reward not found"}), 404

    user = next((u for u in mock_users.values() if u["id"] == user_id), None)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["total_points"] < reward["points_required"]:
        return jsonify({"error": "Not enough points"}), 400

    user["total_points"] -= reward["points_required"]

    return jsonify({
        "status": "success",
        "message": f"Successfully redeemed {reward['name']}",
        "reward": reward,
        "remaining_points": user["total_points"]
    })

@app.route('/api/scan', methods=['POST'])
def scan_waste():
    data = request.get_json()
    waste_type = data.get('waste_type', 'Plastic')

    points_map = {'Plastic': 10, 'Organic': 5, 'Paper': 8, 'E-Waste': 20, 'Glass': 12}
    points = points_map.get(waste_type, 5)

    return jsonify({
        "message": "Scan recorded successfully",
        "waste_type": waste_type,
        "confidence": random.uniform(80, 100),
        "points_earned": points
    }), 201

@app.route('/api/bins', methods=['GET'])
def get_bins():
    return jsonify([
        {"id": 1, "location_name": "Central Park", "latitude": 40.7831, "longitude": -73.9712, "bin_type": "Mixed"},
        {"id": 2, "location_name": "Downtown", "latitude": 40.7589, "longitude": -73.9851, "bin_type": "Plastic"}
    ])

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    return jsonify([
        {"username": "eco_warrior", "total_points": 500},
        {"username": "green_champion", "total_points": 450},
        {"username": "testuser", "total_points": 150}
    ])

if __name__ == '__main__':
    print("🚀 Starting Fixed Mock API Server on http://localhost:8080")
    print("📝 Available test credentials:")
    print("   - Username: testuser, Password: password")
    print("   - Username: aishashaikh, Password: password")
    print("   - Username: admin, Password: admin123")
    app.run(debug=True, host='0.0.0.0', port=8080)
