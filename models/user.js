const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  image: String,
  quantity: {
    type: Number,
    required: true,
  },
});

//with model class we construct documents with properties declared in Schema.
exports.User = mongoose.model("User", userSchema);
