const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({});

//We can create virtual "id" which has same value as of "_id"

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

//with model class we construct documents with properties declared in Schema.
exports.Order = mongoose.model("Order", orderSchema);
