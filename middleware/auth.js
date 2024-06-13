const jwt = require("jsonwebtoken");

const { getUserByEmail } = require("../controllers/user");

const { JWT_PRIVATE_KEY } = require("../config");
const express = require("express");
const router = express.Router();

// trigger get function from controller
const isUserValid = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // perform user validation
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await getUserByEmail(decoded.email);
    // if user exist
    if (user) {
      // this is a valid user
      // to pass the user object to the next function
      req.user = user;
      // to trigger the next function
      next();
    } else {
      // this is not a valid user
      res.status(403).send({
        message: "You are not authorize to perform this action",
      });
    }
  } catch (error) {
    // error
    res.status(403).send({
      message: "You are not authorize to perform this action",
    });
  }
};

// validate if the log in user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // perform user validation
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await getUserByEmail(decoded.email);
    // if user exist
    if (user && user.role === "admin") {
      // this is a valid user
      // to pass the user object to the next function
      req.user = user;
      // to trigger the next function
      next();
    } else {
      // this is not a valid user
      res.status(403).send({
        message: "You are not authorize to perform this action",
      });
    }
  } catch (error) {
    // error
    res.status(403).send({
      message: "You are not authorize to perform this action",
    });
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Invalid token' });
  }
};

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { billplz_id, billplz_paid, billplz_paid_at, billplz_x_signature } = req.body;

        const order = await verifyPayment(
            billplz_id,
            billplz_paid,
            billplz_paid_at,
            billplz_x_signature
        );
       res.status(200).send({ order });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = {
  isUserValid,
  isAdmin,
  authMiddleware
};