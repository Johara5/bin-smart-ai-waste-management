"""
Analytics module for Bin Smart Admin Dashboard
Provides comprehensive data analysis and insights for municipal corporations
"""

from flask import Blueprint, request, jsonify
from database import DatabaseManager
from datetime import datetime, timedelta
import json
from functools import wraps

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')
db_manager = DatabaseManager()

# Connect to database
if not db_manager.connect():
    print("Failed to connect to database in analytics module")

def admin_required(f):
    """Decorator to require admin authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # For now, simple token check - implement proper JWT in production
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer admin-'):
            return jsonify({'error': 'Admin authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@analytics_bp.route('/users/overview', methods=['GET'])
@admin_required
def user_analytics_overview():
    """Get comprehensive user analytics overview"""
    
    # Active users stats
    queries = {
        'total_users': "SELECT COUNT(*) as count FROM users",
        'active_today': """
            SELECT COUNT(*) as count FROM users 
            WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 1 DAY)
        """,
        'active_this_week': """
            SELECT COUNT(*) as count FROM users 
            WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        """,
        'active_this_month': """
            SELECT COUNT(*) as count FROM users 
            WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        """,
        'new_users_this_month': """
            SELECT COUNT(*) as count FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        """
    }
    
    results = {}
    for key, query in queries.items():
        result = db_manager.execute_query(query)
        results[key] = result[0]['count'] if result else 0
    
    # Disposal frequency per user
    disposal_frequency = db_manager.execute_query("""
        SELECT u.username, COUNT(ws.id) as total_scans, 
               AVG(ws.points_earned) as avg_points_per_scan,
               MAX(ws.scan_date) as last_scan_date
        FROM users u
        LEFT JOIN waste_scans ws ON u.id = ws.user_id
        GROUP BY u.id, u.username
        ORDER BY total_scans DESC
        LIMIT 20
    """)
    
    # User engagement trends (last 30 days)
    engagement_trends = db_manager.execute_query("""
        SELECT DATE(scan_date) as date, COUNT(*) as scans_count, 
               COUNT(DISTINCT user_id) as active_users
        FROM waste_scans 
        WHERE scan_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(scan_date)
        ORDER BY date DESC
    """)
    
    return jsonify({
        'overview': results,
        'disposal_frequency': disposal_frequency or [],
        'engagement_trends': engagement_trends or []
    })

@analytics_bp.route('/waste/analysis', methods=['GET'])
@admin_required
def waste_data_analysis():
    """Comprehensive waste data analysis"""
    
    # Waste type trends
    waste_trends = db_manager.execute_query("""
        SELECT waste_type, COUNT(*) as total_scans, 
               SUM(quantity) as total_quantity,
               AVG(quantity) as avg_quantity,
               SUM(points_earned) as total_points
        FROM waste_scans
        GROUP BY waste_type
        ORDER BY total_scans DESC
    """)
    
    # Daily waste collection trends (last 30 days)
    daily_trends = db_manager.execute_query("""
        SELECT DATE(scan_date) as date, waste_type, 
               COUNT(*) as scan_count, SUM(quantity) as total_quantity
        FROM waste_scans 
        WHERE scan_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(scan_date), waste_type
        ORDER BY date DESC
    """)
    
    # Regional waste analysis
    regional_analysis = db_manager.execute_query("""
        SELECT b.region, ws.waste_type, COUNT(*) as disposal_count,
               SUM(ws.quantity) as total_quantity
        FROM waste_scans ws
        LEFT JOIN bins b ON ws.bin_id = b.id
        WHERE b.region IS NOT NULL
        GROUP BY b.region, ws.waste_type
        ORDER BY b.region, disposal_count DESC
    """)
    
    # Seasonal patterns (day of week)
    seasonal_patterns = db_manager.execute_query("""
        SELECT DAYNAME(scan_date) as day_of_week, 
               COUNT(*) as total_scans,
               AVG(quantity) as avg_quantity
        FROM waste_scans
        WHERE scan_date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
        GROUP BY DAYOFWEEK(scan_date), DAYNAME(scan_date)
        ORDER BY DAYOFWEEK(scan_date)
    """)
    
    return jsonify({
        'waste_trends': waste_trends or [],
        'daily_trends': daily_trends or [],
        'regional_analysis': regional_analysis or [],
        'seasonal_patterns': seasonal_patterns or []
    })

@analytics_bp.route('/geographical/heatmap', methods=['GET'])
@admin_required
def geographical_analysis():
    """Get geographical analysis data for heatmaps"""
    
    # Disposal activity heatmap data
    disposal_heatmap = db_manager.execute_query("""
        SELECT location_lat as lat, location_lng as lng, 
               COUNT(*) as activity_count,
               waste_type
        FROM waste_scans 
        WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL
        GROUP BY location_lat, location_lng, waste_type
        ORDER BY activity_count DESC
    """)
    
    # Bin utilization analysis
    bin_utilization = db_manager.execute_query("""
        SELECT b.id, b.location_name, b.latitude, b.longitude, 
               b.bin_type, b.total_disposals, b.capacity_level,
               COUNT(ws.id) as recent_scans
        FROM bins b
        LEFT JOIN waste_scans ws ON b.id = ws.bin_id 
        AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY b.id
        ORDER BY recent_scans ASC
    """)
    
    # Overflow reports
    overflow_reports = db_manager.execute_query("""
        SELECT b.location_name, b.latitude, b.longitude,
               COUNT(bc.id) as complaint_count
        FROM bins b
        LEFT JOIN bin_complaints bc ON b.id = bc.bin_id 
        AND bc.complaint_type = 'full'
        AND bc.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY b.id
        HAVING complaint_count > 0
        ORDER BY complaint_count DESC
    """)
    
    return jsonify({
        'disposal_heatmap': disposal_heatmap or [],
        'bin_utilization': bin_utilization or [],
        'overflow_reports': overflow_reports or []
    })

@analytics_bp.route('/rewards/analysis', methods=['GET'])
@admin_required
def rewards_analysis():
    """Analyze reward system performance"""
    
    # Points earned vs redeemed ratio
    points_analysis = db_manager.execute_query("""
        SELECT 
            SUM(total_points) as total_points_in_system,
            COALESCE(SUM(rr.points_used), 0) as total_points_redeemed,
            (COALESCE(SUM(rr.points_used), 0) / SUM(total_points) * 100) as redemption_rate
        FROM users u
        LEFT JOIN reward_redemptions rr ON u.id = rr.user_id
    """)
    
    # Most popular rewards
    popular_rewards = db_manager.execute_query("""
        SELECT r.name, r.category, r.points_required,
               COUNT(rr.id) as redemption_count,
               SUM(rr.points_used) as total_points_used
        FROM rewards r
        LEFT JOIN reward_redemptions rr ON r.id = rr.reward_id
        WHERE rr.status = 'completed'
        GROUP BY r.id
        ORDER BY redemption_count DESC
        LIMIT 10
    """)
    
    # Reward redemption trends over time
    redemption_trends = db_manager.execute_query("""
        SELECT DATE(redemption_date) as date, 
               COUNT(*) as redemptions_count,
               SUM(points_used) as points_used
        FROM reward_redemptions
        WHERE redemption_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND status = 'completed'
        GROUP BY DATE(redemption_date)
        ORDER BY date DESC
    """)
    
    # Correlation analysis - users who redeem rewards vs disposal frequency
    correlation_data = db_manager.execute_query("""
        SELECT u.id, u.username,
               COUNT(DISTINCT rr.id) as total_redemptions,
               COUNT(DISTINCT ws.id) as total_disposals,
               u.total_points
        FROM users u
        LEFT JOIN reward_redemptions rr ON u.id = rr.user_id
        LEFT JOIN waste_scans ws ON u.id = ws.user_id
        GROUP BY u.id
        HAVING total_disposals > 0
        ORDER BY total_redemptions DESC
    """)
    
    return jsonify({
        'points_analysis': points_analysis[0] if points_analysis else {},
        'popular_rewards': popular_rewards or [],
        'redemption_trends': redemption_trends or [],
        'correlation_data': correlation_data or []
    })

@analytics_bp.route('/predictions/bin-fullness', methods=['GET'])
@admin_required
def predict_bin_fullness():
    """Basic predictive analysis for bin fullness"""
    
    # Calculate average disposal rate per bin
    bin_predictions = db_manager.execute_query("""
        SELECT b.id, b.location_name, b.capacity_level,
               COUNT(ws.id) as scans_last_week,
               AVG(ws.quantity) as avg_disposal_size,
               CASE 
                   WHEN b.capacity_level = 'Empty' THEN 0
                   WHEN b.capacity_level = 'Low' THEN 25
                   WHEN b.capacity_level = 'Medium' THEN 50
                   WHEN b.capacity_level = 'High' THEN 75
                   WHEN b.capacity_level = 'Full' THEN 100
               END as current_fill_percentage
        FROM bins b
        LEFT JOIN waste_scans ws ON b.id = ws.bin_id 
        AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        WHERE b.is_active = TRUE
        GROUP BY b.id
    """)
    
    # Simple prediction logic (enhance with ML later)
    predictions = []
    for bin_data in bin_predictions or []:
        weekly_rate = bin_data['scans_last_week'] or 0
        daily_rate = weekly_rate / 7
        current_fill = bin_data['current_fill_percentage']
        
        # Simple linear prediction
        space_remaining = 100 - current_fill
        days_to_full = space_remaining / (daily_rate * 5) if daily_rate > 0 else float('inf')
        
        prediction = {
            **bin_data,
            'predicted_days_to_full': min(days_to_full, 30) if days_to_full != float('inf') else None,
            'priority': 'high' if days_to_full <= 2 else 'medium' if days_to_full <= 7 else 'low'
        }
        predictions.append(prediction)
    
    return jsonify({'bin_predictions': predictions})

@analytics_bp.route('/reports/export', methods=['POST'])
@admin_required
def export_report():
    """Generate exportable reports"""
    data = request.get_json()
    report_type = data.get('type', 'general')
    date_range = data.get('date_range', 30)  # days
    
    if report_type == 'user_activity':
        query = """
            SELECT u.username, u.email, u.total_points, u.created_at,
                   COUNT(ws.id) as total_scans,
                   SUM(ws.quantity) as total_waste_disposed
            FROM users u
            LEFT JOIN waste_scans ws ON u.id = ws.user_id
            WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)
            GROUP BY u.id
            ORDER BY total_points DESC
        """
        results = db_manager.execute_query(query, (date_range,))
        
    elif report_type == 'waste_summary':
        query = """
            SELECT waste_type, COUNT(*) as scan_count,
                   SUM(quantity) as total_quantity,
                   AVG(points_earned) as avg_points,
                   DATE(scan_date) as date
            FROM waste_scans
            WHERE scan_date >= DATE_SUB(NOW(), INTERVAL %s DAY)
            GROUP BY waste_type, DATE(scan_date)
            ORDER BY date DESC, scan_count DESC
        """
        results = db_manager.execute_query(query, (date_range,))
        
    elif report_type == 'bin_performance':
        query = """
            SELECT b.location_name, b.bin_type, b.region,
                   COUNT(ws.id) as usage_count,
                   AVG(br.rating) as avg_rating,
                   COUNT(bc.id) as complaint_count
            FROM bins b
            LEFT JOIN waste_scans ws ON b.id = ws.bin_id
            LEFT JOIN bin_ratings br ON b.id = br.bin_id
            LEFT JOIN bin_complaints bc ON b.id = bc.bin_id
            WHERE ws.scan_date >= DATE_SUB(NOW(), INTERVAL %s DAY) OR ws.scan_date IS NULL
            GROUP BY b.id
            ORDER BY usage_count DESC
        """
        results = db_manager.execute_query(query, (date_range,))
    else:
        results = []
    
    return jsonify({
        'report_type': report_type,
        'date_range': date_range,
        'data': results or [],
        'generated_at': datetime.now().isoformat()
    })

@analytics_bp.route('/dashboard/summary', methods=['GET'])
@admin_required
def admin_dashboard_summary():
    """Get summary stats for admin dashboard"""
    
    # Key metrics
    total_users = db_manager.execute_query("SELECT COUNT(*) as count FROM users")[0]['count']
    total_scans = db_manager.execute_query("SELECT COUNT(*) as count FROM waste_scans")[0]['count']
    total_bins = db_manager.execute_query("SELECT COUNT(*) as count FROM bins WHERE is_active = TRUE")[0]['count']
    total_complaints = db_manager.execute_query("SELECT COUNT(*) as count FROM bin_complaints WHERE status != 'resolved'")[0]['count']
    
    # Recent activity
    recent_activity = db_manager.execute_query("""
        SELECT 'scan' as activity_type, u.username, ws.waste_type as details, ws.scan_date as timestamp
        FROM waste_scans ws
        JOIN users u ON ws.user_id = u.id
        WHERE ws.scan_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
        
        UNION ALL
        
        SELECT 'complaint' as activity_type, u.username, 
               CONCAT(bc.complaint_type, ' - ', b.location_name) as details, 
               bc.created_at as timestamp
        FROM bin_complaints bc
        JOIN users u ON bc.user_id = u.id
        JOIN bins b ON bc.bin_id = b.id
        WHERE bc.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
        
        ORDER BY timestamp DESC
        LIMIT 10
    """)
    
    # Top performing regions
    top_regions = db_manager.execute_query("""
        SELECT b.region, COUNT(ws.id) as disposal_count,
               SUM(ws.quantity) as total_waste,
               COUNT(DISTINCT ws.user_id) as active_users
        FROM bins b
        LEFT JOIN waste_scans ws ON b.id = ws.bin_id
        WHERE b.region IS NOT NULL 
        AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY b.region
        ORDER BY disposal_count DESC
        LIMIT 5
    """)
    
    return jsonify({
        'key_metrics': {
            'total_users': total_users,
            'total_scans': total_scans,
            'total_bins': total_bins,
            'pending_complaints': total_complaints
        },
        'recent_activity': recent_activity or [],
        'top_regions': top_regions or []
    })

@analytics_bp.route('/bins/status', methods=['GET'])
@admin_required
def bin_status_analysis():
    """Get comprehensive bin status and performance analysis"""
    
    # Bin capacity distribution
    capacity_distribution = db_manager.execute_query("""
        SELECT capacity_level, COUNT(*) as count
        FROM bins 
        WHERE is_active = TRUE
        GROUP BY capacity_level
    """)
    
    # Bins requiring attention
    bins_needing_attention = db_manager.execute_query("""
        SELECT b.id, b.location_name, b.capacity_level,
               COUNT(bc.id) as complaint_count,
               MAX(bc.created_at) as last_complaint,
               AVG(br.rating) as avg_rating
        FROM bins b
        LEFT JOIN bin_complaints bc ON b.id = bc.bin_id AND bc.status != 'resolved'
        LEFT JOIN bin_ratings br ON b.id = br.bin_id
        WHERE b.capacity_level IN ('High', 'Full') OR COUNT(bc.id) > 0
        GROUP BY b.id
        ORDER BY complaint_count DESC, b.capacity_level DESC
    """)
    
    # Under-utilized bins
    underutilized_bins = db_manager.execute_query("""
        SELECT b.id, b.location_name, b.region, b.bin_type,
               COUNT(ws.id) as usage_count,
               DATEDIFF(NOW(), MAX(ws.scan_date)) as days_since_last_use
        FROM bins b
        LEFT JOIN waste_scans ws ON b.id = ws.bin_id
        WHERE b.is_active = TRUE
        GROUP BY b.id
        HAVING usage_count < 5 AND (days_since_last_use > 7 OR days_since_last_use IS NULL)
        ORDER BY usage_count ASC, days_since_last_use DESC
    """)
    
    return jsonify({
        'capacity_distribution': capacity_distribution or [],
        'bins_needing_attention': bins_needing_attention or [],
        'underutilized_bins': underutilized_bins or []
    })
