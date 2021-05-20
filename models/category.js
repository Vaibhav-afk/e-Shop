const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

});

//with model class we construct documents with properties declared in Schema.
exports.Category = mongoose.model("Category", categorySchema);
