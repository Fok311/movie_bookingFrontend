import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  Link
} from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getUserSignUp } from "../../utils/api_auth";

export default function Register() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookies] = useCookies(["currentUser"]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getUserSignUpMutation = useMutation({
    mutationFn: getUserSignUp,
    onSuccess: (data) => {
      setCookies("currentUser", data, { maxAge: 60 * 60 * 24 * 30 }); //3600 * 24 = 24 hours * 30 = 1 month
      enqueueSnackbar("Login Successfully", { variant: "success" });
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleSignUp = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      enqueueSnackbar("All fields are required", { variant: "error" });
    } else if (!emailRegex.test(email)) {
      enqueueSnackbar("Invalid email format, must be valid email format", { variant: "error" });
    } else if (password !== confirmPassword) {
      enqueueSnackbar("Passwords must match", { variant: "error" });
    } else {
      getUserSignUpMutation.mutate({
        name,
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
        <Container maxWidth="sm">
          <Card sx={{ mt: 4, backgroundColor: "#242424", color: "white" }}>
            <CardContent>
              <Grid container spacing={3} sx={{ p: 2 }}>
                <Grid item xs={12}>
                  <Typography>Name</Typography>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                </Grid>
                <Grid item xs={12}>
                  <Typography>Email</Typography>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Email"
                    value={email}
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
                </Grid>
                <Grid item xs={12}>
                  <Typography>Password</Typography>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    type="password"
                    placeholder="Password"
                    value={password}
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
                </Grid>
                <Grid item xs={12}>
                  <Typography>Confirm Password</Typography>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                </Grid>
                <Typography sx={{ color: "white", marginTop: 2, marginLeft: "30px" }}>
                    Already have an account?{" "}
                    <Link href="/login" sx={{ color: "#3f51b5", textDecoration: "none" }}>
                      Login!
                    </Link>
                </Typography>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      textTransform: "capitalize",
                      backgroundColor: "#3f51b5",
                      color: "white",
                      '&:hover': {
                        backgroundColor: "#303f9f",
                      },
                    }}
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
