const Seat = require("../models/seat")

const getSeats = async (movieId, selectedDate, selectedTime) => {
    try {
      const seats = await Seat.find({
        movieId,
        selectedDate,
        selectedTime
      });
      return seats;
    } catch (error) {
      throw new Error('Error fetching seats data');
    }
  };


//add
const addSeat = async (movieId, customerId, customerName, customerEmail, selectedSeat, selectedDate, selectedTime) => {
    const newSeat = new Seat({
        movieId,
        customerId,
        customerName,
        customerEmail,
        selectedSeat,
        selectedDate,
        selectedTime
    });
    // save the movie with mongodb
    await newSeat.save();
    return newSeat;
};




module.exports = {
    getSeats,
    addSeat
}