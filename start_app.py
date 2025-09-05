#!/usr/bin/env python3
"""
Startup script for Bin Smart Application
This script starts both the Python backend and React frontend
"""

import subprocess
import sys
import os
import time
from threading import Thread

def start_backend():
    """Start the Python Flask backend"""
    print("🚀 Starting Python backend...")
    os.chdir("backend")
    try:
        # Install requirements first
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        # Start the Flask app
        subprocess.run([sys.executable, "app.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend failed to start: {e}")
    except KeyboardInterrupt:
        print("🛑 Backend stopped")

def start_frontend():
    """Start the React frontend"""
    print("🚀 Starting React frontend...")
    os.chdir("..")  # Go back to root directory
    try:
        subprocess.run(["npm", "run", "dev"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend failed to start: {e}")
    except KeyboardInterrupt:
        print("🛑 Frontend stopped")

def main():
    """Main startup function"""
    print("🌱 Starting Bin Smart Application...")
    print("📋 Make sure to update backend/.env with your MySQL credentials!")
    print("⏳ Starting in 3 seconds...")
    time.sleep(3)
    
    # Start backend in a separate thread
    backend_thread = Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a bit for backend to start
    time.sleep(5)
    
    # Start frontend
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("🛑 Application stopped")

if __name__ == "__main__":
    main()
