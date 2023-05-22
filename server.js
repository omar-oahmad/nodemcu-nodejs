const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const mqtt = require('mqtt');
const authenticateToken = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// import necessary models
const { Event, Measurement } = require('./models');

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// create Express app
const app = express();

// set up middleware
app.use(bodyParser.json());
app.use('/api', apiRoutes); // precedes all routes defined in api.js with /api, to make accessible at /api/events & /api/events/:id
app.use(cors());

// MQTT client setup
const mqttClient = mqtt.connect('mqtt://broker.com'); // mqtt broker address will come here

// MQTT topic for receiving data from NodeMCU
const mqttTopic = 'nodemcu/data'; // mqtt topic will come here

// handle MQTT messages
mqttClient.on('message', (topic, message) => {
  // convert the received message to string
  const data = message.toString();

  // parse data and save to measurement schema
  const measurement = new Measurement({ value: data });
  measurement.save()
    .then((savedMeasurement) => {
      console.log('Measurement saved:', savedMeasurement);
    })
    .catch((error) => {
      console.error('Error saving measurement:', error);
    });
});

// subscribe to MQTT topic
mqttClient.on('connect', () => {
  mqttClient.subscribe(mqttTopic);
  console.log('Connected to MQTT broker');
});


// define routes and API endpoints

app.get('/api/data', (req, res) => {
  const data = {
    message: 'This is your API response',
  };
  res.json(data);
});

// Events CRUD operations

// create an event
app.post('/api/events', authenticateToken, (req, res) => {
  // extract required data from request body
  const { name, date, location } = req.body;

  // create new event using Event model
  const newEvent = new Event({
    name,
    date,
    location,
  });

  // save event to db
  newEvent.save()
    .then((event) => {
      // return created event in response
      res.json(event);
    })
    .catch((error) => {
      // handle any errors during saving process
      res.status(500).json({ error: 'Failed to create event' });
    });
});

// get all events
app.get('/api/events', authenticateToken, (req, res) => {
  // retrieve all events from Event model
  Event.find()
    .then((events) => {
      // return retrieved events in response
      res.json(events);
    })
    .catch((error) => {
      // handle any errors during retrieval process
      res.status(500).json({ error: 'Failed to retrieve events' });
    });
});

// get a single event by ID
app.get('/api/events/:id', authenticateToken, (req, res) => {
  // extract event ID from request params
  const eventId = req.params.id;

  // find event by ID in Event model
  Event.findById(eventId)
    .then((event) => {
      // check if event exists
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // return retrieved event in response
      res.json(event);
    })
    .catch((error) => {
      // handle any errors during retrieval process
      res.status(500).json({ error: 'Failed to retrieve event' });
    });
});

// update an event by ID
app.put('/api/events/:id', authenticateToken, (req, res) => {
  // extract event ID from request params
  const eventId = req.params.id;

  // extract updated data from request body
  const { name, date, location } = req.body;

  // find event by its ID in Event model and update its properties
  Event.findByIdAndUpdate(
    eventId,
    { name, date, location },
    { new: true }
  )
    .then((event) => {
      // check if event exists
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // return updated event in response
      res.json(event);
    })
    .catch((error) => {
      // handle any errors during update process
      res.status(500).json({ error: 'Failed to update event' });
    });
});

// delete an event by ID
app.delete('/api/events/:id', authenticateToken, (req, res) => {
  // extract event ID from request params
  const eventId = req.params.id;

  // find event by its ID in Event model and delete it
  Event.findByIdAndDelete(eventId)
    .then((deletedEvent) => {
      // check if event exists
      if (!deletedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // return a success message in response
      res.json({ message: 'Event deleted successfully' });
    })
    .catch((error) => {
      // handle any errors during deletion process
      res.status(500).json({ error: 'Failed to delete event' });
    });
});

// Measurements CRUD operations:

// create a measurement
app.post('/api/measurements', authenticateToken, (req, res) => {
  // extract required data from request body
  const { name, value } = req.body;

  // create a new measurement using Measurement model
  const newMeasurement = new Measurement({
    name,
    value,
  });

  // save measurement to db
  newMeasurement.save()
    .then((measurement) => {
      // return created measurement in response
      res.json(measurement);
    })
    .catch((error) => {
      // handle any errors during saving process
      res.status(500).json({ error: 'Failed to create measurement' });
    });
});

// get all measurements
app.get('/api/measurements', authenticateToken, (req, res) => {
  // retrieve all measurements from the Measurement model
  Measurement.find()
    .then((measurements) => {
      // return retrieved measurements in response
      res.json(measurements);
    })
    .catch((error) => {
      // handle any errors during retrieval process
      res.status(500).json({ error: 'Failed to retrieve measurements' });
    });
});

// get a single measurement by ID
app.get('/api/measurements/:id', authenticateToken, (req, res) => {
  // extract measurement ID from request params
  const measurementId = req.params.id;

  // find measurement by its ID in the Measurement model
  Measurement.findById(measurementId)
    .then((measurement) => {
      // check if measurement exists
      if (!measurement) {
        return res.status(404).json({ error: 'Measurement not found' });
      }

      // return retrieved measurement in response
      res.json(measurement);
    })
    .catch((error) => {
      // handle any errors during retrieval process
      res.status(500).json({ error: 'Failed to retrieve measurement' });
    });
});

// update a measurement by ID
app.put('/api/measurements/:id', authenticateToken, (req, res) => {
  // extract measurement ID from request params
  const measurementId = req.params.id;

  // extract updated data from request body
  const { name, value } = req.body;

  // Find measurement by its ID in the Measurement model and update its properties
  Measurement.findByIdAndUpdate(
    measurementId,
    { name, value },
    { new: true }
  )
    .then((measurement) => {
      // check if measurement exists
      if (!measurement) {
        return res.status(404).json({ error: 'Measurement not found' });
      }

      // return updated measurement in response
      res.json(measurement);
    })
    .catch((error) => {
      // handle any errors during update process
      res.status(500).json({ error: 'Failed to update measurement' });
    });
});

// delete a measurement by ID
app.delete('/api/measurements/:id', authenticateToken, (req, res) => {
  // extract measurement ID from request params
  const measurementId = req.params.id;

  // find measurement by ID in the Measurement model and delete it
  Measurement.findByIdAndDelete(measurementId)
    .then((deletedMeasurement) => {
      // check if measurement exists
      if (!deletedMeasurement) {
        return res.status(404).json({ error: 'Measurement not found' });
      }

      // return a success message in response
      res.json({ message: 'Measurement deleted successfully' });
    })
    .catch((error) => {
      // handle any errors during deletion process
      res.status(500).json({ error: 'Failed to delete measurement' });
    });
});

// user authentication
app.post('/api/auth/login', authController.login);

const secretKey = process.env.JWT_SECRET_KEY;

app.post('/api/auth', async (req, res) => {
  const { username, password } = req.body;

  // if user is authenticated, generate a new JWT token and send it as response
  if (username === 'admin' && password === 'password') {
    // create payload for the JWT token
    const payload = { username };

    // generate JWT token with payload and secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // return token in response
    res.json({ token });
  } else {
    // if authentication fails, return an error response
    res.status(401).json({ error: 'Invalid credentials' });
  }
});



// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
