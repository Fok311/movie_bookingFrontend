import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";


import Login from "./pages/login";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import MoviesAddNew from "./pages/movieAddNew";
import MoviesEdit from "./pages/movieEdit";
import MovieDetails from "./pages/movieDetails";
import Register from "./pages/register";
import UserEdit from "./pages/userEdit";
import Profile from "./pages/profile";
import SeatSelect from "./pages/seatSelect";
import PaymentVerify from "./pages/paymentVerify";
import Orders from "./pages/order";
import Movie from "./pages/movie";

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <SnackbarProvider
            maxSnack={10}
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/movies" element={<Movie />} />
            <Route path="/add" element={<MoviesAddNew />} />
            <Route path="/movies/:id" element={<MoviesEdit />} />
            <Route path="/moviesdetails/:id" element={<MovieDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users/:id" element={<UserEdit />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/seatselect/:id/:selectedDate/:selectedTime" element={<SeatSelect />} />
            <Route path="/verify-payment" element={<PaymentVerify />} />
            <Route path="/orders" element={<Orders />} />
      </Routes>
            </BrowserRouter>
            </SnackbarProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
  