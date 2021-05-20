const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  quantity: {
    type: Number,
    required: true,
  },
});

//with model class we construct documents with properties declared in Schema.
exports.Product = mongoose.model("Product", productSchema);
