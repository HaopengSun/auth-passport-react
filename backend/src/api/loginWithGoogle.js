const express = require("express");
const passport = require("passport");

const router = express.Router();

const successLoginUrl = "http://localhost:3000/login/success";
const errorLoginUrl = "http://localhost:3000/login/error";

// authenticate user using Google
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback from Google
router.get(
  "/auth/google/callback",
  // middleware to check whether anthentication is given or revoked
  passport.authenticate("google", {
    failureMessage: "Cannot login to Google, please try again later!",
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req, res) => {
    console.log("User: ", req.user);
    res.send("Thank you for signing in!");
  }
);

module.exports = router;
