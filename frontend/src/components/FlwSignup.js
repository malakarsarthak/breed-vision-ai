import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, MenuItem, Box, Grid } from '@mui/material';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EMBLEM_SRC = `${process.env.PUBLIC_URL}/assests/gov-emblem.svg`;

export default function FlwSignup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userId: '',
        name: '',
        password: '',
        gender: '',
        district: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const res = await api.post('/users/register-flw', form);

            if (res.data.success) {
                Swal.fire({
                    title: 'Registration complete',
                    icon: 'success',
                    confirmButtonColor: '#1a237e',
                }).then(() => {
                    navigate('/');
                });

                setForm({
                    userId: '',
                    name: '',
                    password: '',
                    gender: '',
                    district: '',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.data.error || 'Registration failed',
                    confirmButtonColor: '#1a237e',
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to complete registration.',
                confirmButtonColor: '#1a237e',
            });
        }
    };

    return (
        <div className="gov-auth-shell">
            <div className="gov-auth-shell__glow gov-auth-shell__glow--alt" aria-hidden />
            <div className="gov-auth-shell__grid" aria-hidden />

            <div className="gov-auth-form-wrap gov-auth-form-wrap--center">
                <Card
                    className="gov-auth-card-premium gov-auth-card-premium--wide"
                    elevation={0}
                    sx={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}
                >
                    <div className="gov-auth-card-premium__accent" />
                    <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box className="gov-auth-emblem-ring gov-auth-emblem-ring--inline">
                                <Box component="img" src={EMBLEM_SRC} alt="" />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mt: 1 }}
                            >
                                Field Level Worker
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                                Bharat Pashudhan
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="User ID"
                                    fullWidth
                                    name="userId"
                                    value={form.userId}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    fullWidth
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Gender"
                                    fullWidth
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="District"
                                    fullWidth
                                    name="district"
                                    value={form.district}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            sx={{
                                mt: 3,
                                py: 1.35,
                                borderRadius: 2,
                                fontWeight: 700,
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: '0 8px 24px rgba(26, 35, 126, 0.28)',
                            }}
                        >
                            Submit registration
                        </Button>

                        <Button
                            fullWidth
                            sx={{ mt: 1.5, textTransform: 'none', fontWeight: 600, color: '#64748b' }}
                            onClick={() => navigate('/')}
                        >
                            ← Back to sign in
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
