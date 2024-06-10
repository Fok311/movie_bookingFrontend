import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import { getUser, updateUserRole } from "../../utils/api_user";
import { useCookies } from "react-cookie";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const queryClient = useQueryClient();

  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  
  useEffect(() => {
    if (!cookies.currentUser) {
      navigate("/login");
      enqueueSnackbar("Please Login before Access this page", { variant: "error" });
    }
  });

  const { data: user, error, isLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  });

  // when data is fetched from API, set the states for all the fields with its current value
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }) => updateUserRole(userId, newRole),
    onSuccess: () => {
      enqueueSnackbar("Role updated successfully", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/dashboard"); // navigate after successful update
    },
    onError: (error) => {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    },
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleFormSubmit = () => {
    updateUserRoleMutation.mutate({ userId: id, newRole: role });
  };

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>{error.message}</Container>;
  }

  return (
    <Box sx={{ backgroundColor: '#181818', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ marginTop: '60px', color: 'white', padding: '20px', borderRadius: '10px' }}>
        <Card sx={{ marginTop: '40px', backgroundColor: '#242424' }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                margin: "20px 0",
                fontWeight: "bold",
                textAlign: "center",
                color: 'white'
              }}
            >
              Edit User
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  disabled
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ backgroundColor: '#2c2c2c', color: 'white' }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Role" }}
                  fullWidth
                  sx={{ minWidth: 120, backgroundColor: '#2c2c2c', color: 'white' }}
                  MenuProps={{ PaperProps: { sx: { bgcolor: '#2c2c2c', color: 'white' } } }}
                >
                  <MenuItem value="user" sx={{ color: 'white' }}>User</MenuItem>
                  <MenuItem value="admin" sx={{ color: 'white' }}>Admin</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFormSubmit}
                  sx={{ backgroundColor: '#3f51b5', color: 'white' }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
