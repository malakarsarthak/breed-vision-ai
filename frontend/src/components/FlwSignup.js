import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, MenuItem, Box } from "@mui/material";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function FlwSignup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userId: "",
        name: "",
        password: "",
        gender: "",
        district: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const res = await api.post("/users/register-flw", form);

            if (res.data.success) {
                // SUCCESS POPUP
                Swal.fire({
                    title: "Registration Successful!",
                    text: "You can now login using your credentials.",
                    icon: "success",
                    confirmButtonText: "Go to Login"
                }).then(() => {
                    navigate("/"); // redirect to login page
                });

                // Clear form
                setForm({
                    userId: "",
                    name: "",
                    password: "",
                    gender: "",
                    district: ""
                });
            } else {
                // ERROR POPUP
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res.data.error || "Registration failed"
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Unable to register FLW right now"
            });
        }
    };

    return (
        <Box p={4} display="flex" justifyContent="center">
            <Card sx={{ width: 400 }}>
                <CardContent>
                    <Typography variant="h5" textAlign="center">
                        Field Level Worker Registration
                    </Typography>

                    <TextField
                        label="User ID"
                        fullWidth
                        sx={{ mt: 2 }}
                        name="userId"
                        value={form.userId}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Name"
                        fullWidth
                        sx={{ mt: 2 }}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Password"
                        fullWidth
                        sx={{ mt: 2 }}
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        label="Gender"
                        fullWidth
                        sx={{ mt: 2 }}
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </TextField>

                    <TextField
                        label="District"
                        fullWidth
                        sx={{ mt: 2 }}
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={handleSubmit}
                    >
                        Register FLW
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
