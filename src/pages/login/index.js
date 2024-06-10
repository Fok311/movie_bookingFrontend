import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { Box, Container, TextField, Button, Typography, Link } from "@mui/material";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { getUserLogin } from "../../utils/api_auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookies] = useCookies(["currentUser"]); //note :currentUser is a key for the cookie

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getUserLoginMutation = useMutation({
    mutationFn: getUserLogin,
    onSuccess: (data) => {
      // save current log in user data into cookie
      setCookies("currentUser", data, { maxAge: 60 * 60 * 24 * 30 }); //3600 * 24 = 24 hours * 30 = 1 month
      enqueueSnackbar("Login Successfully", { variant: "success" });
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleLogin = () => {
    if (email === "" || password === "") {
      enqueueSnackbar("All fields are required", { variant: "error" });
    } else {
      getUserLoginMutation.mutate({
        email,
        password,
      });
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: "#181818",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container sx={{ width: "30%", backgroundColor: "#242424", padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ color: "white", marginBottom: 3 }}>
            Login
          </Typography>
          <Box sx={{ marginBottom: "30px" }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              required
              variant="outlined"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#242424',
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#999',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                },
              }}
            />
          </Box>
          <Box sx={{ marginBottom: "30px" }}>
            <TextField
              label="Password"
              type="password"
              value={password}
              required
              variant="outlined"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#242424',
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#999',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                },
              }}
            />
          </Box>
          <Typography sx={{ color: "white", marginTop: 2, marginBottom: 2 }}>
            Don't have an account?{" "}
            <Link href="/register" sx={{ color: "#3f51b5", textDecoration: "none" }}>
              Sign up!
            </Link>
          </Typography>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              '&:hover': {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Login
          </Button>
        </Container>
      </Box>
    </>
  );
}
