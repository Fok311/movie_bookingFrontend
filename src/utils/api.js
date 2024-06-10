import axios from "axios";

const API_URL = "http://localhost:5000"

export const getMovies = async () => {
  
    // axios method
    try {
     
      const response = await axios.get(API_URL + "/movies");
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
};

export const getMovie = async (id) => {
  // to retrieve product from the API /products/:id
  const res = await axios.get(`${API_URL}/movies/${id}`);
  return res.data;
};
  
export const addMovie = async (data) => {
  const response = await axios.post(
    `${API_URL}/movies`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return response.data;
};

export const updateMovie = async (data) => {
  const response = await axios.put(
    `${API_URL}/movies/${data.id}`, // url of the PUT API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return response.data;
};

export const updateMovieStatus = async ({ id, status }) => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Error updating movie status');
  }
  return response.json();
};


export const deleteMovie = async (id) => {
  const response = await axios.delete(`${API_URL}/movies/${id}`);
  return response.data;
};
