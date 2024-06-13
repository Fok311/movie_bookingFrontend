const express = require("express");
const {
  getOrders,
  getOrderss,
  getOrder,
  addNewOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");
// set up product router
const router = express.Router();
const { authMiddleware } = require("../middleware/auth")

/*
    GET /orders
    GET /orders/:id
    POST /orders
    PUT /orders/:id
    DELETE /orders/:id
*/
const Order = require("../models/order");

// get orders
router.get("/", async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).send(orders);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await getOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await getOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST - sara
router.post("/", async (req, res) => {
  try {
    const { customerId, customerName, customerEmail, movieName, selectedSeats, totalPrice, selectedDate, selectedTime, hallNumber, status } =
      req.body;
    const newOrder = await addNewOrder(
      customerId,
      customerName,
      customerEmail,
      movieName,
      selectedSeats,
      totalPrice,
      selectedDate,
      selectedTime,
      hallNumber,
      status
    );
    res.status(200).send(newOrder);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// PUT - Sean
router.put("/:id", async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      movieName,
      selectedSeats,
      totalPrice,
      selectedDate,
      selectedTime,
      hallNumber,
      status,
      billplz_id,
      paid_at,
    } = req.body;
    const updatedOrder = await updateOrder(
      req.params.id,
      customerId,
      customerName,
      customerEmail,
      movieName,
      selectedSeats,
      totalPrice,
      selectedDate,
      selectedTime,
      hallNumber,
      status,
      billplz_id,
      paid_at
    );
    res.status(200).send(updatedOrder);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// DELETE = le zhang
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await getOrder(id);
    if (order) {
      await deleteOrder(id);
      res.status(200).send("Deleted");
    } else {
      res.status(404).send("Order not found");
    }
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

// export
module.exports = router;
