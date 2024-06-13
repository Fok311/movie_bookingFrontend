const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const seatSchema = new Schema({
  movieId: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  selectedSeat: {
    type: Array,
    required: true
  },
  selectedDate: {
    type: String,
    required: true,
  },
  selectedTime: {
    type: String,
    required: true,
  },
});

const Seat = model("Seat", seatSchema);
module.exports = Seat;