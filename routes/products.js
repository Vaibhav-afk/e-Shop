const express = require("express");
const router = express.Router();
const {Product} = require("../models/product");

//we can use async method and await keyword for error handling apart from promises(i.e then, catch,etc)
router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

router.post(`/`, (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    image: req.body.image,
    quantity: req.body.quantity,
  });
  newProduct
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;
