import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";
import { updateMovie, getMovie } from "../../utils/api";
import { uploadImage, uploadBanner } from "../../utils/api_image";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useCookies } from "react-cookie";


export default function MoviesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [director, setDirector] = useState("");
  const [release_date, setRelease_date] = useState(null);
  const [genre, setGenre] = useState([]);
  const [running_time, setRunning_time] = useState("");
  const [spoken_language, setSpoken_language] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [classification, setClassification] = useState("");
  const [image, setImage] = useState("");
  const [banner, setBanner] = useState("");
  const [price, setPrice] = useState(""); 
  const [hall, setHall] = useState(""); 
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;

  const genresList = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller"];

  useEffect(() => {
    if (!cookies.currentUser) {
      navigate("/login")
      enqueueSnackbar("Please Login before Access this page", { variant: "error" })
    }
  });

  useEffect(() => {
    if (role !== "admin") {
      navigate("/")
      enqueueSnackbar("You have no permissions to access this Page", { variant: "error" })
    }
  });

  const {
    data: movie,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["movies", id],
    queryFn: () => getMovie(id),
  });

  useEffect(() => {
    if (movie) {
      setName(movie.name);
      setDirector(movie.director);
      setRelease_date(movie.release_date ? dayjs(movie.release_date) : null);
      setGenre(movie.genre || []);
      setRunning_time(movie.running_time);
      setSpoken_language(movie.spoken_language);
      setSubtitles(movie.subtitles);
      setClassification(movie.classification);
      setImage(movie.image ? movie.image : "");
      setBanner(movie.banner ? movie.banner : "");
      setPrice(movie.price); 
      setHall(movie.hall); 
    }
  }, [movie]);

  const updateMovieMutation = useMutation({
    mutationFn: updateMovie,
    onSuccess: () => {
      enqueueSnackbar("Movie is updated", {
        variant: "success",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error'
      });
    },
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    updateMovieMutation.mutate({
      id: id,
      name: name,
      director: director,
      release_date: release_date,
      genre: genre,
      running_time: running_time,
      spoken_language: spoken_language,
      subtitles: subtitles,
      classification: classification,
      image: image,
      banner: banner,
      price: price, // Include price in submission
      hall: hall // Include hall in submission
    });
  };

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImage(data.image_url);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleImageUpload = (event) => {
    uploadImageMutation.mutate(event.target.files[0]);
  };

  const uploadBannerMutation = useMutation({
    mutationFn: uploadBanner,
    onSuccess: (data) => {
      setBanner(data.banner_url);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to upload image";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });

  const handleBannerUpload = (event) => {
    uploadBannerMutation.mutate(event.target.files[0]);
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>{error.response.data.message}</Container>;
  }

  return (
    <Box sx={{ backgroundColor: '#181818', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ marginTop: '60px', color: 'white', padding: '20px', borderRadius: '10px' }}>
        <Card sx={{ marginTop: '40px', backgroundColor: '#242424' }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                margin: "20px 0",
                fontWeight: "bold",
                textAlign: "center",
                color: 'white'
              }}
            >
              Edit Movie
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Director"
                  variant="outlined"
                  fullWidth
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={12}>
                  <DatePicker
                    label="Release Date"
                    value={release_date}
                    onChange={(newValue) => {
                      setRelease_date(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{
                          style: { color: 'white' },
                          inputProps: { style: { color: 'white !important' } }, // Use !important for higher specificity
                        }}
                      />
                    )}
                  />
                </Grid>
              </LocalizationProvider>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#2c2c2c' }}>
                  <InputLabel sx={{ color: 'white' }}>Genre</InputLabel>
                  <Select
                    label="Genre"
                    multiple
                    value={genre}
                    onChange={handleGenreChange}
                    input={<OutlinedInput label="Genre" sx={{ color: 'white' }} />}
                    renderValue={(selected) => (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} style={{ margin: 2, color: 'white' }} />
                        ))}
                      </div>
                    )}
                    MenuProps={{ PaperProps: { sx: { bgcolor: '#2c2c2c', color: 'white' } } }}
                  >
                    {genresList.map((genre) => (
                      <MenuItem key={genre} value={genre} sx={{ color: 'white' }}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Running Time"
                  variant="outlined"
                  fullWidth
                  value={running_time}
                  onChange={(e) => setRunning_time(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Spoken Language"
                  variant="outlined"
                  fullWidth
                  value={spoken_language}
                  onChange={(e) => setSpoken_language(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Subtitles"
                  variant="outlined"
                  fullWidth
                  value={subtitles}
                  onChange={(e) => setSubtitles(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Classification"
                  variant="outlined"
                  fullWidth
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Hall"
                  variant="outlined"
                  fullWidth
                  value={hall}
                  onChange={(e) => setHall(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                {image !== "" ? (
                  <>
                    <div>
                      <img
                        src={"http://localhost:5000/" + image}
                        width="300px"
                        height="300px"
                        alt="Uploaded"
                      />
                    </div>
                    <Button onClick={() => setImage("")} sx={{ color: 'white' }}>Remove Image</Button>
                  </>
                ) : (
                  <input
                    type="file"
                    multiple={false}
                    onChange={handleImageUpload}
                    style={{ color: 'white' }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {banner !== "" ? (
                  <>
                    <div>
                      <img
                        src={"http://localhost:5000/" + banner}
                        width="300px"
                        height="300px"
                        alt="Uploaded"
                      />
                    </div>
                    <Button onClick={() => setBanner("")} sx={{ color: 'white' }}>Remove Banner</Button>
                  </>
                ) : (
                  <input
                    type="file"
                    multiple={false}
                    onChange={handleBannerUpload}
                    style={{ color: 'white' }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={handleFormSubmit} sx={{ backgroundColor: '#3f51b5', color: 'white' }}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
