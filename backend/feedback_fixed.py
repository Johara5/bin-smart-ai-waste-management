from flask import Blueprint, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

feedback_bp = Blueprint('feedback', __name__)

# Mock feedback data storage
feedback_data = {
    'complaints': [],
    'notifications': []
}

# Mock bins data
mock_bins = [
    {"id": 1, "name": "Central Park - Main Entrance", "type": "Mixed", "location": "Manhattan"},
    {"id": 2, "name": "Downtown Recycling Center", "type": "Plastic", "location": "Manhattan"},
    {"id": 3, "name": "City Hall - East Side", "type": "Paper", "location": "Manhattan"},
    {"id": 4, "name": "Tech District E-Waste Point", "type": "E-Waste", "location": "Manhattan"},
    {"id": 5, "name": "Riverside Glass Collection", "type": "Glass", "location": "Manhattan"},
    {"id": 6, "name": "Brooklyn Bridge Park", "type": "Mixed", "location": "Brooklyn"},
    {"id": 7, "name": "Queens Community Center", "type": "Organic", "location": "Queens"},
    {"id": 8, "name": "Bronx Zoo Entrance", "type": "Mixed", "location": "Bronx"}
]

@feedback_bp.route('/complaints', methods=['GET', 'POST', 'OPTIONS'])
def handle_complaints():
    """Handle complaints - GET to retrieve, POST to submit"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if request.method == 'GET':
        user_id = request.args.get('user_id', 1)
        # Filter complaints by user_id if provided
        user_complaints = [c for c in feedback_data['complaints'] if c.get('user_id') == int(user_id)]
        return jsonify(user_complaints)

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            complaint = {
                'id': len(feedback_data['complaints']) + 1,
                'user_id': data.get('user_id', 1),
                'bin_id': data.get('bin_id'),
                'complaint_type': data.get('complaint_type', 'General'),
                'description': data.get('description', ''),
                'status': 'Pending',
                'created_at': datetime.now().isoformat(),
                'priority': data.get('priority', 'Medium')
            }

            feedback_data['complaints'].append(complaint)

            return jsonify({
                "message": "Complaint submitted successfully",
                "complaint_id": complaint['id'],
                "status": "success"
            }), 201

        except Exception as e:
            return jsonify({"error": f"Failed to submit complaint: {str(e)}"}), 500

@feedback_bp.route('/notifications', methods=['GET', 'POST', 'OPTIONS'])
def handle_notifications():
    """Handle notifications - GET to retrieve, POST to create"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if request.method == 'GET':
        user_id = request.args.get('user_id', 1)
        # Filter notifications by user_id if provided
        user_notifications = [n for n in feedback_data['notifications'] if n.get('user_id') == int(user_id)]
        return jsonify(user_notifications)

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            notification = {
                'id': len(feedback_data['notifications']) + 1,
                'user_id': data.get('user_id', 1),
                'title': data.get('title', 'New Notification'),
                'message': data.get('message', ''),
                'type': data.get('type', 'info'),
                'read': False,
                'created_at': datetime.now().isoformat()
            }

            feedback_data['notifications'].append(notification)

            return jsonify({
                "message": "Notification created successfully",
                "notification_id": notification['id'],
                "status": "success"
            }), 201

        except Exception as e:
            return jsonify({"error": f"Failed to create notification: {str(e)}"}), 500

@feedback_bp.route('/notifications/<int:notification_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
def handle_notification(notification_id):
    """Handle individual notification operations"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    notification = next((n for n in feedback_data['notifications'] if n['id'] == notification_id), None)

    if not notification:
        return jsonify({"error": "Notification not found"}), 404

    if request.method == 'GET':
        return jsonify(notification)

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            # Update notification fields
            for key, value in data.items():
                if key in notification:
                    notification[key] = value

            return jsonify({
                "message": "Notification updated successfully",
                "status": "success"
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to update notification: {str(e)}"}), 500

    if request.method == 'DELETE':
        try:
            feedback_data['notifications'] = [n for n in feedback_data['notifications'] if n['id'] != notification_id]
            return jsonify({
                "message": "Notification deleted successfully",
                "status": "success"
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to delete notification: {str(e)}"}), 500

@feedback_bp.route('/bins', methods=['GET', 'OPTIONS'])
def get_bins():
    """Get all available bins"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    return jsonify(mock_bins)

@feedback_bp.route('/complaints/<int:complaint_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
def handle_complaint(complaint_id):
    """Handle individual complaint operations"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    complaint = next((c for c in feedback_data['complaints'] if c['id'] == complaint_id), None)

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    if request.method == 'GET':
        return jsonify(complaint)

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            # Update complaint fields
            for key, value in data.items():
                if key in complaint:
                    complaint[key] = value

            return jsonify({
                "message": "Complaint updated successfully",
                "status": "success"
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to update complaint: {str(e)}"}), 500

    if request.method == 'DELETE':
        try:
            feedback_data['complaints'] = [c for c in feedback_data['complaints'] if c['id'] != complaint_id]
            return jsonify({
                "message": "Complaint deleted successfully",
                "status": "success"
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to delete complaint: {str(e)}"}), 500
