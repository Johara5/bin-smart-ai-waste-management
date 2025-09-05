"""
Notification System for Bin Smart
Handles push notifications, alerts, and reminders
"""

from flask import Blueprint, request, jsonify
from database import DatabaseManager
from datetime import datetime, timedelta
import json

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')
db_manager = DatabaseManager()

# Connect to database
if not db_manager.connect():
    print("Failed to connect to database in notifications module")

def create_notification(user_id, title, message, notification_type='info'):
    """Helper function to create a notification"""
    query = """
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (%s, %s, %s, %s)
    """
    return db_manager.execute_query(query, (user_id, title, message, notification_type))

def create_bulk_notifications(user_ids, title, message, notification_type='info'):
    """Helper function to create notifications for multiple users"""
    for user_id in user_ids:
        create_notification(user_id, title, message, notification_type)

@notifications_bp.route('/send', methods=['POST'])
def send_notification():
    """Send a notification to user(s)"""
    data = request.get_json()
    
    user_ids = data.get('user_ids', [])  # List of user IDs or single user ID
    title = data.get('title', '')
    message = data.get('message', '')
    notification_type = data.get('type', 'info')  # info, alert, reminder, reward, milestone
    
    if not title or not message:
        return jsonify({'error': 'Title and message are required'}), 400
    
    if isinstance(user_ids, int):
        user_ids = [user_ids]
    
    if not user_ids:
        return jsonify({'error': 'At least one user_id is required'}), 400
    
    success_count = 0
    for user_id in user_ids:
        if create_notification(user_id, title, message, notification_type):
            success_count += 1
    
    return jsonify({
        'message': f'Notifications sent to {success_count}/{len(user_ids)} users',
        'success_count': success_count,
        'total_attempted': len(user_ids)
    })

@notifications_bp.route('/broadcast', methods=['POST'])
def broadcast_notification():
    """Send notification to all active users or users in specific region"""
    data = request.get_json()
    
    title = data.get('title', '')
    message = data.get('message', '')
    notification_type = data.get('type', 'info')
    region_filter = data.get('region', None)
    active_only = data.get('active_only', True)  # Only to users active in last 30 days
    
    if not title or not message:
        return jsonify({'error': 'Title and message are required'}), 400
    
    # Get target users
    query = "SELECT id FROM users WHERE 1=1"
    params = []
    
    if region_filter:
        query += " AND region = %s"
        params.append(region_filter)
    
    if active_only:
        query += " AND last_activity >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
    
    users = db_manager.execute_query(query, params)
    user_ids = [user['id'] for user in users] if users else []
    
    if not user_ids:
        return jsonify({'message': 'No users match the criteria', 'users_notified': 0})
    
    success_count = 0
    for user_id in user_ids:
        if create_notification(user_id, title, message, notification_type):
            success_count += 1
    
    return jsonify({
        'message': f'Broadcast sent to {success_count} users',
        'users_notified': success_count,
        'region': region_filter,
        'active_only': active_only
    })

@notifications_bp.route('/schedule-reminders', methods=['POST'])
def schedule_disposal_reminders():
    """Send disposal reminders to inactive users"""
    
    # Find users who haven't disposed anything in the last week
    inactive_users_query = """
        SELECT u.id, u.username, u.last_activity
        FROM users u
        LEFT JOIN waste_scans ws ON u.id = ws.user_id 
        AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        WHERE ws.id IS NULL 
        AND u.last_activity >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND u.total_points > 0
    """
    
    inactive_users = db_manager.execute_query(inactive_users_query)
    
    if not inactive_users:
        return jsonify({'message': 'No inactive users found', 'reminders_sent': 0})
    
    reminder_title = "🌱 Time to Go Green Again!"
    reminder_message = "Hi there! We miss seeing your eco-friendly contributions. There are smart bins nearby waiting for your next disposal. Every action counts towards a cleaner environment!"
    
    success_count = 0
    for user in inactive_users:
        if create_notification(user['id'], reminder_title, reminder_message, 'reminder'):
            success_count += 1
    
    return jsonify({
        'message': f'Disposal reminders sent to {success_count} inactive users',
        'reminders_sent': success_count
    })

@notifications_bp.route('/milestone-check', methods=['POST'])
def check_and_notify_milestones():
    """Check for users who reached milestones and notify them"""
    
    # Define milestones
    milestones = [
        {'points': 50, 'title': '🌿 Eco Starter', 'message': 'Congratulations! You\'ve earned your first 50 points. Keep up the great work!'},
        {'points': 100, 'title': '♻️ Eco Beginner', 'message': 'Amazing! You\'ve reached 100 points. You\'re making a real difference!'},
        {'points': 250, 'title': '🌱 Eco Enthusiast', 'message': 'Fantastic! 250 points earned. Your dedication to the environment is inspiring!'},
        {'points': 500, 'title': '🏆 Eco Warrior', 'message': 'Outstanding! 500 points achieved. You\'re a true environmental champion!'},
        {'points': 1000, 'title': '👑 Eco Champion', 'message': 'Incredible! 1000 points reached. You\'re leading by example in environmental conservation!'},
        {'points': 2000, 'title': '🌍 Eco Legend', 'message': 'Legendary! 2000 points - your impact on the environment is remarkable!'}
    ]
    
    notifications_sent = 0
    
    for milestone in milestones:
        # Find users who recently crossed this milestone (in last 24 hours)
        query = """
            SELECT u.id, u.username, u.total_points
            FROM users u
            WHERE u.total_points >= %s
            AND u.total_points < %s + 100
            AND NOT EXISTS (
                SELECT 1 FROM notifications n 
                WHERE n.user_id = u.id 
                AND n.title = %s 
                AND n.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            )
        """
        
        eligible_users = db_manager.execute_query(query, (
            milestone['points'], 
            milestone['points'], 
            milestone['title']
        ))
        
        for user in eligible_users or []:
            if create_notification(user['id'], milestone['title'], milestone['message'], 'milestone'):
                notifications_sent += 1
    
    return jsonify({
        'message': f'Milestone notifications sent to {notifications_sent} users',
        'notifications_sent': notifications_sent
    })

@notifications_bp.route('/bin-alerts', methods=['POST'])
def send_bin_alerts():
    """Send alerts for bin issues (full bins, maintenance needed)"""
    
    alert_type = request.json.get('type', 'full_bins')  # full_bins, maintenance
    
    if alert_type == 'full_bins':
        # Notify users about full bins in their region
        full_bins_query = """
            SELECT DISTINCT b.region, b.location_name, b.id
            FROM bins b
            WHERE b.capacity_level IN ('High', 'Full')
            AND b.is_active = TRUE
        """
        
        full_bins = db_manager.execute_query(full_bins_query)
        notifications_sent = 0
        
        for bin_info in full_bins or []:
            # Get users in this region
            users_in_region = db_manager.execute_query(
                "SELECT id FROM users WHERE region = %s AND last_activity >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
                (bin_info['region'],)
            )
            
            alert_title = "⚠️ Bin Alert"
            alert_message = f"The bin at {bin_info['location_name']} is nearly full. Consider using alternative bins nearby."
            
            for user in users_in_region or []:
                if create_notification(user['id'], alert_title, alert_message, 'alert'):
                    notifications_sent += 1
        
        return jsonify({
            'message': f'Full bin alerts sent',
            'notifications_sent': notifications_sent,
            'bins_alerted': len(full_bins) if full_bins else 0
        })
    
    return jsonify({'error': 'Invalid alert type'}), 400

@notifications_bp.route('/nearby-bins', methods=['POST'])
def notify_nearby_bins():
    """Notify users about smart bins near their location"""
    data = request.get_json()
    
    user_lat = data.get('latitude')
    user_lng = data.get('longitude') 
    user_id = data.get('user_id')
    radius_km = data.get('radius', 2)  # Default 2km radius
    
    if not all([user_lat, user_lng, user_id]):
        return jsonify({'error': 'latitude, longitude, and user_id are required'}), 400
    
    # Find nearby bins using simple distance calculation
    # Note: For production, consider using proper geospatial queries
    nearby_bins_query = """
        SELECT location_name, bin_type, capacity_level,
               ROUND(
                   6371 * acos(
                       cos(radians(%s)) * cos(radians(latitude)) * 
                       cos(radians(longitude) - radians(%s)) + 
                       sin(radians(%s)) * sin(radians(latitude))
                   ), 2
               ) AS distance_km
        FROM bins 
        WHERE is_active = TRUE
        AND capacity_level NOT IN ('Full')
        HAVING distance_km <= %s
        ORDER BY distance_km
        LIMIT 5
    """
    
    nearby_bins = db_manager.execute_query(nearby_bins_query, (user_lat, user_lng, user_lat, radius_km))
    
    if not nearby_bins:
        return jsonify({'message': 'No nearby bins found', 'notification_sent': False})
    
    # Create notification with nearby bins info
    bins_list = []
    for bin_info in nearby_bins:
        bins_list.append(f"{bin_info['location_name']} ({bin_info['bin_type']}) - {bin_info['distance_km']}km away")
    
    notification_title = "📍 Smart Bins Nearby"
    notification_message = f"Found {len(bins_list)} smart bins near you:\\n" + "\\n".join(bins_list[:3])
    
    if len(bins_list) > 3:
        notification_message += f"\\n...and {len(bins_list) - 3} more nearby!"
    
    success = create_notification(user_id, notification_title, notification_message, 'info')
    
    return jsonify({
        'message': 'Nearby bins notification sent',
        'notification_sent': success,
        'nearby_bins_count': len(nearby_bins),
        'bins': nearby_bins
    })

@notifications_bp.route('/reward-alerts', methods=['POST'])
def send_reward_alerts():
    """Notify users when they have enough points for rewards"""
    
    # Get users who have enough points for available rewards but haven't redeemed recently
    query = """
        SELECT DISTINCT u.id, u.username, u.total_points,
               r.name as reward_name, r.points_required
        FROM users u
        CROSS JOIN rewards r
        WHERE u.total_points >= r.points_required
        AND r.is_active = TRUE
        AND NOT EXISTS (
            SELECT 1 FROM reward_redemptions rr 
            WHERE rr.user_id = u.id 
            AND rr.reward_id = r.id 
            AND rr.redemption_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        )
        AND NOT EXISTS (
            SELECT 1 FROM notifications n
            WHERE n.user_id = u.id
            AND n.type = 'reward'
            AND n.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        )
        ORDER BY u.total_points DESC, r.points_required ASC
    """
    
    eligible_rewards = db_manager.execute_query(query)
    notifications_sent = 0
    
    # Group by user to avoid spam
    user_rewards = {}
    for item in eligible_rewards or []:
        user_id = item['id']
        if user_id not in user_rewards:
            user_rewards[user_id] = {
                'username': item['username'],
                'total_points': item['total_points'],
                'rewards': []
            }
        user_rewards[user_id]['rewards'].append({
            'name': item['reward_name'],
            'points': item['points_required']
        })
    
    # Send one notification per user with their available rewards
    for user_id, user_info in user_rewards.items():
        rewards_list = user_info['rewards'][:3]  # Limit to top 3 rewards
        
        reward_title = "🎁 Rewards Available!"
        reward_message = f"Great news! You have {user_info['total_points']} points and can redeem:\\n"
        reward_message += "\\n".join([f"• {r['name']} ({r['points']} pts)" for r in rewards_list])
        
        if len(user_info['rewards']) > 3:
            reward_message += f"\\n...and {len(user_info['rewards']) - 3} more rewards!"
        
        if create_notification(user_id, reward_title, reward_message, 'reward'):
            notifications_sent += 1
    
    return jsonify({
        'message': f'Reward alerts sent to {notifications_sent} users',
        'notifications_sent': notifications_sent,
        'eligible_users': len(user_rewards)
    })

# Auto-notification scheduler functions (would be called by a cron job or scheduler)
def auto_send_daily_reminders():
    """Function to be called daily by scheduler"""
    # Send disposal reminders
    schedule_disposal_reminders()
    
    # Check milestones
    check_and_notify_milestones()
    
    # Send reward alerts
    send_reward_alerts()

def auto_send_bin_alerts():
    """Function to be called periodically to check bin status"""
    send_bin_alerts()
