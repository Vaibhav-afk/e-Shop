const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

//promises(error handling) can be made in both ways by using {then, catch,etc} or using async methods and await keyword
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(201).send(categoryList);
});

router.get(`/:categoryId`, async (req, res) => {
  let id = req.params.categoryId;
  Category.findById(id).then((category) => {
    if(!category){
      res.status(404).json({
        success: false,
        message:`category not found, please check the id`,
      })
    }else{
      res.status(201).json({
        success: true,
        category:category,
      });
    }
  }).catch(err =>{
    res.status(500).json({
      success: true,
      error:err,
    });
  });
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send(`the category not created!`);
  }
  res.send(category);
});

router.put("/:categoryId", async (req, res) => {
  let id = req.params.categoryId;
  const category = await Category.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    {
      new: true, // this parameter to get new data of category otherwise res.send(category) will give old json data of category
    }
  );
  if(!category){
    res.status(404).json({
      success: false,
      message: `failed to update!`
    });
  }
  res.send(category);
})

router.delete("/:categoryId",(req, res) => {
  let id = req.params.categoryId;
  Category.findByIdAndRemove(id)
    .then((category) => {
      if (category) {
        return res.status(201).json({
          success: true,
          message: "category deleted successfully!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "category not found, please check the id",
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

module.exports = router;
