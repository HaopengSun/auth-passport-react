const express = require("express");
const Blacklist = require("../models/blacklist");

const router = express.Router();

router.post('/logout', async (req, res) => {
    req.session.destroy();

    // save blacklist token
    const token = req.headers.authorization.split(' ')[1];
    const newToken = new Blacklist({ token });
    await newToken.save().catch((err) => {
      console.log("Error: ", err);
      res.status(500).json({ error: "Cannot save blacklist token!" });
    });

    res.json({ message: 'Logged out' });
});

module.exports = router;