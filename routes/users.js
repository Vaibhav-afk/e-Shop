const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//promises(error handling) can be made in both ways by using {then, catch,etc} or using async methods and await keyword
router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(userList);
});

router.get(`/:userId`, async (req, res) => {
  const user = await User.findById(req.params.userId).select("-passwordHash");
  if (!user) {
    res.status(500).json({
      message: `No such user exist, please check id!`,
    });
  }
  res.send(user);
});

//Admin can register or signup using this route
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send(`the user cannot be created!`);
  }
  res.send(user);
});

//This is for non admin users for signup
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send(`the user cannot be created!`);
  }
  res.send(user);
});

router.post("/login", async (req, res) => {
  const secret = process.env.secret;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("no such user found.");
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("Invalid password");
  }
});

router.delete("/:userId", async (req, res) => {
  let id = req.params.userId;
  User.findByIdAndRemove(id)
    .then((user) => {
      if (user) {
        return res.status(201).json({
          success: true,
          message: "user deleted successfully!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "user not found, please check the id",
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
  const userCount = await User.countDocuments((count) => count)

  userCount ? res.send({userCount: userCount}) : res.status(500).json({ success: false });
});

module.exports = router;
