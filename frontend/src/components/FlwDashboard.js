import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button
} from "@mui/material";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function FlwDashboard({ user }) {
    const [stats, setStats] = useState({
        today: 0,
        month: 0,
        accuracy: 0,
        recent: []
    });

    const loadStats = async () => {
        try {
            if (!user || !user.userId) return;

            const res = await api.get(`/animals/flw-stats/${user.userId}`);

            if (res.data && res.data.success) {
                setStats({
                    today: res.data.today || 0,
                    month: res.data.month || 0,
                    accuracy: res.data.accuracy || 0,
                    recent: res.data.recent || []
                });
            }
        } catch (err) {
            console.error("Stats load error:", err);
        }
    };

    useEffect(() => {
        loadStats();
    }, [user]);

    return (
        <Box p={{ xs: 1.5, sm: 2, md: 4 }}>

            {/* HEADER CARD */}
            <Card
                sx={{
                    background: "#2e7d32",
                    color: "white",
                    mb: 4,
                    borderRadius: "12px",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.15)"
                }}
            >
                <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Welcome, {user?.name}!
                    </Typography>
                    <Typography mt={1} sx={{ opacity: 0.9 }}>
                        Field Level Worker Dashboard
                    </Typography>
                </CardContent>
            </Card>

            {/* SUMMARY CARDS */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="dashboard-card">
                        <CardContent sx={{ textAlign: "center", py: 3 }}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: "2.2rem", sm: "2.5rem", md: "2.8rem" },
                                    color: "#2e7d32"
                                }}
                            >

                                {stats.today}
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                                Registered Today
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="dashboard-card">
                        <CardContent sx={{ textAlign: "center", py: 3 }}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: "2.2rem", sm: "2.5rem", md: "2.8rem" },
                                    color: "#2e7d32"
                                }}
                            >
                                {stats.month}
                            </Typography>
                            <Typography>Total This Month</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="dashboard-card">
                        <CardContent sx={{ textAlign: "center", py: 3 }}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: "2.2rem", sm: "2.5rem", md: "2.8rem" },
                                    color: "#2e7d32"
                                }}
                            >
                                {stats.accuracy}%
                            </Typography>
                            <Typography>Accuracy Rate</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* QUICK ACTIONS */}
            <Typography variant="h6" mt={5} mb={2} sx={{ fontWeight: 600 }}>
                Quick Actions
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
                            }}
                        >
                            New Registration
                        </Typography>
                        <Link to="/register">
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                sx={{ mt: 1, py: 1 }}
                            >

                                <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

                            </Button>
                        </Link>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
                            }}
                        >
                            Search & History
                        </Typography>

                        <Link to="/search">
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                sx={{ mt: 1, py: 1 }}
                            >

                                <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

                            </Button>
                        </Link>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
                            }}
                        >
                            Breed Info
                        </Typography>

                        <Link to="/breeds">
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                sx={{ mt: 1, py: 1 }}
                            >
                                <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

                            </Button>
                        </Link>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
                            }}
                        >
                            Reports
                        </Typography>

                        <Link to="/reports">
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                sx={{ mt: 1, py: 1 }}
                            >

                                <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

                            </Button>
                        </Link>
                    </Card>
                </Grid>
            </Grid>

            {/* RECENT ACTIVITY */}
            <Typography variant="h6" mt={5} mb={2} sx={{ fontWeight: 600 }}>
                Recent Activity
            </Typography>

            <Card sx={{ borderRadius: "12px" }}>
                <CardContent>
                    {stats.recent.length === 0 ? (
                        <Typography>No recent activity found</Typography>
                    ) : (
                        stats.recent.map((item, idx) => (
                            <Typography
                                key={idx}
                                sx={{
                                    py: 1,
                                    borderBottom:
                                        idx !== stats.recent.length - 1
                                            ? "1px solid #eee"
                                            : "none"
                                }}
                            >
                                • {item}
                            </Typography>
                        ))
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
