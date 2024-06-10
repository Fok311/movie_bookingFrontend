import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Button, Paper, Chip } from '@mui/material';
import { useParams } from "react-router-dom";
import { getMovie } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, addDays, setHours, setMinutes, setSeconds, isBefore, isSameDay, startOfToday } from 'date-fns';
import Header from '../../components/Header';
import MovieDialog from '../../components/movieDialog';

export default function MovieDetails() {
    const { id } = useParams();
    const { data: movie, isLoading, error } = useQuery({
        queryKey: ["movie", id],
        queryFn: () => getMovie(id),
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [showTimes, setShowTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [displayedTime, setDisplayedTime] = useState('');
    const [price, setPrice] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [hall, setHall] = useState(''); 
    const [selectedButton, setSelectedButton] = useState(null);

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString); // Parse the ISO date string into a Date object
            return format(date, 'yyyy-M-d'); // Format the date as "2024-6-6"
        } catch (error) {
            console.error("Invalid date format:", dateString); // Log an error message if parsing fails
            return "Invalid date"; // Return a fallback message
        }
    };
    
// Function to get the next five days starting from today
const getNextFiveDays = () => {
    const today = startOfToday(); // Get the start of the current day (midnight)
    return [0, 1, 2, 3, 4].map(day => { // Loop through the next 5 days including today
        const date = addDays(today, day); // Add 'day' number of days to 'today'
        return {
            formattedMonth: format(date, 'MMM'), // Format the date to show abbreviated month (e.g., 'Jan')
            formattedDay: format(date, 'dd'), // Format the date to show the day of the month (e.g., '01')
            raw: date // Store the raw date object
        };
    });
};


// Function to generate times in 2-hour increments starting from 10 AM for a given date
const generateIncrementalTimes = (selectedDate) => {
    const times = []; // Array to hold the generated times
    const now = new Date(); // Current date and time

    // Loop to generate 7 time slots, each 2 hours apart starting from 10 AM
    for (let i = 0; i < 7; i++) {
        const hour = 10 + (i * 2); // Calculate the hour (10 AM, 12 PM, 2 PM, etc.)
        const time = setSeconds(setMinutes(setHours(new Date(selectedDate), hour), 0), 0); // Set the time for the selected date

        // Check if the selected date is the same as today
        if (isSameDay(selectedDate, now)) {
            // Only include times that are in the future
            if (isBefore(now, time)) {
                times.push({
                    time24: format(time, 'HH:mm'), // 24-hour format for storage
                    time12: format(time, 'hh:mm a') // 12-hour format for display
                });
            }
        } else {
            // If the selected date is not today, include all generated times
            times.push({
                time24: format(time, 'HH:mm'), // 24-hour format for storage
                time12: format(time, 'hh:mm a') // 12-hour format for display
            });
        }
    }
    return times; // Return the array of generated times
};


const handleDateClick = (date, index) => {
    setSelectedDate(date); // Set the selected date state to the clicked date
    setSelectedButton(index); // Set the selected button state to the index of the clicked button
    setShowTimes(generateIncrementalTimes(date)); // Generate and set the show times based on the selected date
};


    const handleTimeClick = (time) => {
        setSelectedTime(time.time24);
        setDisplayedTime(time.time12);
        setPrice(movie.price); 
        setHall(movie.hall);   
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleSeatSelectOpen = () => {
        setDialogOpen(false);
    };

    // if API data is still loading
    if (isLoading) {
        return <Container>Loading...</Container>;
    }

    // if there is an error in API call
    if (error) {
        return <Container>{error.response.data.message}</Container>;
    }

    const nextFiveDays = getNextFiveDays();

    return (
        <Box sx={{ backgroundColor: '#181818', minHeight: '100vh', padding: '20px 0' }}>
            <Header />
            <Container sx={{ marginTop: '60px', color: 'white', padding: '20px', borderRadius: '10px' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#242424' }}>
                            <Grid container>
                                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                    <Box
                                        component="img"
                                        src={
                                            "http://localhost:5000/" +
                                            (movie.image && movie.image !== "" ? movie.image : "uploads/default_image.jpg")
                                        }
                                        alt={movie.name}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            marginBottom: '20px',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={8} sx={{ padding: 2 }}>
                                    <Typography variant="h4" component="h1" gutterBottom sx={{color: 'white' }}>
                                        {movie.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                                        {movie.genre.map((genre, index) => (
                                            <Chip label={genre} key={index} sx={{ backgroundColor: '#444', color: 'white' }} />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                                        <Chip label={`PG ${movie.classification}`} sx={{ backgroundColor: '#444', color: 'white' }} />
                                        <Chip label={`${movie.running_time}`} sx={{ backgroundColor: '#444', color: 'white' }} />
                                    </Box>
                                    <Typography variant="body1" gutterBottom sx={{color: 'grey' }}>
                                        <strong>Director:</strong> {movie.director}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{color: 'grey' }}>
                                        <strong>Language:</strong> {movie.spoken_language}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{color: 'grey' }}>
                                        <strong>Subtitles:</strong> {movie.subtitles}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{color: 'grey' }}>
                                        <strong>Release Date:</strong> {formatDate(movie.release_date)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {movie.status !== 'coming_soon' && (
                        <Grid item xs={12}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Select Date and Time
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
                                {nextFiveDays.map((day, index) => (
                                    <Grid item key={index}>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            onClick={() => handleDateClick(day.raw, index)}
                                            sx={{
                                                borderRadius: '10px',
                                                backgroundColor: selectedButton === index ? 'skyblue' : '#444',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: selectedButton === index ? 'skyblue' : '#555',
                                                },
                                                padding: '10px 20px',
                                                textAlign: 'center',
                                                display: 'block'
                                            }}
                                        >
                                            <Typography variant="body2" component="div">
                                                {day.formattedMonth}
                                            </Typography>
                                            <Typography variant="h6" component="div">
                                                {day.formattedDay}
                                            </Typography>
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                    {selectedDate && (
                        <Grid item xs={12}>
                            <Grid container spacing={2} justifyContent="center">
                                {showTimes.map((time, index) => (
                                    <Grid item key={index}>
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            onClick={() => handleTimeClick(time)}
                                            sx={{
                                                borderRadius: '10px',
                                                color: '#fff',
                                                borderColor: '#555',
                                                '&:hover': {
                                                    backgroundColor: '#444',
                                                    borderColor: '#666',
                                                }
                                            }}
                                        >
                                            {time.time12}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <MovieDialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    movieId={movie._id}
                    movieName={movie.name}
                    selectedDate={selectedDate ? format(selectedDate, 'yyyy-M-d') : ''}
                    selectedTime={selectedTime} // stored in 24-hour format
                    price={price}
                    hallNumber={hall} // Use hall state variable here
                    onContinue={handleSeatSelectOpen}
                />
            </Container>
        </Box>
    );
}
