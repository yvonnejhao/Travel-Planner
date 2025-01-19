// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Trip = require('./models/Trip'); // Import Trip model
const routes = require('./routes/routes'); // Import custom routes

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Root route for testing server
app.get('/', (req, res) => {
    res.send('Welcome to the Travel Route Planner API!');
});

// Custom routes
app.use('/api/trips', routes);

// Add GET endpoint for fetching all trips
app.get('/api/trips', async (req, res) => {
    try {
        const trips = await Trip.find(); // Fetch all trips from MongoDB
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trips', details: err.message });
    }
});

// Add POST endpoint for creating a new trip
app.post('/api/trips', async (req, res) => {
    const { destination, days, modeOfTransport } = req.body;
    try {
        const trip = new Trip({ destination, days, modeOfTransport });
        await trip.save(); // Save trip to MongoDB
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create trip', details: err.message });
    }
});

// Connect to MongoDB and start the server
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true, // Added options for compatibility
    })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('MongoDB connection error:', err));
