import axios from "axios";

const url = "http://localhost:5000";

export const verifyPayment = async (data) => {
    const res = await axios.post(`${url}/payment`, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  };