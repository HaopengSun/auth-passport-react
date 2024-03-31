const express = require("express");
const Blacklist = require("../models/blacklist");

const router = express.Router();

// Array to store blacklisted tokens
const blacklist = [];

router.post('/logout', async (req, res) => {
    req.session.destroy();
    const token = req.headers.authorization.split(' ')[1];
    
    // save blacklist token
    const newToken = new Blacklist({ token });
    await newToken.save().catch((err) => {
      console.log("Error: ", err);
      res.status(500).json({ error: "Cannot register user at the moment!" });
    });

    res.json({ message: 'Logged out' });
});

module.exports = router;