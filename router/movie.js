const express = require("express");
const {
  getMovies,
    addMovie,
  updateMovie
} = require("../controllers/movie");

// create express router for movies
const router = express.Router();

// load all the models
const Movie = require("../models/movie");


router.get("/", async (req, res) => {
    // use controller function
    try {
      const genre = req.query.genre;
      const movies = await getMovies(genre);
      res.status(200).send(movies);
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
});
  

router.get("/:id", async (req, res) => {
    try {
      //   const movie = await Movie.findOne({ _id: req.params.id });
      const movie = await Movie.findById(req.params.id);
      res.status(200).send(movie);
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
});
  

router.post("/", async (req, res) => {
    try {
      const name = req.body.name;
      const director = req.body.director;
      const release_date = req.body.release_date;
      const genre = req.body.genre;
        const running_time = req.body.running_time;
        const spoken_language = req.body.spoken_language;
        const subtitles = req.body.subtitles;
      const classification = req.body.classification;
      const price = req.body.price;
      const hall = req.body.hall;
      const image = req.body.image;
      const banner = req.body.banner;
      const newMovie = await addMovie(
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
      );
      // put addMovie function here
      res.status(200).send(newMovie);
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
});

router.put("/:id", async (req, res) => {
    try {
      const movie_id = req.params.id;
      const name = req.body.name;
      const director = req.body.director;
      const release_date = req.body.release_date;
      const genre = req.body.genre;
        const running_time = req.body.running_time;
        const spoken_language = req.body.spoken_language;
        const subtitles = req.body.subtitles;
      const classification = req.body.classification;
      const price = req.body.price;
      const hall = req.body.hall;
      const image = req.body.image;
      const banner = req.body.banner;
      const status = req.body.status
      const updatedMovie = await updateMovie(
        movie_id,
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
      );
      res.status(200).send(updatedMovie);
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
});
  
router.delete("/:id", async (req, res) => {
    try {
      const movie_id = req.params.id;
      await Movie.findByIdAndDelete(movie_id);
      res.status(200).send("Movie has been successfully deleted.");
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  });
  
module.exports = router;