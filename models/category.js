const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    icon:{
        type: String,
    },
    color:{
        type: String,
    },
});

//with model class we construct documents with properties declared in Schema.
exports.Category = mongoose.model("Category", categorySchema);
