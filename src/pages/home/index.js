import React, { useState } from 'react';
import Header from '../../components/Header';
import { getMovies } from '../../utils/api';
import { useQuery } from "@tanstack/react-query";
import { Typography, Box, Tabs, Tab, IconButton } from "@mui/material";
import MovieCardHome from '../../components/MovieCardHome';
import Slider from "react-slick";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
    const { data: movies = [] } = useQuery({
        queryKey: ["movies"],
        queryFn: getMovies,
    });

    const SampleNextArrow = (props) => {
        const { onClick } = props;
        return (
            <IconButton
                style={{ 
                    display: 'block', 
                    color: 'white', 
                    right: '10px', 
                    zIndex: 1, 
                    position: 'absolute', 
                    top: '50%', 
                    transform: 'translateY(-50%)' 
                }}
                onClick={onClick}
            >
                <ArrowForwardIos />
            </IconButton>
        );
    };
    
    const SamplePrevArrow = (props) => {
        const { onClick } = props;
        return (
            <IconButton
                style={{ 
                    display: 'block', 
                    color: 'white', 
                    left: '10px', 
                    zIndex: 1, 
                    position: 'absolute', 
                    top: '50%', 
                    transform: 'translateY(-50%)' 
                }}
                onClick={onClick}
            >
                <ArrowBackIos />
            </IconButton>
        );
    };

    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const publishedMovies = movies.filter(movie => movie.status === "publish");
    const comingSoonMovies = movies.filter(movie => movie.status === "coming_soon");
    const filteredMovies = publishedMovies.filter(movie => movie.banner && movie.banner !== "uploads/default_image.jpg");

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        arrows: true // Ensure only custom arrows are shown
    };

    const gridSettings = {
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false, // Set to false to prevent infinite scrolling
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ],
        arrows: true, // Ensure only custom arrows are shown
        centerPadding: "20px",
        cssEase: 'linear',
        className: 'center',
        centerMode: false, // Disable center mode to prevent partial slides being visible
    };

    return (
        <>
            <Header />
            <Box sx={{ marginTop: '50px', backgroundColor: '#181818', minHeight: '100vh', padding: '20px 0' }}>
                {/* First Slider Section */}
                <Box sx={{ marginBottom: '40px', position: 'relative' }}>
                    <Slider {...sliderSettings}>
                    {filteredMovies.map((movie) => (
                        <Box
                        key={movie._id}
                        component="img"
                        src={
                            "http://localhost:5000/" +
                            (movie.banner && movie.banner !== "" ? movie.banner : "uploadsBanner/default_image.jpg")
                        }
                        alt={movie.name}
                        sx={{
                            height: {
                            xs: '200px', // Height for extra-small screens (mobile)
                            sm: '300px', // Height for small screens (tablets)
                            md: '400px', // Height for medium screens (desktops)
                            lg: '500px', // Height for large screens (larger desktops)
                            xl: '600px'  // Height for extra-large screens
                            },
                            width: '100%', // Make sure the image fits within the slider
                            objectFit: 'cover' // Maintain the aspect ratio of the image
                        }}
                        />
                    ))}
                    </Slider>
                </Box>

                {/* Tabs for categories */}
                <Box sx={{ padding: '0 20px' }}>
                    <Tabs 
                        value={currentTab} 
                        onChange={handleTabChange} 
                        centered
                        sx={{ '& .MuiTab-root': { color: 'white' }, '& .Mui-selected': { color: 'white' } }}
                    >
                        <Tab label="Now Showing" />
                        <Tab label="Coming Soon" />
                    </Tabs>
                </Box>

                {/* Movies Grid Section */}
                <Box sx={{ padding: '0 20px' }}>
                    <Slider {...gridSettings}>
                        {(currentTab === 0 ? publishedMovies : comingSoonMovies).map((movie) => (
                            <Box key={movie._id}>
                                <MovieCardHome 
                                    movie={movie} 
                                />
                            </Box>
                        ))}
                    </Slider>
                    {(currentTab === 0 ? publishedMovies : comingSoonMovies).length === 0 && (
                        <Typography align="center" sx={{ padding: "10px 0", color: 'white' }}>
                            No items found.
                        </Typography>
                    )}
                </Box>
            </Box>
        </>
    );
}
