import axios from "axios";

const API_URL = "http://localhost:5000"

//get all user
export const getUsers = async () => {
  
    // axios method
    try {
     
      const response = await axios.get(API_URL + "/users");
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
};

export const getUser = async (id) => {
    // to retrieve product from the API /products/:id
    const res = await axios.get(`${API_URL}/users/${id}`);
    return res.data;
  };


  export const updateUserRole = async (userId, newRole) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, { role: newRole });
      return response.data; // Return the updated user data
    } catch (error) {
      console.error("Error updating user role", error);
      throw error;
    }
  };

  export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  };