import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getUser } from '../../utils/api_user';
import { getOrdersByUserId } from '../../utils/api_orders';
import Header from '../../components/Header';
import { useParams } from "react-router-dom";

export default function Profile() {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const { data: user, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  });

  const { data: orders, error: ordersError, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrdersByUserId(id),
  });

  console.log("User:", user);
  console.log("Orders:", orders);

  // Ensure orders is not undefined before filtering
  const filteredOrders = orders && orders.filter(order => order.customerId === id);

  if (userLoading || ordersLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (userError) {
    return <Container>{userError.message}</Container>;
  }

  if (ordersError) {
    return <Container>{ordersError.message}</Container>;
  }

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: '#181818', minHeight: '100vh', padding: '20px 0' }}>
        <Container sx={{ marginTop: '80px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ marginTop: 4, backgroundColor: '#242424' }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom color="white">
                    User Profile
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="gray"><strong>Name:</strong> {user.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="gray"><strong>Email:</strong> {user.email}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="gray"><strong>Role:</strong> {user.role}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ marginTop: 4, backgroundColor: '#242424' }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom color="white">
                    User Orders
                  </Typography>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <Card key={order._id} sx={{ marginBottom: 2, backgroundColor: '#2c2c2c' }}>
                        <CardContent>
                          <Typography variant="body1" color="gray"><strong>Movie:</strong> {order.movieName}</Typography>
                          <Typography variant="body1" color="gray"><strong>Date:</strong> {order.selectedDate}</Typography>
                          <Typography variant="body1" color="gray"><strong>Time:</strong> {order.selectedTime}</Typography>
                          <Typography variant="body1" color="gray"><strong>Seats:</strong> {order.selectedSeats.join(', ')}</Typography>
                          <Typography variant="body1" color="gray"><strong>Total Price:</strong> ${order.totalPrice}</Typography>
                          <Typography variant="body1" color="gray"><strong>Status:</strong> {order.status}</Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ color: 'white' }}>No orders found.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}