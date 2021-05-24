const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  image: String,
  quantity: {
    type: Number,
    required: true,
  },
});

//We can create virtual "id" which has same value as of "_id"

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

//with model class we construct documents with properties declared in Schema.
exports.User = mongoose.model("User", userSchema);
