import React, { useState } from "react";
import { authAPI } from "../services/api";
import { TextField, Button, Card, CardContent, Typography, FormControlLabel, Checkbox, MenuItem } from "@mui/material";

function AddFLW() {
    const [form, setForm] = useState({
        userId: "",
        name: "",
        password: "",
        gender: "",
        district: "",
        isTrained: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async () => {
        if (!form.userId || !form.name || !form.password) {
            alert("User ID, Name and Password are required");
            return;
        }

        setLoading(true);
        const response = await authAPI.registerFLW(form);
        setLoading(false);

        if (response.success) {
            alert("FLW Registered Successfully");

            setForm({
                userId: "",
                name: "",
                password: "",
                gender: "",
                district: "",
                isTrained: false,
            });
        } else {
            alert(response.error);
        }
    };

    return (
        <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
            <Card style={{ width: "450px", padding: "20px" }}>
                <CardContent>
                    <Typography variant="h5" style={{ fontWeight: "600", marginBottom: "20px" }}>
                        Add New Field Level Worker
                    </Typography>

                    <TextField
                        label="User ID"
                        name="userId"
                        value={form.userId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        select
                        label="Gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </TextField>

                    <TextField
                        label="District"
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isTrained"
                                checked={form.isTrained}
                                onChange={handleChange}
                            />
                        }
                        label="Training Completed"
                        style={{ marginTop: "10px" }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        style={{ marginTop: "20px" }}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register FLW"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddFLW;
