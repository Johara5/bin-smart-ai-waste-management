#!/usr/bin/env python3
"""
Start the main Flask backend server instead of the mock server
"""

import subprocess
import sys
import os
from pathlib import Path

def start_main_backend():
    """Start the main Flask backend server"""

    print("🚀 Starting main Flask backend server...")

    # Navigate to backend directory
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False

    os.chdir(backend_dir)

    # Kill any existing processes on port 8080
    print("🛑 Stopping any existing servers on port 8080...")
    try:
        # Find and kill processes using port 8080
        result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if '8080' in line and 'LISTENING' in line:
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    subprocess.run(['taskkill', '/PID', pid, '/F'], capture_output=True)
                    print(f"✅ Killed process {pid}")
    except Exception as e:
        print(f"⚠️  Could not kill existing processes: {e}")

    # Start the main Flask app
    print("🚀 Starting Flask app...")
    try:
        # Start the Flask app in background
        process = subprocess.Popen(
            [sys.executable, "app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        print("✅ Flask backend started!")
        print("📋 Server should be running on http://localhost:8080")

        # Wait a moment for server to start
        import time
        time.sleep(3)

        # Test the server
        try:
            import requests
            response = requests.get('http://localhost:8080/api/health', timeout=5)
            if response.status_code == 200:
                health_data = response.json()
                print(f"✅ Server health check passed: {health_data}")
                return True
            else:
                print(f"❌ Server health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Server health check error: {e}")
            return False

    except Exception as e:
        print(f"❌ Failed to start Flask server: {e}")
        return False

if __name__ == "__main__":
    success = start_main_backend()
    if success:
        print("\n🎉 Main backend server started successfully!")
        print("You can now test authentication at http://localhost:5174/")
    else:
        print("\n❌ Failed to start main backend server!")
        sys.exit(1)
