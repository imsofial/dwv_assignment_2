import pandas as pd
import requests 
import time
import json

SERVER_URL = "http://backend:5000/receive"
# SERVER_URL = "http://127.0.0.1:5000/receive"

CSV_FILE = 'ip_addresses.csv'

def send_data():
    data = pd.read_csv(CSV_FILE)
    timestamp = data['Timestamp'].tolist()
    
    start_time = data.iloc[0]["Timestamp"]

    for index, row in data.iterrows():
        package = {
            "ip": row["ip address"],
            "latitude": row["Latitude"],
            "longitude": row["Longitude"],
            "timestamp": row["Timestamp"],
            "suspicious": row["suspicious"]
        }
        delay = row["Timestamp"] - start_time

        if delay > 0:
            time.sleep(delay)

        response = requests.post(SERVER_URL, json=package)
        print(f"Sent package {index+1}: {package}, Response: {response.status_code}")

if __name__ == "__main__":
    send_data()