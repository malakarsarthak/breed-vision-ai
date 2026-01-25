import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function AdminDashboard() {

    const [flws, setFlws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    //Detect screen
    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    //Fetch FLWs
    const fetchFLWs = async () => {
        try {
            const response = await fetch("http://127.0.0.1:3001/api/users/flw");
            const data = await response.json();
            if (data.success) setFlws(data.users);
        } catch (error) {
            console.error("Fetch error:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFLWs();
    }, []);

    // DELETE FLW
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this FLW?")) return;

        try {
            setDeletingId(id);
            const result = await authAPI.deleteFLW(id);

            if (result.success) {
                alert("FLW Deleted Successfully!");
                fetchFLWs();
            } else alert(`Delete Failed: ${result.error}`);
        } catch (err) {
            alert("Something went wrong.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            <h2 style={{ color: "#2e7d32", fontWeight: "700", marginBottom: "10px" }}>
                Admin Dashboard
            </h2>

            {/*Buttons */}
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
                gap: "12px",
                marginBottom: "25px"
            }}>
                <button onClick={() => navigate('/admin/charts')} style={topButtonBlue}>📊 View Charts</button>
                <button onClick={() => navigate("/admin/animals")} style={topButtonBlue}>🐄 View All Animals</button>
                <button onClick={() => navigate("/admin/add-flw")} style={topButtonGreen}>➕ Add New FLW</button>
            </div>

            <h3 style={{ marginBottom: "15px" }}>Field Level Workers</h3>

            {loading ? (
                <p>Loading...</p>
            ) : flws.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <h3>No FLWs found.</h3>
                </div>
            ) : isMobile ? (

                /* MOBILE CARDS */
                <div>
                    {flws.map((flw) => (
                        <div key={flw._id} style={cardStyle}>

                            <p><strong>ID:</strong> {flw.userId}</p>
                            <p><strong>Name:</strong> {flw.name}</p>
                            <p><strong>District:</strong> {flw.district}</p>
                            <p><strong>Gender:</strong> {flw.gender}</p>
                            <p><strong>Trained:</strong> {flw.isTrained ? "Yes" : "No"}</p>
                            <p><strong>Breeds:</strong> {flw.totalBreedsIdentified || 0}</p>

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button onClick={() => navigate(`/admin/edit-flw/${flw._id}`)} style={editBtn}>Edit</button>

                                <button
                                    onClick={() => handleDelete(flw._id)}
                                    disabled={deletingId === flw._id}
                                    style={{
                                        ...deleteBtn,
                                        backgroundColor: deletingId === flw._id ? "#999" : "red"
                                    }}
                                >
                                    {deletingId === flw._id ? "..." : "Delete"}
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

            ) : (

                /* DESKTOP TABLE */
                <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                        <thead style={{ backgroundColor: "#e8f5e9" }}>
                            <tr>
                                <th style={thStyle}>User ID</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>District</th>
                                <th style={thStyle}>Gender</th>
                                <th style={thStyle}>Trained</th>
                                <th style={thStyle}>Breeds</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flws.map((flw, index) => (
                                <tr key={flw._id}>
                                    <td style={tdStyle}>{flw.userId}</td>
                                    <td style={tdStyle}>{flw.name}</td>
                                    <td style={tdStyle}>{flw.district}</td>
                                    <td style={tdStyle}>{flw.gender}</td>
                                    <td style={tdStyle}>{flw.isTrained ? "Yes" : "No"}</td>
                                    <td style={tdStyle}>{flw.totalBreedsIdentified || 0}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => navigate(`/admin/edit-flw/${flw._id}`)} style={editBtn}>Edit</button>{" "}
                                        <button
                                            onClick={() => handleDelete(flw._id)}
                                            disabled={deletingId === flw._id}
                                            style={{
                                                ...deleteBtn,
                                                backgroundColor: deletingId === flw._id ? "#999" : "red"
                                            }}
                                        >
                                            {deletingId === flw._id ? "..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            )}
        </div>
    );
}

/* STYLES */

const topButtonBlue = {
    padding: "12px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "7px",
    fontWeight: "600",
    cursor: "pointer"
};

const topButtonGreen = {
    ...topButtonBlue,
    backgroundColor: "#2e7d32"
};

const tableStyle = {
    width: "100%",
    minWidth: "700px",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)"
};

const thStyle = {
    padding: "12px",
    fontWeight: "600",
    borderBottom: "1px solid #c8e6c9"
};

const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee"
};

const editBtn = {
    padding: "6px 10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600"
};

const deleteBtn = {
    padding: "6px 10px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600"
};

const cardStyle = {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

export default AdminDashboard;
