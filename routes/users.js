const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

//we can use async method and await keyword for error handling apart from promises(i.e then, catch,etc)
router.get(`/`, async (req, res) => {
  const userList = await User.find();
  if (!userList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(userList);
});

module.exports = router;
