const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({});

//with model class we construct documents with properties declared in Schema.
exports.Order = mongoose.model("Order", orderSchema);
