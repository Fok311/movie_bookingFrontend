import axios from "axios";

const url = "http://localhost:5000";

export const getUserLogin = async (data) => {
  const response = await axios.post(
    `${url}/users/login`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getUserSignUp = async (data) => {
  const response = await axios.post(
    `${url}/users/signup`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};