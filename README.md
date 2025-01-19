# Travel Route Planner

## Key Differences and Advantages

The Travel Route Planner provides tailored trip planning and optimization features that distinguish it from Google Maps:

### Customized Itineraries
- Users can input multiple destinations, preferred travel modes, and trip durations for a personalized experience.

### Route Optimization
- Automatically generates the most efficient routes between locations, saving time and effort.

### Focused Features
- Designed specifically for planning trips in Seattle, with local insights and constraints.

### Database Integration
- Allows users to save and retrieve trips for future reference, a feature not natively available in Google Maps.

## Overview
The Travel Route Planner is a full-stack web application designed to help users plan travel routes effectively. Users can add multiple locations, select a travel mode, and generate optimized routes displayed on an interactive Google Map. The backend stores user trip details in a MongoDB database.

---

## Features

### Frontend
- **Interactive Map:** Displays routes between locations using the Google Maps API.
- **Travel Mode Selection:** Supports driving, walking, and bicycling modes.
- **Add Locations:** Allows users to input multiple destinations.
- **Route Optimization:** Calculates and displays the most efficient route.

### Backend
- **REST API:** Provides endpoints for creating, retrieving, and managing trip data.
- **Database Integration:** Stores trip details in a MongoDB database.
- **City Filter:** Limits trips to Seattle for initial testing purposes.

---

## Setup Instructions

### Prerequisites
- Node.js (v22.9.0 or above)
- npm
- MongoDB Atlas account or local MongoDB instance
- Google Cloud Platform API key (Google Maps)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yvonnejhao/Travel-Planner.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Travel-Planner
   ```

3. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. Create `.env` files:

#### Backend `.env`:
   ```plaintext
   MONGO_URI=<your_mongodb_connection_string>
   PORT=5000
   GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>
   ```

#### Frontend `.env`:
   ```plaintext
   REACT_APP_GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>
   ```

---

## Usage

### Starting the Backend Server
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Start the server:
   ```bash
   node server.js
   ```

### Starting the Frontend Application
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the React development server:
   ```bash
   npm start
   ```

### Access the Application
Open your web browser and go to:
```
http://localhost:3000
```

---

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Endpoints
#### `GET /api/trips`
- Retrieves all trips stored in the database.

#### `POST /api/trips`
- Creates a new trip.
- **Body Parameters:**
  ```json
  {
    "destination": "Seattle",
    "days": 3,
    "modeOfTransport": "Car"
  }
  ```

---

## Acknowledgments
- Google Maps API for route and map visualization.
- MongoDB for database management.
- Express.js for backend RESTful API development.
- React.js for frontend user interface.

---

## Contributing
Contributions are welcome! Please follow the standard GitHub flow:
1. Fork the repository.
2. Create a new branch.
3. Commit changes.
4. Submit a pull request.



