import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';


function App() {
  //state vars
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  //fetching events data from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // authenticate user and save JWT token in state
  const authenticateUser = async () => {
    try {
      const response = await axios.post('/api/auth', {
        username: 'admin',
        password: 'password',
      });
  
      const { token } = response.data;
  
      // save JWT token in state
      setToken(token);
    } catch (error) {
      console.error('Error authenticating user:', error);
    }
  };  

  // perform user authentication when component mounts
  useEffect(() => {
    authenticateUser();
  }, []);

  //selecting, updating, and deleting event from table
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleEventUpdate = async () => {
    try {
      await axios.put(`/api/events/${selectedEvent.id}`, selectedEvent);
      // refresh events data
      const response = await axios.get('/api/events');
      setEvents(response.data);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEventDelete = async () => {
    try {
      await axios.delete(`/api/events/${selectedEvent.id}`);
      // refresh events data
      const response = await axios.get('/api/events');
      setEvents(response.data);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  //table to display data
  return (
    <div className="App">
      <h1>Events</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>
                <button onClick={() => handleEventSelect(event)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEvent && (
        <div>
          <h2>Edit Event</h2>
          <label>
            Title:
            <input
              type="text"
              value={selectedEvent.title}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, title: e.target.value })
              }
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={selectedEvent.description}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  description: e.target.value,
                })
              }
            />
          </label>
          <button onClick={handleEventUpdate}>Update</button>
          <button onClick={handleEventDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default App;
