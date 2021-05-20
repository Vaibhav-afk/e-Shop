const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

});

//with model class we construct documents with properties declared in Schema.
exports.Product = mongoose.model("User", userSchema);
