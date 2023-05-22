const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // load env vars

const generateToken = (user) => {
  // generate a new JWT token for the user
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const login = (req, res) => {
  // if user is authenticated, generate a JWT token and send it in response
  const user = { id: 1, username: 'admin' };
  const token = generateToken(user);
  res.json({ token });
};

module.exports = {
  login,
};
