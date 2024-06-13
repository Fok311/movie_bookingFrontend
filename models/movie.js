const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// setup the schema
const movieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  director: String,
  release_date: String,
  genre: {
    type: [String],    
  },
  running_time: String,
  spoken_language: String,
  subtitles: String,
  classification: String,
  price: String,
  hall: String,
  image: String,
  banner: String,
  status: String
});

// convert the schema to a model
const Movie = model("Movie", movieSchema);
module.exports = Movie;
