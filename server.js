const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create the express app
const app = express();

// middleware to handle JSON request
app.use(express.json());
// set the uploads folder as static path
app.use("/uploads", express.static("uploads"));
app.use("/uploadsBanner", express.static("uploadsBanner"));

const corsHandler = cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: true,
    optionsSuccessStatus: 200,
  });
  
  // apply the cors to middleware
  app.use(corsHandler);

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/moviebooking")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

// Routes
const movieRouter = require("./router/movie");
const userRouter = require("./router/user");
const imagesRouter = require("./router/image");
const ordersRouter = require("./router/order");
const paymentRouter = require("./router/payment")
const seatRouter = require("./router/seat");
const bannerRouter = require("./router/banner");

app.use("/movies", movieRouter);
app.use("/users", userRouter);
app.use("/images", imagesRouter);
app.use("/orders", ordersRouter);
app.use("/payment", paymentRouter)
app.use("/seats", seatRouter);
app.use("/banner", bannerRouter);

// Start the server
app.listen(5000, () => {
  console.log("Server is running at http://localhost:5000");
});
