import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

export default function MovieDialog({ open, onClose, movieId, movieName, selectedDate, selectedTime, price, hallNumber }) {
    const navigate = useNavigate();
    
    const handleBuyNow = () => {
        const url = `/seatselect/${movieId}/${selectedDate}/${selectedTime}`;
        navigate(url, {
            state: {
                movieId,
                movieName,
                selectedDate,
                selectedTime,
                price,
                hallNumber,
            },
        });
    };

    return (
        <>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Movie Booking Details
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Movie Name:</strong> {movieName || 'Not selected'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Date:</strong> {selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Not selected'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Time:</strong> {selectedTime || 'Not selected'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Price:</strong> {price ? `$${price}` : 'Not entered'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Hall Number:</strong> {hallNumber || 'Not selected'}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" fullWidth onClick={handleBuyNow}>
                    Buy Now
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
