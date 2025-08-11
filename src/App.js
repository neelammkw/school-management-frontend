import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [userLocation, setUserLocation] = useState({
    latitude: '',
    longitude: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' }); // For status messages

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools with params:', {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
      
      const response = await axios.get('http://localhost:3000/api/listSchools', {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        }
      });
      
      console.log('Schools data received:', response.data);
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setMessage({ text: 'Failed to fetch schools', type: 'error' });
    }
  };

  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
      fetchSchools();
    }
  }, [userLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setUserLocation({
      ...userLocation,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting school data:', formData);
      
      const response = await axios.post('http://localhost:3000/api/addSchool', formData);
      
      console.log('School added successfully:', response.data);
      setMessage({ text: 'School added successfully!', type: 'success' });
      
      fetchSchools(); // Refresh the list
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error adding school:', error);
      setMessage({ text: 'Failed to add school', type: 'error' });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>School Management System</h1>
        {/* Status message display */}
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}
      </header>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2>Add New School</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>School Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add School</button>
            </form>

            <h2 style={{marginTop: '30px'}}>Your Location</h2>
            <div className="form-group">
              <label>Your Latitude</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="latitude"
                value={userLocation.latitude}
                onChange={handleLocationChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Your Longitude</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="longitude"
                value={userLocation.longitude}
                onChange={handleLocationChange}
                required
              />
            </div>
            <button 
              onClick={fetchSchools} 
              className="btn btn-secondary"
              disabled={!userLocation.latitude || !userLocation.longitude}
            >
              Update School Distances
            </button>
          </div>

          <div className="col-md-6">
            <h2>School List (Sorted by Distance)</h2>
            {schools.length === 0 ? (
              <p>No schools found. Add a school to get started.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school) => (
                    <tr key={school.id}>
                      <td>{school.name}</td>
                      <td>{school.address}</td>
                      <td>{school.distance.toFixed(2)} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;