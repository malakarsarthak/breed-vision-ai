import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line, CartesianGrid
} from "recharts";

const COLORS = ['#2e7d32', '#ff9800', '#1976d2', '#9c27b0', '#f44336', '#795548'];

export default function AdminCharts() {
    const [districtData, setDistrictData] = useState([]);
    const [breedData, setBreedData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const base = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

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
        <div style={{ padding: "30px" }}>
            <h2 style={{ color: "#2e7d32", marginBottom: 25 }}>📊 Registration Analytics</h2>

            {loading && <p>Loading charts...</p>}

            {/* Row 1: District + Breed */}
            <div style={{
                display: "flex",
                gap: 20,
                marginBottom: 20
            }}>
                {/* District Chart */}
                <div style={{
                    flex: 1,
                    background: "#ffffff",
                    padding: 20,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    <h4>Registrations by Location</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={districtData}>
                            <XAxis dataKey="location" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#2e7d32" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Breed Pie Chart */}
                <div style={{
                    flex: 1,
                    background: "#ffffff",
                    padding: 20,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    <h4>Breed Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={breedData} dataKey="count" nameKey="breed" outerRadius={110} label>
                                {breedData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2: Daily Line Chart */}
            <div style={{
                background: "#ffffff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}>
                <h4>Daily Registrations (last 30 days)</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#2e7d32" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
