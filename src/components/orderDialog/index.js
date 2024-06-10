import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button, Typography, Grid } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { addNewOrder } from '../../utils/api_orders';
import { useCookies } from "react-cookie";
import { addSeat } from '../../utils/api_seat';
import { format, parseISO} from 'date-fns';

export default function OrderDialog({ open, onClose, movieId, movieName, selectedSeats, totalPrice, selectedDate, selectedTime, hallNumber }) {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser = {} } = cookies;
    const { enqueueSnackbar } = useSnackbar();


    const addNewOrderMutation = useMutation({
        mutationFn: addNewOrder,
        onSuccess: (responseData) => {
            const billplz_url = responseData.billplz_url;
            window.location.href = billplz_url;
        },
        onError: (error) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to place order', {
                variant: 'error',
            });
        },
    });

    const addNewSeatMutation = useMutation({
        mutationFn: addSeat,
        onSuccess: () => {
          // If API call is success, show a success message
          enqueueSnackbar("Seat is added", {
            variant: "success",
          });
        },
        onError: (error) => {
          // If API call is error, show an error message
          const errorMessage = error.response?.data?.message || "Failed to add Seat";
          enqueueSnackbar(errorMessage, {
            variant: 'error'
          });
        },
      });

    const handleCheckout = () => {
        const userId = currentUser._id
        const userName = currentUser.name;
        const userEmail = currentUser.email;

        let formattedDate, formattedTime;
        try {
            // Parse the selectedDate string into a Date object
            const date = new Date(selectedDate);
            
            // Format the date object to 'yyyy-M-d' format
            formattedDate = format(date, 'yyyy-M-d');
        
            // Parse the selectedTime string into a Date object with a dummy date '1970-01-01'
            const time = new Date(`1970-01-01T${selectedTime}:00`);
            
            // Format the time object to 'HH:mm' format
            formattedTime = format(time, 'HH:mm');
        } catch (error) {
            // Log the error message to the console
            console.error("Invalid date or time format:", selectedDate, selectedTime);
            
            // Display an error notification to the user
            enqueueSnackbar('Invalid date or time format', { variant: 'error' });
            
            // Exit the function to prevent further execution
            return;
        }
        

        addNewOrderMutation.mutate({
            customerId: userId,
            customerName: userName,
            customerEmail: userEmail,
            movieName,
            selectedSeats,
            totalPrice,
            selectedDate: formattedDate,
            selectedTime: formattedTime,
            hallNumber
        });
        addNewSeatMutation.mutate({
            movieId: movieId,
            customerId: userId,
            customerName: userName,
            customerEmail: userEmail,
            selectedSeats,
            selectedDate: formattedDate,
            selectedTime: formattedTime,
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Orders
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
                        <Typography variant="h6">Movie: {movieName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Selected Seat: {selectedSeats.join(", ")}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Total Price: ${totalPrice}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Date: {selectedDate}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Time: {selectedTime}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Hall: {hallNumber}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={handleCheckout}
                >
                    Purchase now
                </Button>
            </DialogActions>
        </Dialog>
    );
}
