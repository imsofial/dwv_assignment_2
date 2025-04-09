# Web Traffic Visualization

This project visualizes web traffic data collected from various locations around the world. The system consists of three main components: a data sender, a backend server, and a frontend visualization built with Three.js.

## Project Structure

```
web-traffic-visualization/
├── backend/        # Flask server
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── __init__.py
├── frontend/       # Visualization with Three.js
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── Dockerfile
├── sender/         # CSV data sender
│   ├── sender.py
│   ├── requirements.txt
│   ├── Dockerfile
├── docker-compose.yml  # Compose file to run the entire system
└── .env                # Environment variables
```

## Installation and Running

### Prerequisites

- Docker & Docker Compose
- Python 3.8+
- JavaScript, HTML

### Running the Application

1. Clone the repository:

   ```sh
   git clone https://github.com/imsofial/dwv_assignment_2.git
   ```

2. Build and start the Docker containers:

   ```sh
   docker-compose up --build
   ```

3. Access the frontend in your browser at:
   ```
   http://localhost/
   ```

### Stopping the Application

To stop and remove all running containers, use:

```sh
docker-compose down
```

## Components

### 1. Data Sender (`sender/`)

- Reads data from a CSV file containing IP addresses, locations, timestamps, and suspicious marks.
- Sends data to the backend server at the specified time intervals.
- Implemented in Python using `requests`.

### 2. Backend (`backend/`)

- Implements a Flask server that receives data from the sender.
- Stores and processes incoming data.
- Sends processed data to the frontend.

### 3. Frontend (`frontend/`)

- Uses Three.js to visualize web traffic on a 3D globe.
- Displays real-time data updates.
- Implements interactive features for better analysis.

## API Endpoints

### **Backend**

#### Receive data from sender

```http
POST /receive
```

**Request Body (JSON):**

```json
{
  "ip": "192.168.1.1",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "timestamp": 1712345678,
  "suspicious": 0
}
```

#### Get data for frontend

```http
GET /data
```

Returns:

```json
[
  {
    "ip": "192.168.1.1",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "timestamp": 1712345678,
    "suspicious": 0
  }
]
```

## Deployment

This project is containerized with Docker. To deploy it on a remote server:

```sh
docker-compose up -d
```

## Authors

- Sofia Goryunova
- Course: Data Wrangling and Visualization

## License

This project is licensed under the MIT License.
