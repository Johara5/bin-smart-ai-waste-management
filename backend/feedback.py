"""
Complaint and Feedback System for Bin Smart
Handles user complaints, bin ratings, and feedback
"""

from flask import Blueprint, request, jsonify
from database import DatabaseManager
from datetime import datetime

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')
db_manager = DatabaseManager()

# Connect to database
if not db_manager.connect():
    print("Failed to connect to database in feedback module")

@feedback_bp.route('/complaints', methods=['POST'])
def submit_complaint():
    """Submit a bin complaint"""
    try:
        data = request.get_json()
        
        required_fields = ['user_id', 'bin_id', 'complaint_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        user_id = data['user_id']
        bin_id = data['bin_id']
        complaint_type = data['complaint_type']
        description = data.get('description', '')
        
        # Validate complaint type
        valid_types = ['full', 'broken', 'not_working', 'dirty', 'other']
        if complaint_type not in valid_types:
            return jsonify({'error': 'Invalid complaint type'}), 400
        
        # Check if user exists, if not create a basic user record
        user_check_query = "SELECT id FROM users WHERE id = %s"
        user_exists = db_manager.execute_query(user_check_query, (user_id,))
        
        if not user_exists:
            # Create a basic user record
            create_user_query = """
                INSERT INTO users (id, username, email) 
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE id = id
            """
            db_manager.execute_query(create_user_query, (user_id, f"user_{user_id}", f"user_{user_id}@example.com"))
        
        # Check if bin exists
        bin_check_query = "SELECT id FROM bins WHERE id = %s"
        bin_exists = db_manager.execute_query(bin_check_query, (bin_id,))
        
        if not bin_exists:
            return jsonify({'error': 'Invalid bin ID'}), 400
        
        query = """
            INSERT INTO bin_complaints (user_id, bin_id, complaint_type, description)
            VALUES (%s, %s, %s, %s)
        """
        
        result = db_manager.execute_query(query, (user_id, bin_id, complaint_type, description))
        
        if result:
            # Create notification for user (ignore errors if notification fails)
            try:
                notification_query = """
                    INSERT INTO notifications (user_id, title, message, type)
                    VALUES (%s, %s, %s, %s)
                """
                db_manager.execute_query(notification_query, (
                    user_id, 
                    "Complaint Submitted", 
                    f"Your complaint about {complaint_type} bin has been submitted and will be addressed soon.",
                    "info"
                ))
            except Exception as e:
                print(f"Warning: Failed to create notification: {e}")
            
            return jsonify({'message': 'Complaint submitted successfully'}), 201
        else:
            return jsonify({'error': 'Failed to submit complaint'}), 500
    
    except Exception as e:
        print(f"Error in submit_complaint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@feedback_bp.route('/complaints', methods=['GET'])
def get_complaints():
    """Get complaints (admin view or user-specific)"""
    user_id = request.args.get('user_id')
    status = request.args.get('status', 'all')
    limit = int(request.args.get('limit', 20))
    
    if user_id:
        # User-specific complaints
        query = """
            SELECT bc.*, b.location_name, b.bin_type
            FROM bin_complaints bc
            JOIN bins b ON bc.bin_id = b.id
            WHERE bc.user_id = %s
        """
        params = [user_id]
    else:
        # Admin view - all complaints
        query = """
            SELECT bc.*, u.username, b.location_name, b.bin_type, b.region
            FROM bin_complaints bc
            JOIN users u ON bc.user_id = u.id
            JOIN bins b ON bc.bin_id = b.id
        """
        params = []
    
    if status != 'all':
        query += " AND bc.status = %s"
        params.append(status)
    
    query += " ORDER BY bc.created_at DESC LIMIT %s"
    params.append(limit)
    
    result = db_manager.execute_query(query, params)
    return jsonify({'complaints': result or []})

@feedback_bp.route('/complaints/<int:complaint_id>/resolve', methods=['PUT'])
def resolve_complaint(complaint_id):
    """Mark a complaint as resolved (admin action)"""
    data = request.get_json()
    resolution_notes = data.get('resolution_notes', '')
    
    query = """
        UPDATE bin_complaints 
        SET status = 'resolved', resolved_at = NOW()
        WHERE id = %s
    """
    
    result = db_manager.execute_query(query, (complaint_id,))
    
    if result:
        # Get complaint details to send notification
        complaint_query = """
            SELECT bc.user_id, u.username, b.location_name
            FROM bin_complaints bc
            JOIN users u ON bc.user_id = u.id
            JOIN bins b ON bc.bin_id = b.id
            WHERE bc.id = %s
        """
        complaint_info = db_manager.execute_query(complaint_query, (complaint_id,))
        
        if complaint_info:
            # Notify user about resolution
            notification_query = """
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (%s, %s, %s, %s)
            """
            message = f"Your complaint about {complaint_info[0]['location_name']} has been resolved."
            if resolution_notes:
                message += f" Note: {resolution_notes}"
                
            db_manager.execute_query(notification_query, (
                complaint_info[0]['user_id'],
                "Complaint Resolved",
                message,
                "info"
            ))
        
        return jsonify({'message': 'Complaint resolved successfully'})
    else:
        return jsonify({'error': 'Failed to resolve complaint'}), 500

@feedback_bp.route('/ratings', methods=['POST'])
def submit_rating():
    """Submit a bin rating"""
    try:
        data = request.get_json()
        
        required_fields = ['user_id', 'bin_id', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        user_id = data['user_id']
        bin_id = data['bin_id']
        rating = data['rating']
        comment = data.get('comment', '')
        
        # Validate rating
        if not (1 <= rating <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Check if user exists, if not create a basic user record
        user_check_query = "SELECT id FROM users WHERE id = %s"
        user_exists = db_manager.execute_query(user_check_query, (user_id,))
        
        if not user_exists:
            # Create a basic user record
            create_user_query = """
                INSERT INTO users (id, username, email) 
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE id = id
            """
            db_manager.execute_query(create_user_query, (user_id, f"user_{user_id}", f"user_{user_id}@example.com"))
        
        # Check if bin exists
        bin_check_query = "SELECT id FROM bins WHERE id = %s"
        bin_exists = db_manager.execute_query(bin_check_query, (bin_id,))
        
        if not bin_exists:
            return jsonify({'error': 'Invalid bin ID'}), 400
        
        # Use INSERT ... ON DUPLICATE KEY UPDATE to handle updates
        query = """
            INSERT INTO bin_ratings (user_id, bin_id, rating, comment)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), created_at = NOW()
        """
        
        result = db_manager.execute_query(query, (user_id, bin_id, rating, comment))
        
        if result:
            return jsonify({'message': 'Rating submitted successfully'}), 201
        else:
            return jsonify({'error': 'Failed to submit rating'}), 500
    
    except Exception as e:
        print(f"Error in submit_rating: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@feedback_bp.route('/ratings/<int:bin_id>', methods=['GET'])
def get_bin_ratings(bin_id):
    """Get ratings for a specific bin"""
    
    # Get average rating and total ratings
    avg_query = """
        SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings
        FROM bin_ratings
        WHERE bin_id = %s
    """
    avg_result = db_manager.execute_query(avg_query, (bin_id,))
    
    # Get individual ratings
    ratings_query = """
        SELECT br.rating, br.comment, br.created_at, u.username
        FROM bin_ratings br
        JOIN users u ON br.user_id = u.id
        WHERE br.bin_id = %s
        ORDER BY br.created_at DESC
        LIMIT 20
    """
    ratings_result = db_manager.execute_query(ratings_query, (bin_id,))
    
    return jsonify({
        'average_rating': round(avg_result[0]['avg_rating'], 2) if avg_result and avg_result[0]['avg_rating'] else 0,
        'total_ratings': avg_result[0]['total_ratings'] if avg_result else 0,
        'ratings': ratings_result or []
    })

@feedback_bp.route('/suggestions', methods=['POST'])
def submit_suggestion():
    """Submit a general suggestion for service improvement"""
    try:
        data = request.get_json()
        
        user_id = data.get('user_id', 1)  # Default to user 1 if not provided
        title = data.get('title', 'Service Suggestion')
        message = data.get('message', '')
        category = data.get('category', 'general')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Check if user exists, if not create a basic user record
        user_check_query = "SELECT id FROM users WHERE id = %s"
        user_exists = db_manager.execute_query(user_check_query, (user_id,))
        
        if not user_exists:
            # Create a basic user record
            create_user_query = """
                INSERT INTO users (id, username, email) 
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE id = id
            """
            db_manager.execute_query(create_user_query, (user_id, f"user_{user_id}", f"user_{user_id}@example.com"))
        
        # Store as a special type of complaint with category 'suggestion'
        # First, let's get any available bin ID as we need one for the foreign key
        get_bin_query = "SELECT id FROM bins LIMIT 1"
        bin_result = db_manager.execute_query(get_bin_query)
        default_bin_id = bin_result[0]['id'] if bin_result else 1
        
        query = """
            INSERT INTO bin_complaints (user_id, bin_id, complaint_type, description)
            VALUES (%s, %s, 'other', %s)
        """
        
        suggestion_text = f"SUGGESTION [{category}]: {title} - {message}"
        result = db_manager.execute_query(query, (user_id, default_bin_id, suggestion_text))
        
        if result:
            # Create notification for admin users about the new suggestion
            admin_query = "SELECT id FROM admins"
            admin_results = db_manager.execute_query(admin_query)
            admin_ids = [admin['id'] for admin in admin_results] if admin_results else [1]  # Default to admin ID 1 if no admins
            
            # Import notification functions from a separate module to avoid circular imports
            import sys
            sys.path.append('.')
            from notifications import create_notification, create_bulk_notifications
            
            try:
                # Create notification for the user who submitted the suggestion
                create_notification(
                    user_id, 
                    "Suggestion Received", 
                    f"Thank you for your suggestion: {title}", 
                    "info"
                )
                
                # Notify admins about the new suggestion
                create_bulk_notifications(
                    admin_ids,
                    "New Suggestion Received",
                    f"User {user_id} submitted a suggestion: {title}",
                    "alert"
                )
                print(f"Notifications created for suggestion: {title}")
            except Exception as e:
                print(f"Error creating notifications: {e}")
            
            return jsonify({'message': 'Suggestion submitted successfully'}), 201
        else:
            return jsonify({'error': 'Failed to submit suggestion'}), 500
    
    except Exception as e:
        print(f"Error in submit_suggestion: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@feedback_bp.route('/notifications/<int:user_id>', methods=['GET'])
def get_user_notifications(user_id):
    """Get notifications for a specific user"""
    
    unread_only = request.args.get('unread_only', 'false').lower() == 'true'
    limit = int(request.args.get('limit', 20))
    
    query = """
        SELECT id, title, message, type, is_read, created_at
        FROM notifications
        WHERE user_id = %s
    """
    params = [user_id]
    
    if unread_only:
        query += " AND is_read = FALSE"
    
    query += " ORDER BY created_at DESC LIMIT %s"
    params.append(limit)
    
    result = db_manager.execute_query(query, params)
    return jsonify({'notifications': result or []})

@feedback_bp.route('/notifications/<int:notification_id>/mark-read', methods=['PUT'])
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    
    query = "UPDATE notifications SET is_read = TRUE WHERE id = %s"
    result = db_manager.execute_query(query, (notification_id,))
    
    if result:
        return jsonify({'message': 'Notification marked as read'})
    else:
        return jsonify({'error': 'Failed to update notification'}), 500

@feedback_bp.route('/notifications/bulk-read', methods=['PUT'])
def mark_all_notifications_read():
    """Mark all notifications as read for a user"""
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    query = "UPDATE notifications SET is_read = TRUE WHERE user_id = %s"
    result = db_manager.execute_query(query, (user_id,))
    
    if result:
        return jsonify({'message': 'All notifications marked as read'})
    else:
        return jsonify({'error': 'Failed to update notifications'}), 500
