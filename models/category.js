const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

//We can create virtual "id" which has same value as of "_id"

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

//with model class we construct documents with properties declared in Schema.
exports.Category = mongoose.model("Category", categorySchema);
