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

// 🔥 i18n
import { useTranslation } from "react-i18next";

const SearchHistory = ({ user }) => {
    const { t } = useTranslation();

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
            setError(t("error_load_history") + ": " + err.message);
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
            setError(t("error_search") + ": " + err.message);
        }
    };

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    // DELETE SINGLE
    const deleteSingle = async (id) => {
        try {
            const yes = await Swal.fire({
                title: t("delete_record_title"),
                text: t("delete_warning"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2e7d32",
                cancelButtonColor: "#b71c1c",
                confirmButtonText: t("delete_button")
            });

            if (!yes.isConfirmed) return;

            await animalAPI.delete(id);
            fetchHistory();

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: t("delete_failed"),
                text: err.response?.data?.error || t("api_not_found")
            });
        }
    };

    // MULTI SELECT
    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // DELETE MULTIPLE
    const deleteSelected = async () => {
        if (selected.length === 0) return;

        try {
            const yes = await Swal.fire({
                title: t("delete_multiple_title", { count: selected.length }),
                text: t("delete_warning"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2e7d32",
                cancelButtonColor: "#b71c1c",
                confirmButtonText: t("delete_all_button")
            });

            if (!yes.isConfirmed) return;

            await animalAPI.deleteMultiple(selected);
            setSelected([]);
            fetchHistory();

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: t("delete_failed"),
                text: err.response?.data?.error || t("api_not_found")
            });
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography sx={{
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.1rem", md: "1.15rem" }
            }}>
                {t("search_history_title")}
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

                <TextField
                    fullWidth
                    name="tagId"
                    label={t("tag_id")}
                    value={searchParams.tagId}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    name="breed"
                    label={t("breed")}
                    value={searchParams.breed}
                    onChange={handleChange}
                />

                <TextField
                    name="date"
                    label={t("date")}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={searchParams.date}
                    onChange={handleChange}
                />

                <Button fullWidth variant="contained" onClick={handleSearch}>
                    {t("search")}
                </Button>

                <Button fullWidth onClick={fetchHistory}>
                    {t("reset")}
                </Button>

                {selected.length > 0 && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={deleteSelected}
                    >
                        {t("delete_selected", { count: selected.length })}
                    </Button>
                )}
            </Box>

            {/* RESULTS */}
            <Grid container spacing={3}>
                {history.length === 0 ? (
                    <Typography>{t("no_records")}</Typography>
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
                                        image={`http://127.0.0.1:3001${animal.imageUrl}`}
                                        alt="Animal"
                                    />
                                )}

                                <CardContent>

                                    {/* SELECT CHECKBOX */}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selected.includes(animal._id)}
                                                onChange={() => toggleSelect(animal._id)}
                                            />
                                        }
                                        label={t("select")}
                                    />

                                    {/* DELETE SINGLE */}
                                    <IconButton
                                        sx={{
                                            float: "right",
                                            color: "#b71c1c"
                                        }}
                                        onClick={() => deleteSingle(animal._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                    {/* DETAILS */}
                                    <Typography><strong>{t("tag")}:</strong> {animal.tagId}</Typography>
                                    <Typography><strong>{t("breed")}:</strong> {animal.breed}</Typography>
                                    <Typography><strong>{t("owner")}:</strong> {animal.ownerName}</Typography>
                                    <Typography>
                                        <strong>{t("date")}:</strong> {new Date(animal.createdAt).toLocaleDateString()}
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
