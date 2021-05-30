const express = require("express");
const router = express.Router();
const { OrderItem } = require("../models/order-item");
const { Order } = require("../models/order");

//promises(error handling) can be made in both ways by using {then, catch,etc} or using async methods and await keyword
router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  if (!orderList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(orderList);
});

router.get(`/:orderId`, async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  if (!order) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(order);
});

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) {
    return res.status(400).send("the order cannot be placed!");
  }
  res.send(order);
});

router.put("/:orderId", async (req, res) => {
  let id = req.params.orderId;
  const order = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true, // this parameter to get new data of order otherwise res.send(order) will give old json data of order
    }
  );
  if (!order) {
    res.status(404).json({
      success: false,
      message: `failed to update!`,
    });
  }
  res.send(order);
});

router.delete("/:orderId", (req, res) => {
  let id = req.params.orderId;
  Order.findByIdAndRemove(id)
    .then(async (order) => {
      if (order) {
        await order.orderItem.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.status(201).json({
          success: true,
          message: "order deleted successfully!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "order not found, please check the id",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
