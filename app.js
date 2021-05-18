const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');

//middleware which helps our backend to understand json 
app.use(express.json());
app.use(morgan('tiny'));

require('dotenv/config');

const api = process.env.url;

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    quantity: {
        type: Number,
        required: true
    }
});

//with model class we construct documents with properties declared in Schema.
const Product = mongoose.model('Product', productSchema);


//we can use async method and await keyword for error handling apart from promises(i.e then, catch,etc)
app.get(`${api}/products`, async (req, res) => {
    const productList = await Product.find();

    if (!productList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        quantity: req.body.quantity
    });
    newProduct.save().then((createdProduct) => {
            res.status(201).json(createdProduct);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                success: false
            })
        });
});

mongoose.connect(process.env.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('database connected succesfully');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log("Server started successfully! at http://localhost:3000");
});