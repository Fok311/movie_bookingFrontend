import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { getUsers, updateUserRole, deleteUser } from "../../utils/api_user";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function UserTableList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role} = currentUser;

  useEffect(() => {
    if (!cookies.currentUser) {
      navigate("/login");
      enqueueSnackbar("Please Login before Access this page", { variant: "error" });
    }
  }, [cookies.currentUser, enqueueSnackbar, navigate]);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      enqueueSnackbar("You have no permissions to access this Page", { variant: "error" });
    }
  }, [role, enqueueSnackbar, navigate]);

  // Fetching users data
  const { data: rows, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Mutation to update user role
  const updateUserRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      enqueueSnackbar("Role updated successfully", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    },
  });

  // Mutation to delete user
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      enqueueSnackbar("User deleted successfully", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    },
  });

  // Function to handle user deletion
  const handleUserDelete = (event, userId) => {
    event.preventDefault();
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (confirm) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Box sx={{ backgroundColor: '#181818' }}>
      <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: '#242424' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Role</TableCell>
              <TableCell align="center" sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.name}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.email}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.role}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', borderBottom: '1px solid #424242' }} align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate("/users/" + row._id)}
                    sx={{ marginRight: 1, color: 'white' }}
                    disabled={currentUser._id === row._id} // Disable the edit button if it's the current user's row
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(event) => handleUserDelete(event, row._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
