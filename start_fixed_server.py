#!/usr/bin/env python3
"""
Start the fixed mock server with aishashaikh user
"""

import subprocess
import sys
import os
from pathlib import Path

def start_fixed_server():
    """Start the fixed mock server"""

    print("🚀 Starting Fixed Mock Server...")

    # Navigate to backend directory
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False

    os.chdir(backend_dir)

    # Start the fixed mock server
    try:
        print("📝 Starting server with test users:")
        print("   - Username: testuser, Password: password")
        print("   - Username: aishashaikh, Password: password")
        print("   - Username: admin, Password: admin123")

        # Start the server
        process = subprocess.Popen(
            [sys.executable, "mock_server_fixed.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        print("✅ Fixed mock server started!")
        print("📋 Server running on http://localhost:8080")

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
        print(f"❌ Failed to start server: {e}")
        return False

if __name__ == "__main__":
    success = start_fixed_server()
    if success:
        print("\n🎉 Fixed server started successfully!")
        print("You can now test authentication at http://localhost:5174/")
        print("Try logging in with: aishashaikh / password")
    else:
        print("\n❌ Failed to start fixed server!")
        sys.exit(1)
