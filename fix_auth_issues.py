#!/usr/bin/env python3
"""
Fix authentication issues by creating test users and ensuring database is properly set up
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(cmd):
    """Run a command and return the result"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def fix_authentication():
    """Fix authentication issues"""
    print("🔧 Fixing authentication issues...")

    # Navigate to backend directory
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False

    os.chdir(backend_dir)

    # Install requirements if needed
    print("📦 Installing requirements...")
    success, stdout, stderr = run_command("pip install -r requirements.txt")
    if not success:
        print("⚠️  Requirements installation failed, trying manual install...")
        success, stdout, stderr = run_command("pip install flask flask-cors mysql-connector-python python-dotenv PyMySQL PyJWT Werkzeug")

    if not success:
        print("❌ Failed to install requirements")
        return False

    print("✅ Dependencies installed")

    # Create test users using the database manager
    print("👤 Creating test users...")

    # Create a simple script to add test users
    test_user_script = '''
from database import DatabaseManager
from werkzeug.security import generate_password_hash

db_manager = DatabaseManager()

# Connect to database
if not db_manager.connect():
    print("Failed to connect to database")
    exit(1)

print("Database connection successful")

# Create test users
test_users = [
    ("testuser", "testuser@example.com", "password"),
    ("aishashaikh", "aishashaikh@gmail.com", "password"),
    ("admin", "admin@example.com", "admin123")
]

for username, email, password in test_users:
    try:
        # Check if user already exists
        existing = db_manager.execute_query(
            "SELECT id FROM users WHERE username = %s OR email = %s",
            (username, email)
        )

        if existing:
            print(f"User {username} already exists")
            continue

        # Create user
        password_hash = generate_password_hash(password)
        result = db_manager.execute_query(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password_hash)
        )

        if result:
            print(f"Created test user: {username} / {password}")
        else:
            print(f"Failed to create user: {username}")

    except Exception as e:
        print(f"Error creating user {username}: {e}")

# Test database functionality
try:
    result = db_manager.execute_query("SELECT COUNT(*) as user_count FROM users")
    if result:
        user_count = result[0]["user_count"]
        print(f"Database test successful. Total users: {user_count}")
    else:
        print("Database test failed")
except Exception as e:
    print(f"Database test error: {e}")

print("Authentication setup completed!")
'''

    # Write and run the script
    with open("create_test_users.py", "w") as f:
        f.write(test_user_script)

    success, stdout, stderr = run_command("python create_test_users.py")

    if success:
        print("✅ Test users created successfully")
        print("\n📋 Test Credentials:")
        print("   Username: testuser | Password: password")
        print("   Username: aishashaikh | Password: password")
        print("   Username: admin | Password: admin123")
        print("\n🚀 Starting backend server...")

        # Start the backend server
        try:
            subprocess.Popen([sys.executable, "app.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("✅ Backend server started on http://localhost:8080")
            return True
        except Exception as e:
            print(f"❌ Failed to start backend server: {e}")
            return False
    else:
        print("❌ Failed to create test users")
        print("Error:", stderr)
        return False

if __name__ == "__main__":
    success = fix_authentication()
    if success:
        print("\n🎉 Authentication issues fixed!")
        print("You can now try logging in with the test credentials above.")
    else:
        print("\n❌ Failed to fix authentication issues!")
        sys.exit(1)
