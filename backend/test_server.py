from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "message": "Test server is running"})

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Test endpoint"""
    return jsonify({"message": "Test endpoint working!"})

if __name__ == '__main__':
    print("Starting test Flask server on port 8080")
    app.run(debug=True, host='0.0.0.0', port=8080)
