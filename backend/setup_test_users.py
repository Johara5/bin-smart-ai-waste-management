#!/usr/bin/env python3
"""
Simple script to create test users for authentication
"""

import mysql.connector
from werkzeug.security import generate_password_hash
import os

def create_test_users():
    """Create test users directly with MySQL connector"""

    # Database configuration
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', 3306)),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'database': os.getenv('DB_NAME', 'bin_smart_db')
    }

    try:
        # Connect to MySQL
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        print("✅ Connected to database")

        # Create test users
        test_users = [
            ('testuser', 'testuser@example.com', 'password'),
            ('aishashaikh', 'aishashaikh@gmail.com', 'password'),
            ('admin', 'admin@example.com', 'admin123')
        ]

        for username, email, password in test_users:
            try:
                # Check if user exists
                cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
                existing = cursor.fetchone()

                if existing:
                    print(f"⚠️  User {username} already exists")
                    continue

                # Create user
                password_hash = generate_password_hash(password)
                cursor.execute(
                    "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                    (username, email, password_hash)
                )

                print(f"✅ Created test user: {username} / {password}")

            except Exception as e:
                print(f"❌ Error creating user {username}: {e}")

        # Commit changes
        conn.commit()

        # Check total users
        cursor.execute("SELECT COUNT(*) as user_count FROM users")
        result = cursor.fetchone()
        user_count = result[0]

        print(f"✅ Database setup complete! Total users: {user_count}")

        # Show test credentials
        print("\n📋 Test Credentials:")
        print("   Username: testuser | Password: password")
        print("   Username: aishashaikh | Password: password")
        print("   Username: admin | Password: admin123")

        cursor.close()
        conn.close()

    except mysql.connector.Error as err:
        print(f"❌ Database error: {err}")
        print("\n💡 Make sure:")
        print("   1. MySQL is running")
        print("   2. Database credentials in .env are correct")
        print("   3. Database 'bin_smart_db' exists")
        return False

    return True

if __name__ == "__main__":
    print("🔧 Setting up test users for authentication...")
    success = create_test_users()
    if success:
        print("\n🎉 Test users created successfully!")
        print("You can now try logging in with the credentials above.")
    else:
        print("\n❌ Failed to create test users!")
