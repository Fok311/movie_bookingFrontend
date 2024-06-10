import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, MenuItem, Select, Box, colors } from "@mui/material";
import Header from "../../components/Header";
import TableList from "../../components/TableList";
import Button from "@mui/material/Button";
import UserTableList from "../../components/userTableList";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("movies");
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;

  const { enqueueSnackbar } = useSnackbar();

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

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#181818', minHeight: '100vh' }}>
      <Header />
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "60px" }}>
            <div style={{ marginTop: "40px"}}>
              <Select value={selectedOption} onChange={handleOptionChange} sx={{ color: 'white', backgroundColor: '#242424'}} >
                <MenuItem value="movies">Show Movies</MenuItem>
                <MenuItem value="users">Show Users</MenuItem>
              </Select>
            </div>
            {/* Render the button only if selected option is "Show Movies" */}
            {selectedOption === "movies" && (
              <div style={{ marginTop: "40px"}}> 
                <Button variant="contained" color="primary" onClick={() => navigate("/add")}>
                  Add Movie
                </Button>
              </div>
            )}
          </div>
          {selectedOption === "movies" ? <TableList /> : <UserTableList />}
        </Container>
      </Box>
    </>
  );  
}
