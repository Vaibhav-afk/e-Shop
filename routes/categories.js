const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

//we can use async method and await keyword for error handling apart from promises(i.e then, catch,etc)
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(categoryList);
});

module.exports = router;
