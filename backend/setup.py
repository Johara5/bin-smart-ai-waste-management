#!/usr/bin/env python3
"""
Setup script for Bin Smart Backend
This script installs dependencies and initializes the database
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_mysql_connection():
    """Test MySQL connection"""
    print("Testing MySQL connection...")
    try:
        from database import DatabaseManager
        db = DatabaseManager()
        if db.create_database_if_not_exists() and db.connect():
            print("✅ MySQL connection successful!")
            db.disconnect()
            return True
        else:
            print("❌ MySQL connection failed!")
            return False
    except Exception as e:
        print(f"❌ MySQL connection error: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Bin Smart Backend...")
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("Please create .env file with your MySQL credentials")
        return False
    
    # Install dependencies
    if not install_requirements():
        return False
    
    # Test MySQL connection
    if not check_mysql_connection():
        print("Please check your MySQL credentials in .env file")
        return False
    
    print("🎉 Setup completed successfully!")
    print("You can now run the backend with: python app.py")
    return True

if __name__ == "__main__":
    main()
