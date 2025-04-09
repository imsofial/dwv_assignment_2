from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data_store = []

@app.route('/receive', methods=["POST"])
def recieve_data():
    '''Takes json packets from client and saves it'''
    package = request.json
    data_store.append(package)
    print(f"Recieved package {package}")
    return jsonify({"status":"success"}), 200

@app.route('/get', methods=["GET"])
def get_data():
    '''Gets data from server for frontend'''
    return jsonify(data_store)

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)