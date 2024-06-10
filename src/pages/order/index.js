import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Container,
  Button,
  Typography,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import { getOrders, deleteOrder, updateOrder } from "../../utils/api_orders";
import Header from "../../components/Header";
import { format } from 'date-fns';
import { useCookies } from "react-cookie";

export default function Orders() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;
  

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

  const { data: orders = [] } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrders(),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      enqueueSnackbar("Order has been successfully deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleRemoveOrder = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this order?"
    );
    if (answer) {
      deleteOrderMutation.mutate(_id);
    }
  };

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      enqueueSnackbar("Order has been successfully updated", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleUpdateOrder = (order, status) => {
        updateOrderMutation.mutate({
        ...order,
            status: status,
            id: order._id,
        });
    };

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: '#181818', minHeight: '100vh', padding: '20px 0' }}>
        <Container align="center">
          <TableContainer
            component={Paper}
            sx={{ maxWidth: "1200px", marginTop: "90px", backgroundColor: '#242424' }}
            align="center"
          >
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: '1px solid #424242' }}>
                  <TableCell align="left" sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Customer</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Movie</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Seats</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Time</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Price</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Payment Date</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Status</TableCell>
                  <TableCell align="right" sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              {orders.length > 0 ? (
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} sx={{ borderBottom: '1px solid #424242' }}>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                        {order.customerName}
                        <br />({order.customerEmail})
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                        {order.movieName}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                        {order.selectedSeats.join(",")}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                        {order.selectedDate}
                        <br />({order.selectedTime})
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                        (RM) {order.totalPrice}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                        {order.paid_at ? format(new Date(order.paid_at), 'PPpp') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={order.status}
                          label="status"
                          disabled={order.status === "pending"}
                          onChange={(e) => {
                            handleUpdateOrder(order, e.target.value);
                          }}
                          sx={{ color: 'white' }}
                        >
                          <MenuItem value={"pending"} disabled={true}>
                            Pending
                          </MenuItem>
                          <MenuItem value={"paid"}>Paid</MenuItem>
                          <MenuItem value={"failed"}>Failed</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #424242' }}>
                        {(order.status === "pending" || order.status === "failed") && (
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => {
                              handleRemoveOrder(order._id);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                      <Typography variant="h6" sx={{ color: 'white' }}>No orders added yet.</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </>
  );
}
