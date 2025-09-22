#!/usr/bin/env python3
"""
Fix authentication issues by creating test users and ensuring database is properly set up
"""

import os
import sys
from werkzeug.security import generate_password_hash
from database import DatabaseManager

def fix_authentication():
    """Fix authentication issues"""
    print("🔧 Fixing authentication issues...")

    # Initialize database manager
    db_manager = DatabaseManager()

    # Connect to database
    if not db_manager.connect():
        print("❌ Failed to connect to database")
        return False

    print("✅ Database connection successful")

    # Create test users
    test_users = [
        ('testuser', 'testuser@example.com', 'password'),
        ('aishashaikh', 'aishashaikh@gmail.com', 'password'),
        ('admin', 'admin@example.com', 'admin123')
    ]

    for username, email, password in test_users:
        try:
            # Check if user already exists
            existing = db_manager.execute_query(
                "SELECT id FROM users WHERE username = %s OR email = %s",
                (username, email)
            )

            if existing:
                print(f"⚠️  User {username} already exists")
                continue

            # Create user
            password_hash = generate_password_hash(password)
            result = db_manager.execute_query(
                "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                (username, email, password_hash)
            )

            if result:
                print(f"✅ Created test user: {username} / {password}")
            else:
                print(f"❌ Failed to create user: {username}")

        except Exception as e:
            print(f"❌ Error creating user {username}: {e}")

    # Test database functionality
    try:
        result = db_manager.execute_query("SELECT COUNT(*) as user_count FROM users")
        if result:
            user_count = result[0]['user_count']
            print(f"✅ Database test successful. Total users: {user_count}")
        else:
            print("❌ Database test failed")
    except Exception as e:
        print(f"❌ Database test error: {e}")

    return True

if __name__ == "__main__":
    success = fix_authentication()
    if success:
        print("🎉 Authentication setup completed!")
        print("\n📋 Test Credentials:")
        print("   Username: testuser | Password: password")
        print("   Username: aishashaikh | Password: password")
        print("   Username: admin | Password: admin123")
    else:
        print("❌ Authentication setup failed!")
        sys.exit(1)
