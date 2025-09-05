import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.port = int(os.getenv('DB_PORT', 3306))
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', '')
        self.database = os.getenv('DB_NAME', 'bin_smart_db')
        self.connection = None

    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database
            )
            if self.connection.is_connected():
                print(f"Successfully connected to MySQL database: {self.database}")
                return True
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            return False

    def disconnect(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL connection closed")

    def execute_query(self, query, params=None):
        """Execute a query and return results"""
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params)
            
            if query.strip().upper().startswith(('SELECT', 'SHOW', 'DESCRIBE')):
                results = cursor.fetchall()
                cursor.close()
                return results
            else:
                self.connection.commit()
                cursor.close()
                return True
                
        except Error as e:
            print(f"Error executing query: {e}")
            return None

    def create_database_if_not_exists(self):
        """Create database if it doesn't exist"""
        try:
            # Connect without specifying database
            temp_connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password
            )
            cursor = temp_connection.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
            cursor.close()
            temp_connection.close()
            print(f"Database '{self.database}' ready")
            return True
        except Error as e:
            print(f"Error creating database: {e}")
            return False

    def create_tables(self):
        """Create necessary tables for the application"""
        tables = {
            'users': """
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    total_points INT DEFAULT 0,
                    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    region VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """,
            'waste_scans': """
                CREATE TABLE IF NOT EXISTS waste_scans (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    bin_id INT,
                    waste_type ENUM('Plastic', 'Organic', 'Paper', 'E-Waste', 'Glass') NOT NULL,
                    confidence_score DECIMAL(5,2),
                    points_earned INT,
                    image_path VARCHAR(255),
                    quantity DECIMAL(8,2) DEFAULT 1.0,
                    location_lat DECIMAL(10, 8),
                    location_lng DECIMAL(11, 8),
                    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE SET NULL
                )
            """,
            'bins': """
                CREATE TABLE IF NOT EXISTS bins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    location_name VARCHAR(100) NOT NULL,
                    latitude DECIMAL(10, 8),
                    longitude DECIMAL(11, 8),
                    bin_type ENUM('Plastic', 'Organic', 'Paper', 'E-Waste', 'Glass', 'Mixed') NOT NULL,
                    capacity_level ENUM('Empty', 'Low', 'Medium', 'High', 'Full') DEFAULT 'Empty',
                    total_disposals INT DEFAULT 0,
                    last_emptied TIMESTAMP NULL,
                    region VARCHAR(100),
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """,
            'rewards': """
                CREATE TABLE IF NOT EXISTS rewards (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    points_required INT NOT NULL,
                    category VARCHAR(50),
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """,
            'admins': """
                CREATE TABLE IF NOT EXISTS admins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'super_admin') DEFAULT 'admin',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """,
            'reward_redemptions': """
                CREATE TABLE IF NOT EXISTS reward_redemptions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    reward_id INT NOT NULL,
                    points_used INT NOT NULL,
                    redemption_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE
                )
            """,
            'bin_complaints': """
                CREATE TABLE IF NOT EXISTS bin_complaints (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    bin_id INT NOT NULL,
                    complaint_type ENUM('full', 'broken', 'not_working', 'dirty', 'other') NOT NULL,
                    description TEXT,
                    status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    resolved_at TIMESTAMP NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE
                )
            """,
            'bin_ratings': """
                CREATE TABLE IF NOT EXISTS bin_ratings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    bin_id INT NOT NULL,
                    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                    comment TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_user_bin_rating (user_id, bin_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE
                )
            """,
            'notifications': """
                CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    title VARCHAR(100) NOT NULL,
                    message TEXT NOT NULL,
                    type ENUM('reminder', 'alert', 'reward', 'milestone', 'info') NOT NULL,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """
        }

        for table_name, query in tables.items():
            result = self.execute_query(query)
            if result:
                print(f"Table '{table_name}' created successfully")
            else:
                print(f"Failed to create table '{table_name}'")

    def seed_data(self):
        """Insert sample data"""
        # Sample bins with regions
        sample_bins = [
            ("Central Park - Main Entrance", 40.7831, -73.9712, "Mixed", "Manhattan"),
            ("Downtown Recycling Center", 40.7589, -73.9851, "Plastic", "Manhattan"),
            ("City Hall - East Side", 40.7128, -74.0060, "Paper", "Manhattan"),
            ("Tech District E-Waste Point", 40.7505, -73.9934, "E-Waste", "Manhattan"),
            ("Riverside Glass Collection", 40.7827, -73.9734, "Glass", "Manhattan"),
            ("Brooklyn Bridge Park", 40.7023, -73.9969, "Mixed", "Brooklyn"),
            ("Queens Community Center", 40.7282, -73.7949, "Organic", "Queens"),
            ("Bronx Zoo Entrance", 40.8506, -73.8773, "Mixed", "Bronx")
        ]
        
        for location, lat, lng, bin_type, region in sample_bins:
            query = """
                INSERT IGNORE INTO bins (location_name, latitude, longitude, bin_type, region) 
                VALUES (%s, %s, %s, %s, %s)
            """
            self.execute_query(query, (location, lat, lng, bin_type, region))

        # Sample rewards
        sample_rewards = [
            ("Coffee Shop Discount", "10% off at participating coffee shops", 50, "Food & Drink"),
            ("Public Transport Credit", "$5 credit for public transportation", 100, "Transport"),
            ("Eco-Friendly Tote Bag", "Reusable shopping bag made from recycled materials", 150, "Merchandise"),
            ("Plant a Tree Certificate", "We'll plant a tree in your name", 300, "Environmental"),
            ("Green Energy Discount", "20% off renewable energy subscription", 500, "Energy")
        ]
        
        for name, desc, points, category in sample_rewards:
            query = """
                INSERT IGNORE INTO rewards (name, description, points_required, category) 
                VALUES (%s, %s, %s, %s)
            """
            self.execute_query(query, (name, desc, points, category))

        print("Sample data inserted successfully")
