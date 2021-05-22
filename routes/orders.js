const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");

//we can use async method and await keyword for error handling apart from promises(i.e then, catch,etc)
router.get(`/`, async (req, res) => {
  const orderList = await Order.find();
  if (!orderList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(orderList);
});

module.exports = router;
