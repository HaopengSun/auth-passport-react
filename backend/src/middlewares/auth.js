const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist");

// Middleware to check JWT token
async function checkToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];

  const blacklist = await Blacklist.findOne({ where: { token } }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (blacklist) {
    return res.status(401).json({ message: 'Token revoked' });
  }

  // Verify token and proceed
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

module.exports.isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    checkToken(req, res, next);
  } else {
    res.status(401).send("You must login first!");
  }
};
