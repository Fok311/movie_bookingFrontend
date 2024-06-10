import { useState } from 'react';
import { Card, CardMedia, Box, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function MovieCardHome(props) {
  const navigate = useNavigate();
  const { movie } = props;
  const [hovered, setHovered] = useState(false);

  return (
    <Card
        sx={{
            width: '80%',
            height: 700,
            margin: 2, // Adjust margin to create space between cards
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <CardMedia
            component="img"
            image={
                "http://localhost:5000/" +
                (movie.image && movie.image !== "" ? movie.image : "uploads/default_image.jpg")
            }
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {hovered && (
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}
            >
                <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>{movie.name}</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{movie.genre.join(",")}</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{movie.running_time}</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{movie.spoken_language}</Typography>
                <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{movie.subtitles}</Typography>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '100px',
                    alignSelf: 'center', // Keep the button centered horizontally
                  }}
                  onClick={() => navigate("/moviesdetails/" + movie._id)}
                >
                  {movie.status === 'coming_soon' ? 'Details' : 'Buy Now'}
                </Button>   
            </Box>
        )}
    </Card>
  );
}
