import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 47.6062,
  lng: -122.3321,
};

function App() {
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [routeDetails, setRouteDetails] = useState([]);
  const [totalDistance, setTotalDistance] = useState('');
  const [totalDuration, setTotalDuration] = useState('');
  const [travelMode, setTravelMode] = useState('DRIVING');

  const handleAddLocation = async (event) => {
    event.preventDefault();
    const locationName = event.target.elements.location.value;

    if (locationName) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: locationName,
              key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            },
          }
        );

        const { lat, lng } = response.data.results[0].geometry.location;

        setMarkers([...markers, { name: locationName, position: { lat, lng } }]);
        event.target.reset();
      } catch (error) {
        console.error('Error fetching location coordinates:', error);
        alert('Unable to find location. Please try again.');
      }
    }
  };

  const handleGenerateRoute = (optimize = false) => {
    if (markers.length < 2) {
      alert('Please enter at least two locations to generate a route.');
      return;
    }

    const waypoints = markers.slice(1, -1).map((marker) => ({
      location: marker.position,
      stopover: true,
    }));

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: markers[0].position,
        destination: markers[markers.length - 1].position,
        waypoints: waypoints,
        optimizeWaypoints: optimize,
        travelMode: travelMode,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          // Extract route details
          const legs = result.routes[0].legs;
          const details = legs.map((leg) => ({
            startAddress: leg.start_address,
            endAddress: leg.end_address,
            distance: leg.distance.text,
            duration: leg.duration.text,
          }));
          setRouteDetails(details);

          // Calculate total distance and duration
          const totalDist = legs.reduce((sum, leg) => sum + leg.distance.value, 0);
          const totalDur = legs.reduce((sum, leg) => sum + leg.duration.value, 0);
          setTotalDistance((totalDist / 1000).toFixed(2) + ' km');
          setTotalDuration((totalDur / 60).toFixed(0) + ' mins');
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedMarkers = Array.from(markers);
    const [removed] = reorderedMarkers.splice(result.source.index, 1);
    reorderedMarkers.splice(result.destination.index, 0, removed);

    setMarkers(reorderedMarkers);
  };

  return (
    <div>
      <h1>Travel Route Planner</h1>
      <form onSubmit={handleAddLocation}>
        <input type="text" name="location" placeholder="Enter a location" />
        <button type="submit">Add Location</button>
      </form>
      <label htmlFor="travelMode">Select Travel Mode:</label>
      <select
        id="travelMode"
        value={travelMode}
        onChange={(e) => setTravelMode(e.target.value)}
      >
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Bicycling</option>
        <option value="TRANSIT">Public Transit</option>
      </select>
      <button onClick={() => handleGenerateRoute(false)}>Generate Route</button>
      <button onClick={() => handleGenerateRoute(true)}>Optimize Route</button>

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center}>
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position} label={marker.name} />
          ))}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      {/* Drag and Drop List */}
      <h2>Locations</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="locations">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {markers.map((marker, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {marker.name}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Route Details */}
      {routeDetails.length > 0 && (
        <div>
          <h2>Route Details</h2>
          <ul>
            {routeDetails.map((detail, index) => (
              <li key={index}>
                <strong>From:</strong> {detail.startAddress} <br />
                <strong>To:</strong> {detail.endAddress} <br />
                <strong>Distance:</strong> {detail.distance} <br />
                <strong>Duration:</strong> {detail.duration}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Itinerary Summary */}
      {totalDistance && totalDuration && (
        <div>
          <h2>Itinerary Summary</h2>
          <p><strong>Total Distance:</strong> {totalDistance}</p>
          <p><strong>Total Duration:</strong> {totalDuration}</p>
        </div>
      )}
    </div>
  );
}

export default App;
