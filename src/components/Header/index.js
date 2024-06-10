import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

export default function Header() {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Remove the current user cookies
    removeCookies("currentUser");
    // Redirect back to home page
    navigate("/login");
    handleClose();
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/movies">
          <ListItemText primary="Movies" />
        </ListItem>
        {currentUser && role ? (
          <>
            {role === "admin" && (
              <>
                <ListItem button component={Link} to="/dashboard">
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/orders">
                  <ListItemText primary="Orders" />
                </ListItem>
              </>
            )}
            <ListItem button component={Link} to={`/profile/${currentUser._id}`}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar sx={{ backgroundColor: "#1a1a1a", marginBottom: "20px" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/" sx={{ color: "white" }}>
            <Typography variant="h5" sx={{ color: "white" }}>
              Movie Booking
            </Typography>
          </Button>
        </Box>
        {isMobile ? (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box>
            <Button
              color="inherit"
              component={Link}
              to="/movies"
              sx={{ color: "white", fontSize: "16px", marginRight: "10px" }}
            >
              Movies
            </Button>
            {currentUser && role ? (
              <>
                {role === "admin" && (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/dashboard"
                      sx={{ color: "white", fontSize: "16px", marginRight: "10px" }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/orders"
                      sx={{ color: "white", fontSize: "16px", marginRight: "10px" }}
                    >
                      Orders
                    </Button>
                  </>
                )}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  sx={{ color: "white" }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile/" + currentUser._id);
                      handleClose();
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ color: "white", fontSize: "16px", marginRight: "10px" }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{ color: "white", fontSize: "16px", marginRight: "10px" }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </AppBar>
  );
}
