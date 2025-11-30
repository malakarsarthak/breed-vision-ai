import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    BarChart, Bar, PieChart, Pie, Legend,
    ResponsiveContainer
} from "recharts";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Divider
} from "@mui/material";
import { reportsAPI } from "../services/api";

const Reports = () => {
    const [daily, setDaily] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [breedData, setBreedData] = useState([]);
    const [animalType, setAnimalType] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const trend = await reportsAPI.registrationsTrend();
        const breed = await reportsAPI.breedDistribution();
        const type = await reportsAPI.animalTypeSummary();

        setDaily(trend.daily || []);
        setMonthly(trend.monthly || []);
        setBreedData(breed.data || []);
        setAnimalType(type.data || []);
    };

    return (
        <Box sx={{ p: 3, background: "#f7f7f7", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight={600} mb={3}>
                📊 Reports Dashboard
            </Typography>

            <Grid container spacing={3}>

                {/* DAILY REGISTRATION */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight={500} mb={1}>
                            📅 Daily Registrations
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={daily}>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* MONTHLY REGISTRATION */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight={500} mb={1}>
                            📆 Monthly Registrations
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={monthly}>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* BREED-WISE DISTRIBUTION */}
                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight={500} mb={1}>
                            🐮 Breed-wise Registrations
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={breedData}>
                                <XAxis dataKey="_id" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#7c3aed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* CATTLE VS BUFFALO */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight={500} mb={1}>
                            🐄 Cattle vs Buffalo Ratio
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={animalType}
                                    dataKey="count"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#2563eb"
                                    label
                                />
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports;
