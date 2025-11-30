import React, { useEffect, useState } from "react";
import { authAPI } from "../services/api";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return navigate("/");

                const response = await authAPI.getUserDetails(token);

                if (response.success) {
                    setUser(response.user);
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("User fetch failed:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="dashboard-container">

            {/* Top Header */}
            <div className="dashboard-header">
                <h1>Welcome, {user?.name || "User"}!</h1>
                <p>Field Level Worker Dashboard - {user?.state || "State"}</p>

                <span className="dashboard-role">Role: {user?.role || "Field Worker"}</span>
            </div>

            {/* Summary Cards */}
            <section className="summary-section">
                <div className="summary-card">
                    <i className="material-icons summary-icon">pets</i>
                    <h2>23</h2>
                    <p>Animals Registered Today</p>
                </div>

                <div className="summary-card">
                    <i className="material-icons summary-icon">trending_up</i>
                    <h2>456</h2>
                    <p>Total This Month</p>
                </div>

                <div className="summary-card">
                    <i className="material-icons summary-icon">bar_chart</i>
                    <h2>94%</h2>
                    <p>Accuracy Rate</p>
                </div>
            </section>

            {/* Quick Actions */}
            <h2 className="section-title">Quick Actions</h2>
            <section className="quick-actions">

                <div className="action-card green-card">
                    <i className="material-icons action-icon">add</i>
                    <h3>Register New Animal</h3>
                    <p>Register a new cattle or buffalo with AI breed recognition</p>
                    <button onClick={() => navigate("/register")}>OPEN</button>
                </div>

                <div className="action-card yellow-card">
                    <i className="material-icons action-icon">search</i>
                    <h3>Search & History</h3>
                    <p>Search animals and view registration history</p>
                    <button onClick={() => navigate("/search")}>OPEN</button>
                </div>

                <div className="action-card blue-card">
                    <i className="material-icons action-icon">info</i>
                    <h3>Breed Information</h3>
                    <p>Browse cattle & buffalo breed details</p>
                    <button onClick={() => navigate("/breed-info")}>OPEN</button>
                </div>

                <div className="action-card purple-card">
                    <i className="material-icons action-icon">insights</i>
                    <h3>Reports</h3>
                    <p>View registration statistics and reports</p>
                    <button onClick={() => navigate("/reports")}>OPEN</button>
                </div>

            </section>
        </div>
    );
};

export default Dashboard;

