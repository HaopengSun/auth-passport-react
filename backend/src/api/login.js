const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userWithEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (!userWithEmail)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });

  if (userWithEmail.password !== password)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });

  // Generate access token
  const accessToken = jwt.sign(
    { id: userWithEmail.id, email: userWithEmail.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: userWithEmail.id, email: userWithEmail.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

  res.json({ message: "Welcome Back!", token: { accessToken, refreshToken } });
});

module.exports = router;
