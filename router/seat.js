const express = require("express");
const {
    getSeats,
    addSeat
} = require("../controllers/seat");
// set up product router
const router = express.Router();


const Seat = require("../models/seat");

// get orders
router.get("/", async (req, res) => {
  try {
    const { movieId, selectedDate, selectedTime } = req.query;
    // Ensure the dates are compared correctly
    const seats = await Seat.find({
      movieId,
      selectedDate,
      selectedTime
    });
    res.status(200).send(seats);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
    try {
      const { movieId, customerId, customerName, customerEmail, selectedSeats, selectedDate, selectedTime} = req.body;
      const newOrder = await addSeat(
        movieId,
        customerId,
        customerName,
        customerEmail,
        selectedSeats,
        selectedDate,
        selectedTime
      );
      res.status(200).send(newOrder);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  });

  module.exports = router;