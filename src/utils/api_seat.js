import axios from "axios";

const url = "http://localhost:5000";


export const getSeats = async (movieId, selectedDate, selectedTime) => {
  try {
    const response = await axios.get(`${url}/seats`, {
      params: { movieId, selectedDate, selectedTime },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addSeat = async (data) => {
const response = await axios.post(
    `${url}/seats`, 
    JSON.stringify(data), 
    {
      headers: {
        "Content-Type": "application/json", 
      },
    }
  );
  return response.data;
}