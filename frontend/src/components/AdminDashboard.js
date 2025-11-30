import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function AdminDashboard() {
    const [flws, setFlws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    // Fetch FLWs
    const fetchFLWs = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/users/flw");
            const data = await response.json();
            if (data.success) {
                setFlws(data.users);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFLWs();
    }, []);

    // Delete FLW
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this FLW?")) return;

        try {
            setDeletingId(id);
            const result = await authAPI.deleteFLW(id);

            if (result.success) {
                alert("FLW Deleted Successfully!");
                fetchFLWs();
            } else {
                alert(`Delete Failed: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div style={{ padding: "25px" }}>
            
            {/* TOP HEADER BUTTONS */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px"
            }}>
                <h2 style={{ color: "#2e7d32", fontWeight: "700" }}>
                    Admin Dashboard
                </h2>

                <div style={{ display: "flex", gap: "10px" }}>

                    {/* View Charts */}
                    <button
                        onClick={() => navigate('/admin/charts')}
                        style={topButtonBlue}
                    >
                        📊 View Charts
                    </button>

                    {/* View Animals */}
                    <button
                        onClick={() => navigate("/admin/animals")}
                        style={topButtonBlue}
                    >
                        🐄 View All Animals
                    </button>

                    {/* Add FLW */}
                    <button
                        onClick={() => navigate("/admin/add-flw")}
                        style={topButtonGreen}
                    >
                        ➕ Add New FLW
                    </button>
                </div>
            </div>

            <h3 style={{ marginBottom: "15px" }}>Field Level Workers</h3>

            {loading ? (
                <p>Loading...</p>
            ) : flws.length === 0 ? (
                <p>No FLWs found.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "white",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.1)"
                    }}
                >
                    <thead style={{ backgroundColor: "#e8f5e9" }}>
                        <tr>
                            <th style={thStyle}>User ID</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>District</th>
                            <th style={thStyle}>Gender</th>
                            <th style={thStyle}>Trained</th>
                            <th style={thStyle}>Breeds Identified</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {flws.map((flw, index) => (
                            <tr
                                key={flw._id}
                                style={{
                                    backgroundColor: index % 2 === 0 ? "#fafafa" : "white"
                                }}
                            >
                                <td style={tdStyle}>{flw.userId}</td>
                                <td style={tdStyle}>{flw.name}</td>
                                <td style={tdStyle}>{flw.district}</td>
                                <td style={tdStyle}>{flw.gender}</td>
                                <td style={tdStyle}>{flw.isTrained ? "Yes" : "No"}</td>
                                <td style={tdStyle}>{flw.totalBreedsIdentified || 0}</td>

                                <td style={{ ...tdStyle, display: "flex", gap: "10px" }}>

                                    {/* EDIT BUTTON */}
                                    <button
                                        onClick={() => navigate(`/admin/edit-flw/${flw._id}`)}
                                        style={{
                                            padding: "6px 10px",
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontWeight: "600"
                                        }}
                                    >
                                        ✏ Edit
                                    </button>

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() => handleDelete(flw._id)}
                                        disabled={deletingId === flw._id}
                                        style={{
                                            padding: "6px 10px",
                                            backgroundColor: deletingId === flw._id ? "#ccc" : "red",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: deletingId === flw._id ? "not-allowed" : "pointer",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {deletingId === flw._id ? "Deleting..." : "Delete"}
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// Styles
const topButtonBlue = {
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
};

const topButtonGreen = {
    padding: "10px 20px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
};

const thStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "15px",
    borderBottom: "1px solid #c8e6c9",
};

const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
};

export default AdminDashboard;
