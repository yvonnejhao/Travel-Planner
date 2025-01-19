const express = require("express");
const Trip = require("../models/Trip");

const router = express.Router();

// GET: Retrieve all trips or filter by user/location
router.get("/", async (req, res) => {
  const { user, location } = req.query;

  const filter = {};
  if (user) filter.user = user;
  if (location) filter.locations = { $in: [location] };

  try {
    const trips = await Trip.find(filter);
    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

// POST: Add a new trip
router.post("/", async (req, res) => {
  const { user, locations, routeDetails, totalDistance, totalDuration } = req.body;

  if (!user || !locations || locations.length === 0) {
    return res.status(400).json({ error: "User and at least one location are required" });
  }

  try {
    const trip = new Trip({
      user,
      locations,
      routeDetails,
      totalDistance,
      totalDuration,
    });

    await trip.save();
    res.status(201).json({ message: "Trip saved successfully", trip });
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ error: "Failed to save trip" });
  }
});

// GET: Retrieve total number of trips
router.get("/count", async (req, res) => {
  try {
    const count = await Trip.countDocuments();
    res.status(200).json({ totalTrips: count });
  } catch (error) {
    console.error("Error counting trips:", error);
    res.status(500).json({ error: "Failed to count trips" });
  }
});

// DELETE: Remove a trip by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

module.exports = router;
