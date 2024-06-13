const Movie = require("../models/movie");

const getMovies = async (genre) => {
  try {
    let movies = [];
    if (genre) {
      movies = await Movie.find({ Genre: genre });
    } else {
      movies = await Movie.find();
    }
    return movies;
  } catch (error) {
    throw new Error(error);
  }
};

//add
const addMovie = async (name, director, release_date, genre, running_time, spoken_language, subtitles, classification, price, hall, image, banner) => {
    const newMovie = new Movie({
        name,
        director,
        release_date,
        genre,
        running_time,
        spoken_language,
        subtitles,
      classification,
      price,
      hall,
      image,
      banner
    });
    // save the movie with mongodb
    await newMovie.save();
    return newMovie;
};

//update
const updateMovie = async (
    movie_id,
    name, director, release_date, genre, running_time, spoken_language, subtitles, classification, price, hall, image, banner, status
  ) => {
    const updatedMovie = await Movie.findByIdAndUpdate(movie_id, {
        name,
        director,
        release_date,
        genre,
        running_time,
        spoken_language,
        subtitles,
      classification,
      price,
      hall,
      image,
      banner,
      status
    },
    { new: true } // send in the updated data
    );
    return updatedMovie;
  };

module.exports = {
    getMovies,
    addMovie,
    updateMovie
};