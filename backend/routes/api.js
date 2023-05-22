const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Measurement = require('../models/measurement');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // get the JWT token from the request headers
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  //edge case
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  // verify the token
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      // if verification fails, return an error response
      return res.status(401).json({ error: 'Invalid token' });
    }

    // if verification is successful, attach the decoded payload to the request object
    req.user = decoded;

    // call the next middleware function
    next();
  });
};

// apply the authentication middleware to the API routes
router.use(authenticateToken);


//CRUD operations for Events:

// retrieve all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving events.' });
  }
});
// retrieve a specific event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the event.' });
  }
});

// create a new event
router.post('/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const createdEvent = await newEvent.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the event.' });
  }
});

// update an event
router.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the event.' });
  }
});

// delete an event
router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the event.' });
  }
});

//CRUD operations for Measurement:

// retrieve all measurements
router.get('/measurements', async (req, res) => {
  try {
    const measurements = await Measurement.find();
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving measurements.' });
  }
});

// retrieve a specific measurement by ID
router.get('/measurements/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found.' });
    }
    res.json(measurement);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the measurement.' });
  }
});

// create a new measurement
router.post('/measurements', async (req, res) => {
  try {
    const newMeasurement = new Measurement(req.body);
    const createdMeasurement = await newMeasurement.save();
    res.status(201).json(createdMeasurement);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the measurement.' });
  }
});

// update a measurement
router.put('/measurements/:id', async (req, res) => {
  try {
    const updatedMeasurement = await Measurement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedMeasurement) {
      return res.status(404).json({ error: 'Measurement not found.' });
    }
    res.json(updatedMeasurement);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the measurement.' });
  }
});

// delete a measurement
router.delete('/measurements/:id', async (req, res) => {
  try {
    const deletedMeasurement = await Measurement.findByIdAndDelete(req.params.id);
    if (!deletedMeasurement) {
      return res.status(404).json({ error: 'Measurement not found.' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the measurement.' });
  }
});

module.exports = router;
