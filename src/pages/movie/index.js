import { useState } from 'react';
import Header from '../../components/Header';
import { getMovies } from '../../utils/api';
import { useQuery } from "@tanstack/react-query";
import { Typography, Box, Tabs, Tab, Grid, Container } from "@mui/material";
import MovieCard from '../../components/MovieCard';

export default function Movie() {
    const { data: movies = [] } = useQuery({
        queryKey: ["movies"],
        queryFn: () => getMovies(),
    });

    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const publishedMovies = movies.filter(movie => movie.status === "publish");
    const comingSoonMovies = movies.filter(movie => movie.status === "coming_soon");

    return (
        <>
            <Header />
            <Box sx={{  backgroundColor: '#181818', minHeight: '100vh', padding: '20px 0' }}>
                <Container>
                    <Box sx={{ padding: '0 20px', marginTop: '70px' }}>
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
                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                        {(currentTab === 0 ? publishedMovies : comingSoonMovies).map((movie) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                                <MovieCard movie={movie} />
                            </Grid>
                        ))}
                        {(currentTab === 0 ? publishedMovies : comingSoonMovies).length === 0 && (
                            <Grid item xs={12}>
                                <Typography align="center" sx={{ padding: "10px 0", color: 'white' }}>
                                    No items found.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
