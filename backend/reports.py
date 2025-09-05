"""
History and Reports System for Bin Smart
Handles user disposal history, leaderboards, and export functionality
"""

from flask import Blueprint, request, jsonify, make_response
from database import DatabaseManager
from datetime import datetime, timedelta
import csv
import io
import json

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')
db_manager = DatabaseManager()

# Connect to database
if not db_manager.connect():
    print("Failed to connect to database in reports module")

@reports_bp.route('/history/<int:user_id>', methods=['GET'])
def get_user_disposal_history(user_id):
    """Get comprehensive disposal history for a user"""
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    waste_type_filter = request.args.get('waste_type', 'all')
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    
    offset = (page - 1) * limit
    
    # Base query
    query = """
        SELECT ws.id, ws.waste_type, ws.quantity, ws.points_earned, 
               ws.scan_date, ws.confidence_score,
               b.location_name as bin_location, b.region,
               ws.location_lat, ws.location_lng
        FROM waste_scans ws
        LEFT JOIN bins b ON ws.bin_id = b.id
        WHERE ws.user_id = %s
    """
    params = [user_id]
    
    # Add filters
    if waste_type_filter != 'all':
        query += " AND ws.waste_type = %s"
        params.append(waste_type_filter)
    
    if date_from:
        query += " AND ws.scan_date >= %s"
        params.append(date_from)
    
    if date_to:
        query += " AND ws.scan_date <= %s"
        params.append(date_to)
    
    query += " ORDER BY ws.scan_date DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    
    history = db_manager.execute_query(query, params)
    
    # Get total count for pagination
    count_query = query.replace(
        "SELECT ws.id, ws.waste_type, ws.quantity, ws.points_earned, ws.scan_date, ws.confidence_score, b.location_name as bin_location, b.region, ws.location_lat, ws.location_lng",
        "SELECT COUNT(*) as total"
    ).replace(f"LIMIT {limit} OFFSET {offset}", "")
    
    total_count = db_manager.execute_query(count_query, params[:-2])
    total = total_count[0]['total'] if total_count else 0
    
    # Get summary stats for this user
    summary_query = """
        SELECT 
            COUNT(*) as total_disposals,
            SUM(points_earned) as total_points_earned,
            SUM(quantity) as total_waste_disposed,
            COUNT(DISTINCT waste_type) as waste_types_used,
            MAX(scan_date) as last_disposal_date,
            MIN(scan_date) as first_disposal_date
        FROM waste_scans 
        WHERE user_id = %s
    """
    summary = db_manager.execute_query(summary_query, (user_id,))
    
    return jsonify({
        'history': history or [],
        'summary': summary[0] if summary else {},
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'has_more': offset + limit < total
        }
    })

@reports_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Enhanced leaderboard with multiple ranking criteria"""
    
    period = request.args.get('period', 'all_time')  # all_time, weekly, monthly
    category = request.args.get('category', 'points')  # points, disposals, co2_saved
    limit = int(request.args.get('limit', 10))
    
    # Base query parts
    base_select = """
        SELECT u.username, u.total_points, u.region, u.created_at,
               COUNT(ws.id) as total_disposals,
               SUM(ws.quantity) as total_waste_disposed,
               ROUND(SUM(ws.quantity) * 0.02, 2) as estimated_co2_saved
        FROM users u
        LEFT JOIN waste_scans ws ON u.id = ws.user_id
    """
    
    # Add time filtering
    if period == 'weekly':
        base_select += " AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 1 WEEK)"
    elif period == 'monthly':
        base_select += " AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)"
    
    base_select += " GROUP BY u.id, u.username, u.total_points, u.region, u.created_at"
    
    # Add ordering based on category
    if category == 'points':
        order_by = " ORDER BY u.total_points DESC, total_disposals DESC"
    elif category == 'disposals':
        order_by = " ORDER BY total_disposals DESC, u.total_points DESC"
    elif category == 'co2_saved':
        order_by = " ORDER BY estimated_co2_saved DESC, total_disposals DESC"
    else:
        order_by = " ORDER BY u.total_points DESC"
    
    query = base_select + order_by + f" LIMIT {limit}"
    
    leaderboard = db_manager.execute_query(query)
    
    # Add rankings
    for i, user in enumerate(leaderboard or [], 1):
        user['rank'] = i
        user['badge'] = 'Gold' if i == 1 else 'Silver' if i == 2 else 'Bronze' if i == 3 else 'Eco Warrior'
    
    # Get period-specific stats
    period_stats = {
        'total_participants': len(leaderboard) if leaderboard else 0,
        'total_points_distributed': sum(u['total_points'] for u in leaderboard) if leaderboard else 0,
        'total_waste_processed': sum(u['total_waste_disposed'] for u in leaderboard if u['total_waste_disposed']) if leaderboard else 0
    }
    
    return jsonify({
        'leaderboard': leaderboard or [],
        'period': period,
        'category': category,
        'period_stats': period_stats
    })

@reports_bp.route('/export/history/<int:user_id>', methods=['GET'])
def export_user_history(user_id):
    """Export user disposal history as CSV"""
    
    format_type = request.args.get('format', 'csv')  # csv or json
    
    query = """
        SELECT ws.scan_date as 'Date', ws.waste_type as 'Waste Type', 
               ws.quantity as 'Quantity (kg)', ws.points_earned as 'Points Earned',
               ws.confidence_score as 'Confidence %', 
               b.location_name as 'Bin Location', b.region as 'Region'
        FROM waste_scans ws
        LEFT JOIN bins b ON ws.bin_id = b.id
        WHERE ws.user_id = %s
        ORDER BY ws.scan_date DESC
    """
    
    data = db_manager.execute_query(query, (user_id,))
    
    if format_type == 'csv':
        # Create CSV
        output = io.StringIO()
        if data:
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        
        # Create response
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=disposal_history_user_{user_id}.csv'
        return response
    
    else:
        # Return JSON
        return jsonify({
            'user_id': user_id,
            'export_date': datetime.now().isoformat(),
            'data': data or []
        })

@reports_bp.route('/export/leaderboard', methods=['GET'])
def export_leaderboard():
    """Export leaderboard data"""
    
    period = request.args.get('period', 'monthly')
    format_type = request.args.get('format', 'csv')
    
    query = """
        SELECT u.username as 'Username', u.total_points as 'Total Points', 
               u.region as 'Region', 
               COUNT(ws.id) as 'Total Disposals',
               SUM(ws.quantity) as 'Total Waste (kg)',
               ROUND(SUM(ws.quantity) * 0.02, 2) as 'CO2 Saved (kg)'
        FROM users u
        LEFT JOIN waste_scans ws ON u.id = ws.user_id
    """
    
    if period == 'weekly':
        query += " AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 1 WEEK)"
    elif period == 'monthly':
        query += " AND ws.scan_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)"
    
    query += """
        GROUP BY u.id, u.username, u.total_points, u.region
        ORDER BY u.total_points DESC, COUNT(ws.id) DESC
        LIMIT 50
    """
    
    data = db_manager.execute_query(query)
    
    # Add rankings
    for i, user in enumerate(data or [], 1):
        user['Rank'] = i
    
    if format_type == 'csv':
        output = io.StringIO()
        if data:
            # Reorder to put Rank first
            fieldnames = ['Rank'] + [k for k in data[0].keys() if k != 'Rank']
            writer = csv.DictWriter(output, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=leaderboard_{period}.csv'
        return response
    
    return jsonify({
        'period': period,
        'export_date': datetime.now().isoformat(),
        'leaderboard': data or []
    })

@reports_bp.route('/summary/<int:user_id>', methods=['GET'])
def get_user_summary_stats(user_id):
    """Get summary statistics for a user"""
    
    # Main user stats
    user_stats = db_manager.execute_query("""
        SELECT u.*, 
               COUNT(ws.id) as total_disposals,
               SUM(ws.quantity) as total_waste_disposed,
               AVG(ws.points_earned) as avg_points_per_disposal,
               COUNT(DISTINCT ws.waste_type) as waste_types_used,
               COUNT(DISTINCT DATE(ws.scan_date)) as active_days
        FROM users u
        LEFT JOIN waste_scans ws ON u.id = ws.user_id
        WHERE u.id = %s
        GROUP BY u.id
    """, (user_id,))
    
    if not user_stats:
        return jsonify({'error': 'User not found'}), 404
    
    user_data = user_stats[0]
    
    # Waste type breakdown
    waste_breakdown = db_manager.execute_query("""
        SELECT waste_type, COUNT(*) as scan_count, 
               SUM(quantity) as total_quantity,
               SUM(points_earned) as points_from_type
        FROM waste_scans
        WHERE user_id = %s
        GROUP BY waste_type
        ORDER BY scan_count DESC
    """, (user_id,))
    
    # Monthly progress (last 12 months)
    monthly_progress = db_manager.execute_query("""
        SELECT 
            YEAR(scan_date) as year,
            MONTH(scan_date) as month,
            MONTHNAME(scan_date) as month_name,
            COUNT(*) as disposals,
            SUM(points_earned) as points,
            SUM(quantity) as waste_disposed
        FROM waste_scans
        WHERE user_id = %s AND scan_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY YEAR(scan_date), MONTH(scan_date)
        ORDER BY year DESC, month DESC
    """, (user_id,))
    
    # Recent milestones
    milestones = []
    if user_data['total_points'] >= 1000:
        milestones.append({'title': 'Eco Champion', 'description': 'Earned 1000+ points', 'achieved': True})
    elif user_data['total_points'] >= 500:
        milestones.append({'title': 'Eco Warrior', 'description': 'Earned 500+ points', 'achieved': True})
        milestones.append({'title': 'Eco Champion', 'description': 'Earn 1000+ points', 'achieved': False, 'progress': user_data['total_points']/1000*100})
    elif user_data['total_points'] >= 100:
        milestones.append({'title': 'Eco Beginner', 'description': 'Earned 100+ points', 'achieved': True})
        milestones.append({'title': 'Eco Warrior', 'description': 'Earn 500+ points', 'achieved': False, 'progress': user_data['total_points']/500*100})
    else:
        milestones.append({'title': 'Eco Beginner', 'description': 'Earn 100+ points', 'achieved': False, 'progress': user_data['total_points']/100*100})
    
    return jsonify({
        'user_stats': user_data,
        'waste_breakdown': waste_breakdown or [],
        'monthly_progress': monthly_progress or [],
        'milestones': milestones,
        'estimated_co2_impact': round((user_data['total_waste_disposed'] or 0) * 0.02, 2)
    })
