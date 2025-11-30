import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from './components/Header';
import Authentication from './components/Authentication';

import FlwDashboard from './components/FlwDashboard';   // ⭐ Correct FLW Dashboard
import AnimalRegistration from './components/AnimalRegistration';
import BreedInfo from './components/BreedInfo';
import SearchHistory from './components/SearchHistory';

import AdminDashboard from "./components/AdminDashboard";
import AddFLW from "./components/AddFLW";
import AdminAnimals from "./components/AdminAnimals";
import AdminCharts from "./components/AdminCharts";
import EditFLW from "./components/EditFLW";
import FlwSignup from "./components/FlwSignup";
import Profile from "./components/Profile";
import Reports from "./components/Reports";

import './styles/App.css';

const theme = createTheme({
    palette: {
        primary: { main: '#2e7d32' },
        secondary: { main: '#ff9800' },
        background: { default: '#f5f5f5' },
    },
    typography: {
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        h4: { fontWeight: 600 },
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>

                {isAuthenticated && <Header user={user} onLogout={handleLogout} />}

                <main className="main-content">
                    <Routes>

                        {/* LOGIN PAGE */}
                        <Route
                            path="/"
                            element={
                                isAuthenticated
                                    ? user?.role === "admin"
                                        ? <Navigate to="/admin" />
                                        : <Navigate to="/dashboard" />
                                    : <Authentication onLogin={handleLogin} />
                            }
                        />

                        {/* ⭐ FLW DASHBOARD */}
                        <Route
                            path="/dashboard"
                            element={
                                isAuthenticated && user?.role === "flw"
                                    ? <FlwDashboard user={user} />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* FLW: ANIMAL REGISTRATION */}
                        <Route
                            path="/register"
                            element={
                                isAuthenticated && user?.role === "flw"
                                    ? <AnimalRegistration user={user} />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* FLW: BREED INFO */}
                        <Route
                            path="/breeds"
                            element={
                                isAuthenticated && user?.role === "flw"
                                    ? <BreedInfo />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* FLW: SEARCH HISTORY */}
                        <Route
                            path="/search"
                            element={
                                isAuthenticated && user?.role === "flw"
                                    ? <SearchHistory user={user} />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* ADMIN DASHBOARD */}
                        <Route
                            path="/admin"
                            element={
                                isAuthenticated && user?.role === "admin"
                                    ? <AdminDashboard user={user} />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* ADMIN: ADD FLW */}
                        <Route
                            path="/admin/add-flw"
                            element={
                                isAuthenticated && user?.role === "admin"
                                    ? <AddFLW />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* ADMIN: VIEW ALL ANIMALS */}
                        <Route
                            path="/admin/animals"
                            element={
                                isAuthenticated && user?.role === "admin"
                                    ? <AdminAnimals />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* ADMIN: CHARTS PAGE */}
                        <Route
                            path="/admin/charts"
                            element={
                                isAuthenticated && user?.role === "admin"
                                    ? <AdminCharts />
                                    : <Navigate to="/" />
                            }
                        />

                        {/* ADMIN: EDIT FLW */}
                        <Route
                            path="/admin/edit-flw/:id"
                            element={
                                isAuthenticated && user?.role === "admin"
                                    ? <EditFLW />
                                    : <Navigate to="/" />
                            }
                        />
                        {/* FLW: Register */}
                        <Route path="/flw-register" element={<FlwSignup />} />
                        {/* Profile */}
                        <Route
                            path="/profile"
                            element={<Profile user={user} onLogout={logout} />}
                        />

                       <Route path="/reports" element={<Reports user={user} />} />


                    </Routes>
                </main>

            </Router>
        </ThemeProvider>
    );
}

export default App;
