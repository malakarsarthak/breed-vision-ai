import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line, CartesianGrid
} from "recharts";

import { Typography, Box } from "@mui/material";

const COLORS = ['#2e7d32', '#ff9800', '#1976d2', '#9c27b0', '#f44336', '#795548'];

export default function AdminCharts() {

    const [districtData, setDistrictData] = useState([]);
    const [breedData, setBreedData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const base = process.env.REACT_APP_API_BASE_URL || "http://10.113.72.31:3001/api";

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
        <Box sx={{ p: { xs: 2, md: 4 } }}>

            {/* ✅ PAGE TITLE */}
            <Typography
                variant="h4"
                sx={{ color: "#2e7d32", fontWeight: "700", mb: 3 }}
            >
                📊 Registration Analytics
            </Typography>

            {loading && (
                <Typography sx={{ fontStyle: "italic" }}>Loading charts...</Typography>
            )}

            {/* ✅ TOP ROW: BAR + PIE */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                    mb: 2
                }}
            >

                {/* ✅ LOCATION CHART */}
                <ChartCard title="Registrations by Location">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={districtData}>
                            <XAxis dataKey="location" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#2e7d32" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* ✅ BREED PIE */}
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

            {/* ✅ LINE CHART */}
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


/* ✅ CHART CARD COMPONENT */
function ChartCard({ title, children }) {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                p: 2,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                minHeight: 300
            }}
        >

            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    color: "#333",
                    fontWeight: 600
                }}
            >
                {title}
            </Typography>

            {children}
        </Box>
    );
}
