import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    TextField,
    Button,
    Box,
    Checkbox,
    IconButton,
    FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

import { animalAPI } from '../services/api';

const SearchHistory = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [searchParams, setSearchParams] = useState({
        tagId: '',
        breed: '',
        date: ''
    });
    const [error, setError] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (user?.userId) fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        setError('');
        try {
            const res = await animalAPI.getHistory(user.userId);
            setHistory(res.data || []);
        } catch (err) {
            setError('Failed to load history: ' + err.message);
        }
    };

    const handleSearch = async () => {
        setError('');
        try {
            const res = await animalAPI.search({
                tagId: searchParams.tagId,
                breed: searchParams.breed,
                date: searchParams.date
            });

            setHistory(res.data || []);
        } catch (err) {
            setError('Search failed: ' + err.message);
        }
    };

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    // ---------------------
    // DELETE SINGLE
    // ---------------------
    const deleteSingle = async (id) => {
        try {
            const yes = await Swal.fire({
                title: "Delete record?",
                text: "This cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2e7d32",
                cancelButtonColor: "#b71c1c",
                confirmButtonText: "Delete",
            });

            if (!yes.isConfirmed) return;

            await animalAPI.delete(id);
            fetchHistory();

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: err.response?.data?.error || "Delete API not found on server",
            });
        }
    };

    // ---------------------
    // MULTI SELECTION
    // ---------------------
    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ---------------------
    // DELETE MULTIPLE
    // ---------------------
    const deleteSelected = async () => {
        if (selected.length === 0) return;

        try {
            const yes = await Swal.fire({
                title: `Delete ${selected.length} records?`,
                text: "This cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2e7d32",
                cancelButtonColor: "#b71c1c",
                confirmButtonText: "Delete All",
            });

            if (!yes.isConfirmed) return;

            await animalAPI.deleteMultiple(selected);
            setSelected([]);
            fetchHistory();

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: err.response?.data?.error || "Delete API not found on server",
            });
        }
    };


    return (
        <Container sx={{ mt: 4 }}>
            <Typography sx={{
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.1rem", md: "1.15rem" }
            }}>
                Registration History & Search
            </Typography>

            {error && (
                <Box mb={2}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {/* SEARCH BAR */}
            <Box
                sx={{
                    mb: 3,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" },
                    gap: 2,
                    alignItems: "center"
                }}
            >

                <TextField fullWidth
                    name="tagId"
                    label="Tag ID"
                    value={searchParams.tagId}
                    onChange={handleChange}
                />

                <TextField fullWidth
                    name="breed"
                    label="Breed"
                    value={searchParams.breed}
                    onChange={handleChange}
                />

                <TextField
                    name="date"
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={searchParams.date}
                    onChange={handleChange}
                />

                <Button fullWidth variant="contained" onClick={handleSearch}>
                    Search
                </Button>

                <Button fullWidth onClick={fetchHistory}>

                    Reset
                </Button>

                {selected.length > 0 && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={deleteSelected}
                    >
                        Delete Selected ({selected.length})
                    </Button>
                )}
            </Box>

            {/* RESULTS */}
            <Grid container spacing={3}>
                {history.length === 0 ? (
                    <Typography>No records found.</Typography>
                ) : (
                    history.map((animal) => (
                        <Grid item xs={12} sm={6} key={animal._id}>
                            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>

                                {/* IMAGE */}
                                {animal.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            width: "100%",
                                            height: { xs: 180, sm: 220 },
                                            objectFit: "cover",
                                            borderRadius: "6px"
                                        }}
                                        image={`http://10.113.72.31:3001${animal.imageUrl}`}
                                        alt="Animal"
                                    />


                                )}

                                <CardContent>

                                    {/* Select checkbox */}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selected.includes(animal._id)}
                                                onChange={() => toggleSelect(animal._id)}
                                            />
                                        }
                                        label="Select"
                                    />

                                    {/* Delete single */}
                                    <IconButton
                                        sx={{
                                            float: "right",
                                            color: "#b71c1c"
                                        }}
                                        onClick={() => deleteSingle(animal._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                    {console.log(animal.imageUrl)}

                                    {/* DETAILS */}
                                    <Typography><strong>Tag:</strong> {animal.tagId}</Typography>
                                    <Typography><strong>Breed:</strong> {animal.breed}</Typography>
                                    <Typography><strong>Owner:</strong> {animal.ownerName}</Typography>
                                    <Typography>
                                        <strong>Date:</strong> {new Date(animal.createdAt).toLocaleDateString()}
                                    </Typography>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}

            </Grid>
        </Container>
    );
};

export default SearchHistory;
