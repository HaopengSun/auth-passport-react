const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist");

// Middleware to check JWT token
async function verifyAccessToken(req, res, next) {
  const accessToken = req.headers.authorization.split(' ')[1];

  // check blacklist
  const blacklist = await Blacklist.findOne({ where: { accessToken } }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (blacklist) {
    return res.status(401).json({ message: 'Token revoked' });
  }

  // Verify token and proceed
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Middleware to check JWT token
async function refreshAccessToken(req, res, next) {
  // const refreshToken = req.body.refreshToken;
  const refreshToken = req.headers.authorization.split(' ')[1];

  // Verify token and proceed
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Generate new access token
    const accessToken = jwt.sign(
      { id: req.user.id, email: req.user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
    req.user = decoded;
    next();
  });
}

function isUserAuthenticated(req, res, next){
  if (req.user) {
    next();
  } else {
    res.status(401).send("You must login first!");
  }
};

module.exports = { verifyAccessToken, refreshAccessToken, isUserAuthenticated };