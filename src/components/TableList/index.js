import { useQuery } from "@tanstack/react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Select, MenuItem } from "@mui/material";
import { getMovies, deleteMovie, updateMovie } from "../../utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';




export default function TableList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: rows, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });
  const deleteMovieMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Movie is deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["movies"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const updateMovieStatusMutation = useMutation({
    mutationFn: updateMovie,
    onSuccess: () => {
      enqueueSnackbar("Status updated successfully", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    },
  });
  
  const handleMovieDelete = (event, movieId) => {
    event.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to delete this Movie?"
    );
    if (confirm) {
      deleteMovieMutation.mutate(movieId);
    }
  };

  const handleStatusChange = (movieId, newStatus) => {
    updateMovieStatusMutation.mutate({ id: movieId, status: newStatus });
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  
  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: '#242424' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Director</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Release Year</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Genre</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Running Time</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Spoken Language</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Subtitles</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Classification</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Status</TableCell>
              <TableCell align="center" sx={{ color: 'white', borderBottom: '1px solid #424242' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.name}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.director}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{formatDate(row.release_date)}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>
                  {row.genre.map((genre, index) => (
                    <span key={index}>
                      {genre}
                      {index < row.genre.length - 1 ? ',\n' : ''}
                    </span>
                  ))}
                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.running_time}</TableCell>
                <TableCell align="center" sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.spoken_language}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.subtitles}</TableCell>
                <TableCell align="center" sx={{ color: 'white', borderBottom: '1px solid #424242' }}>{row.classification}</TableCell>
                <TableCell sx={{  borderBottom: '1px solid #424242' }}>
                  <Select
                    value={row.status || "pending"}
                    onChange={(e) => handleStatusChange(row._id, e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Status" }}
                    sx={{ minWidth: 120, color: 'white', backgroundColor: '#2c2c2c' }}
                    disabled={row.status === "publish"}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="publish">Publish</MenuItem>
                    <MenuItem value="coming_soon">Coming Soon</MenuItem>
                  </Select>
              </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', borderBottom: '1px solid #424242' }} align="center">
                  <IconButton
                    onClick={() => navigate("/movies/" + row._id)}
                    sx={{ marginRight: 1, color: 'white' }}
                    disabled={row.status === "publish"}
                  >
                    <EditIcon/>
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(event) => handleMovieDelete(event, row._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}