const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json()); //It helps our backend to understand json
app.use(morgan("tiny"));

//Routes
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.url;

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

//To remove deprecation warning fpr mongoose findAndModify method
mongoose.set("useFindAndModify", false);

//server
app.listen(3000, () => {
  console.log("Server started successfully! at http://localhost:3000");
});
