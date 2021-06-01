const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName} - ${Date.now()}.${extension}`);
  },
});

var uploadOptions = multer({ storage: storage });

//promises(error handling) can be made in both ways by using {then, catch,etc} or using async methods and await keyword
router.get(`/`, async (req, res) => {
  // there are three methods by which we can pass req to backend, first - by body, by normal URL params and by query params(start usually with '?')

  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category");

  /*
  Product.find().select("name image -_id"); select method helps us to display specific things like here we are displaying name and image without _id
  */

  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

router.get(`/:productId`, async (req, res) => {
  Product.findById(req.params.productId)
    .populate("category")
    .then((product) => {
      if (product) {
        res.status(201).send(product);
      } else {
        res.status(404).json({
          success: false,
          message: `product not found, please check the id`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
});

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).send(`invalid Category`);
  }
  const file = req.file;
  if (!file) {
    return res.status(404).send(`No image in request`);
  }
  const fileName = req.file.fileName;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    quantity: req.body.quantity,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  const newProduct = await product.save();
  if (!newProduct) {
    res.status(404).json({
      success: false,
      message: `failed to add product`,
    });
  }
  res.send(product);
});

router.put("/:productId", async (req, res) => {
  //validate category
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(404).send(`Invalid Category!`);
  }
  let id = req.params.productId;
  Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true, // this parameter to get new data of category otherwise res.send(category) will give old json data of category
    }
  )
    .then((product) => {
      if (product) {
        res.status(201).json({
          message: `updated successfully!`,
          product: product,
        });
      } else {
        res.status(404).json({
          success: false,
          message: `failed to update!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
});

router.delete("/:productId", async (req, res) => {
  let id = req.params.productId;
  Product.findByIdAndRemove(id)
    .then((product) => {
      if (product) {
        return res.status(201).json({
          success: true,
          message: "product deleted successfully!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "product not found, please check the id",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: err,
      });
    });
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);
  productCount
    ? res.send({ productCount: productCount })
    : res.status(500).json({ success: false });
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);
  //+count converts string to int we can also pass parameter parseInt(count) to limit method

  products ? res.send(products) : res.status(500).json({ success: false });
});

module.exports = router;
