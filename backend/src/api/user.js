const express = require("express");
const { isUserAuthenticated, verifyAccessToken, refreshAccessToken } = require("../middlewares/auth");

const router = express.Router();

router.get("/auth/user", isUserAuthenticated, verifyAccessToken, refreshAccessToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
