const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

//promises(error handling) can be made in both ways by using {then, catch,etc} or using async methods and await keyword
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
