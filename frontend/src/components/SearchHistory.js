import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
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
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://breed-vision-ai-backend.onrender.com";
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
                confirmButtonColor: "#1a237e",
                cancelButtonColor: "#c62828",
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
                confirmButtonColor: "#1a237e",
                cancelButtonColor: "#c62828",
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
        <Container className="gov-page" sx={{ mt: 0, pt: 2 }}>
            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.35rem', sm: '1.5rem' },
                    color: '#1a237e',
                    letterSpacing: '0.02em',
                }}
            >
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
                            <Card
                                sx={{
                                    borderRadius: 1,
                                    border: '1px solid #cfd8dc',
                                    boxShadow: '0 2px 10px rgba(26,35,126,0.06)',
                                    overflow: 'hidden',
                                }}
                            >

                                {/* IMAGE — full photo visible, no crop (preserves upload aspect ratio) */}
                                {animal.imageUrl && (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            bgcolor: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            py: 1.5,
                                            px: 1,
                                            minHeight: 140,
                                            maxHeight: { xs: 320, sm: 380 },
                                            borderBottom: '1px solid #e2e8f0',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                           src={`${BASE_URL}${animal.imageUrl}`}
                                            alt=""
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: { xs: 300, sm: 360 },
                                                width: 'auto',
                                                height: 'auto',
                                                objectFit: 'contain',
                                                display: 'block',
                                            }}
                                        />
                                    </Box>
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
