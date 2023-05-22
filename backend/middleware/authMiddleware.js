const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // load env vars

const authenticateToken = (req, res, next) => {
  // Extract the JWT token from authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // no token provided - unauthorized
  }

  // verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // invalid token - forbidden
    }
    req.user = user; // store the authenticated user information in the request object
    next(); // proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
