import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line, CartesianGrid
} from "recharts";

import { Typography, Box } from "@mui/material";

const COLORS = ['#1a237e', '#2e7d32', '#e65100', '#3949ab', '#c62828', '#6a1b9a'];

export default function AdminCharts() {

    const [districtData, setDistrictData] = useState([]);
    const [breedData, setBreedData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const base = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        loadCharts();
    }, []);

    const loadCharts = async () => {
        try {
            const [d, b, day] = await Promise.all([
                fetch(`${base}/animals/stats/district`).then(r => r.json()),
                fetch(`${base}/animals/stats/breed`).then(r => r.json()),
                fetch(`${base}/animals/stats/daily?days=30`).then(r => r.json())
            ]);

            if (d.success) setDistrictData(d.data);
            if (b.success) setBreedData(b.data);
            if (day.success) setDailyData(day.data);
        } catch (err) {
            console.error("Chart fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="gov-page" sx={{ p: { xs: 2, md: 3 } }}>

            <Typography
                variant="h5"
                sx={{ color: "#1a237e", fontWeight: "700", mb: 3, letterSpacing: '0.02em' }}
            >
                Registration analytics
            </Typography>

            {loading && (
                <Typography sx={{ fontStyle: "italic" }}>Loading charts...</Typography>
            )}

            {/* TOP ROW: BAR + PIE */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                    mb: 2
                }}
            >

                {/* LOCATION CHART */}
                <ChartCard title="Registrations by Location">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={districtData}>
                            <XAxis dataKey="location" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#1a237e" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/*BREED PIE */}
                <ChartCard title="Breed Distribution">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={breedData}
                                dataKey="count"
                                nameKey="breed"
                                outerRadius={90}
                                label
                            >
                                {breedData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </Box>

            {/* LINE CHART */}
            <ChartCard title="Daily Registrations (last 30 days)">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={dailyData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#2e7d32"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

        </Box>
    );
}


/* CHART CARD COMPONENT */
function ChartCard({ title, children }) {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                p: 2,
                borderRadius: 1,
                border: '1px solid #cfd8dc',
                boxShadow: "0 2px 10px rgba(26,35,126,0.06)",
                minHeight: 300
            }}
        >

            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    color: "#1a237e",
                    fontWeight: 700,
                    fontSize: '1rem',
                }}
            >
                {title}
            </Typography>

            {children}
        </Box>
    );
}
