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

// 🔥 i18n
import { useTranslation } from "react-i18next";

const Reports = () => {
    const { t } = useTranslation();

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
        <Box className="gov-page" sx={{ p: { xs: 2, md: 3 }, minHeight: "60vh" }}>
            <Typography sx={{
                fontWeight: 700,
                fontSize: { xs: "1.35rem", sm: "1.5rem" },
                color: '#1a237e',
                mb: 2,
            }}>
                {t("reports_dashboard")}
            </Typography>

            <Grid container spacing={3}>

                {/* DAILY REGISTRATION */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, border: '1px solid #cfd8dc', borderRadius: 1, boxShadow: '0 2px 10px rgba(26,35,126,0.06)' }}>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1.2rem", sm: "1.1rem", md: "1.15rem" }
                        }}>
                            {t("daily_registrations")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={daily}>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#1a237e" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* MONTHLY REGISTRATION */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, border: '1px solid #cfd8dc', borderRadius: 1, boxShadow: '0 2px 10px rgba(26,35,126,0.06)' }}>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1.2rem", sm: "1.1rem", md: "1.15rem" }
                        }}>
                            {t("monthly_registrations")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={monthly}>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2e7d32" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* BREED-WISE DISTRIBUTION */}
                <Grid item xs={12}>
                    <Card sx={{ p: 2, border: '1px solid #cfd8dc', borderRadius: 1, boxShadow: '0 2px 10px rgba(26,35,126,0.06)' }}>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1.2rem", sm: "1.1rem", md: "1.15rem" }
                        }}>
                            {t("breed_wise")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={breedData}>
                                <XAxis dataKey="_id" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3949ab" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* CATTLE VS BUFFALO */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, border: '1px solid #cfd8dc', borderRadius: 1, boxShadow: '0 2px 10px rgba(26,35,126,0.06)' }}>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1.2rem", sm: "1.1rem", md: "1.15rem" }
                        }}>
                            {t("cattle_vs_buffalo")}
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
