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
    Box
} from '@mui/material';
import { animalAPI } from '../services/api';

const SearchHistory = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [searchParams, setSearchParams] = useState({
        tagId: '',
        breed: '',
        date: ''
    });
    const [error, setError] = useState('');

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

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Registration History & Search
            </Typography>

            {error && (
                <Box mb={2}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {/* SEARCH BAR */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: "wrap" }}>
                <TextField
                    name="tagId"
                    label="Tag ID"
                    value={searchParams.tagId}
                    onChange={handleChange}
                />

                <TextField
                    name="breed"
                    label="Breed"
                    value={searchParams.breed}
                    onChange={handleChange}
                />

                {/* Single Date Filter */}
                <TextField
                    name="date"
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={searchParams.date}
                    onChange={handleChange}
                />

                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>

                <Button onClick={fetchHistory}>
                    Reset
                </Button>
            </Box>

            {/* DISPLAY RESULTS */}
            <Grid container spacing={2}>
                {history.length === 0 ? (
                    <Typography>No records found.</Typography>
                ) : (
                    history.map((animal) => (
                        <Grid item xs={12} md={6} key={animal._id}>
                            <Card>
                                {animal.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:3001${animal.imageUrl}`}
                                        alt="Animal"
                                    />
                                )}
                                <CardContent>
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
