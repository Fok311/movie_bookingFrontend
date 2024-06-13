const express = require("express");

const router = express.Router();

const { loginUser, signUpUser, getAllUsers, updateUserRole } = require("../controllers/user");
const User = require("../models/user");

//login route
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await loginUser(email, password);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// signup route
router.post("/signup", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // create user via signUpUser
    const user = await signUpUser(name, email, password);
    // send back the newly created user data
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// get all users route
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers(); // Fetch all users
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Call the updateUserRole function from the controller
    const updatedUser = await updateUserRole(userId, role);

    // Send back the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    await User.findByIdAndDelete(user_id);
    res.status(200).send("User has been successfully deleted.");
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});


module.exports = router;