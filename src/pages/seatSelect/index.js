import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import Header from "../../components/Header";
import OrderDialog from "../../components/orderDialog";
import { format } from 'date-fns';
import { useQuery } from "@tanstack/react-query";
import { getSeats } from "../../utils/api_seat";
import { useCookies } from "react-cookie";
import { useSnackbar } from 'notistack';

export default function SeatSelect() {
  const location = useLocation();
  const { movieId, movieName, selectedDate, selectedTime, price, hallNumber } = location.state;
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!cookies.currentUser) {
      navigate("/login")
      enqueueSnackbar("Please Login before Select the Seat", { variant: "error" })
    }
  });
  const { data: seats = [], isLoading, error } = useQuery({
    queryKey: ["seats", movieId, selectedDate, selectedTime],
    queryFn: () => getSeats(movieId, selectedDate, selectedTime),
  });

  const formattedDate = selectedDate ? format(new Date(selectedDate), 'dd MMM yyyy') : 'Not selected';
  const formattedTime = selectedTime;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);


  useEffect(() => {
    // Check if the 'seats' array has one or more elements
    if (seats.length > 0) {
      // Use 'flatMap' to create a new array with all 'selectedSeat' values from each 'seat' object
      const reserved = seats.flatMap(seat => seat.selectedSeat);
  
      // Update the 'reservedSeats' state with the new array of reserved seat values
      setReservedSeats(reserved);
    }
  }, [seats]); // Dependency array - runs the effect whenever the 'seats' array changes


  const rows = [
    [
      { id: 1, number: "A1" },
      { id: 2, number: "A2" },
      { id: 3, number: "A3" },
      { id: 4, number: "A4" },
      { id: 5, number: "A5" },
      { id: 6, number: "A6" },
      { id: 7, number: "A7" },
      { id: 8, number: "A8" },
      null,
      { id: 9, number: "A9" },
      { id: 10, number: "A10" },
      { id: 11, number: "A11" },
      { id: 12, number: "A12" }
    ],
    [
      { id: 13, number: "B1" },
      { id: 14, number: "B2" },
      { id: 15, number: "B3" },
      { id: 16, number: "B4" },
      { id: 17, number: "B5" },
      { id: 18, number: "B6" },
      { id: 19, number: "B7" },
      { id: 20, number: "B8" },
      null,
      { id: 21, number: "B9" },
      { id: 22, number: "B10" },
      { id: 23, number: "B11" },
      { id: 24, number: "B12" }
    ],
    [
      { id: 25, number: "C1" },
      { id: 26, number: "C2" },
      { id: 27, number: "C3" },
      { id: 28, number: "C4" },
      { id: 29, number: "C5" },
      { id: 30, number: "C6" },
      { id: 31, number: "C7" },
      { id: 32, number: "C8" },
      null,
      { id: 33, number: "C9" },
      { id: 34, number: "C10" },
      { id: 35, number: "C11" },
      { id: 36, number: "C12" }
    ],
    [
      { id: 37, number: "D1" },
      { id: 38, number: "D2" },
      { id: 39, number: "D3" },
      { id: 40, number: "D4" },
      { id: 41, number: "D5" },
      { id: 42, number: "D6" },
      { id: 43, number: "D7" },
      { id: 44, number: "D8" },
      null,
      { id: 45, number: "D9" },
      { id: 46, number: "D10" },
      { id: 47, number: "D11" },
      { id: 48, number: "D12" }
    ],
    [
      { id: 49, number: "E1" },
      { id: 50, number: "E2" },
      { id: 51, number: "E3" },
      { id: 52, number: "E4" },
      { id: 53, number: "E5" },
      { id: 54, number: "E6" },
      { id: 55, number: "E7" },
      { id: 56, number: "E8" },
      null,
      { id: 57, number: "E9" },
      { id: 58, number: "E10" },
      { id: 59, number: "E11" },
      { id: 60, number: "E12" }
    ],
    [
      { id: 61, number: "F1" },
      { id: 62, number: "F2" },
      { id: 63, number: "F3" },
      { id: 64, number: "F4" },
      { id: 65, number: "F5" },
      { id: 66, number: "F6" },
      { id: 67, number: "F7" },
      { id: 68, number: "F8" },
      null,
      { id: 69, number: "F9" },
      { id: 70, number: "F10" },
      { id: 71, number: "F11" },
      { id: 72, number: "F12" }
    ],
    [
      { id: 73, number: "G1" },
      { id: 74, number: "G2" },
      { id: 75, number: "G3" },
      { id: 76, number: "G4" },
      { id: 77, number: "G5" },
      { id: 78, number: "G6" },
      { id: 79, number: "G7" },
      { id: 80, number: "G8" },
      null,
      { id: 81, number: "G9" },
      { id: 82, number: "G10" },
      { id: 83, number: "G11" },
      { id: 84, number: "G12" }
    ]
  ];

  const handleDialogClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const totalPrice = price * selected.length;

  const handleSeatClick = (seat) => {
    // Check if the seat is already reserved
    if (reservedSeats.includes(seat.number)) {
      return; // If the seat is reserved, exit the function without making any changes
    }
  
    // Check if the seat is already selected
    if (selected.includes(seat.number)) {
      // If the seat is selected, remove it from the selected seats
      setSelected(selected.filter((s) => s !== seat.number));
    } else {
      // If the seat is not selected, add it to the selected seats
      setSelected([...selected, seat.number]);
    }
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "100px"
      }}
    >
      <Header />
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: "80%",
            height: "60px",
            backgroundColor: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            marginBottom: "20px"
          }}
        >
          <Typography variant="h4" component="h3">SCREEN</Typography>
        </Box>
        <Typography variant="h6" component="h5" sx={{ marginBottom: "20px" }}>CLASSIC ${price}</Typography>
        <Grid container spacing={1} justifyContent="center">
          {rows.map((row, rowIndex) => (
            <Grid key={rowIndex} container item spacing={1} justifyContent="center">
              {row.map((seat, seatIndex) => (
                seat ? (
                  <Grid item key={seatIndex}>
                    <Box
                      sx={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: reservedSeats.includes(seat.number) ? "#333" : selected.includes(seat.number) ? "#1976d2" : "#777",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        cursor: reservedSeats.includes(seat.number) ? "not-allowed" : "pointer",
                      }}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.number}
                    </Box>
                  </Grid>
                ) : (
                  <Grid item key={seatIndex} sx={{ width: "30px", height: "30px" }} />
                )
              ))}
            </Grid>
          ))}
        </Grid>

        {selected.length !== 0 && (
          <>
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h6" component="h1">SEAT: {selected.join(", ")}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
              onClick={handleDialogClick}
            >
              Continue
            </Button>
          </>
        )}
      </Container>
      <OrderDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        movieId={movieId}
        movieName={movieName}
        selectedDate={formattedDate}
        selectedTime={formattedTime}
        totalPrice={totalPrice}
        hallNumber={hallNumber}
        selectedSeats={selected}
      />
    </Box>
  );
}
