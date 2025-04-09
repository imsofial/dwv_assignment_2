import pandas as pd
import requests

SERVER_URL = "http://127.0.0.1:5000/receive"

data = pd.read_csv("sender/ip_addresses.csv")

for index, row in data.iterrows():
    package = {
        "ip": row["ip address"],
        "latitude": row["Latitude"],
        "longitude": row["Longitude"],
        "timestamp": row["Timestamp"],
        "suspicious": row["suspicious"]
    }
    response = requests.post(SERVER_URL, json=package)
    print(f"Sent package {index+1}: {package}, Response: {response.status_code}")
start_time = data.iloc[0]["Timestamp"]
print(start_time)