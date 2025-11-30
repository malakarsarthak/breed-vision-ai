import React, { useEffect, useState } from "react";

function AdminAnimals() {
    const [animals, setAnimals] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Image preview modal state
    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // Fetch All Animals
    const fetchAnimals = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/animals/all");
            const data = await res.json();

            if (data.success) {
                setAnimals(data.animals);
                setFiltered(data.animals);
            }
        } catch (err) {
            console.error("Error fetching animals:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    // Search Filter
    const handleSearch = (value) => {
        setSearch(value);

        const filteredData = animals.filter((item) =>
            item.ownerName.toLowerCase().includes(value.toLowerCase()) ||
            item.tagId.toLowerCase().includes(value.toLowerCase()) ||
            item.breed.toLowerCase().includes(value.toLowerCase()) ||
            item.location.toLowerCase().includes(value.toLowerCase())
        );

        setFiltered(filteredData);
    };

    return (
        <div style={{ padding: "25px" }}>
            <h2 style={{ color: "#2e7d32", fontWeight: "700" }}>Registered Animals</h2>

            {/* SEARCH BAR */}
            <div style={{ margin: "20px 0" }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by Tag ID, Owner Name, Breed, Location..."
                    style={{
                        width: "100%",
                        padding: "14px",
                        fontSize: "15px",
                        borderRadius: "10px",
                        border: "1px solid #bbb",
                        background: "#fafafa",
                        transition: "0.3s",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #2e7d32")}
                    onBlur={(e) => (e.target.style.border = "1px solid #bbb")}
                />
            </div>

            {/* LOADING */}
            {loading && <p style={{ fontStyle: "italic" }}>Loading animals...</p>}

            {/* NO DATA */}
            {!loading && filtered.length === 0 && (
                <div style={{ marginTop: "25px", textAlign: "center" }}>
                    <p style={{ fontSize: "16px", fontStyle: "italic", color: "#777" }}>
                        No animals found.
                    </p>
                </div>
            )}

            {/* DATA TABLE */}
            {!loading && filtered.length > 0 && (
                <div
                    style={{
                        overflowX: "auto",
                        background: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                        padding: "10px",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "900px",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#e8f5e9" }}>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Tag ID</th>
                                <th style={thStyle}>FLW</th>
                                <th style={thStyle}>Breed</th>
                                <th style={thStyle}>Location</th>
                                <th style={thStyle}>Registered By</th>
                                <th style={thStyle}>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((animal, i) => (
                                <tr
                                    key={animal._id}
                                    style={{
                                        background: i % 2 === 0 ? "#fcfcfc" : "white",
                                        transition: "0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background = "#f1fff1")
                                    }
                                    onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        i % 2 === 0 ? "#fcfcfc" : "white")
                                    }
                                >
                                    {/* IMAGE CLICK → PREVIEW */}
                                    <td style={tdStyle}>
                                        <img
                                            src={
                                                animal.imageUrl
                                                    ? `http://localhost:3001${animal.imageUrl}`
                                                    : "https://via.placeholder.com/60"
                                            }
                                            alt="animal"
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                                border: "1px solid #ddd"
                                            }}
                                            onClick={() => {
                                                setPreviewImage(animal.imageUrl);
                                                setShowPreview(true);
                                            }}
                                        />
                                    </td>

                                    <td style={tdStyle}>{animal.tagId}</td>

                                    <td style={tdStyle}>
                                        <strong>{animal.ownerName}</strong> <br />
                                        <small style={{ color: "#555" }}>
                                            {animal.ownerPhone}
                                        </small>
                                    </td>

                                    <td style={tdStyle}>{animal.breed}</td>
                                    <td style={tdStyle}>{animal.location}</td>
                                    <td style={tdStyle}>{animal.registeredBy}</td>
                                    <td style={tdStyle}>
                                        {new Date(animal.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* IMAGE PREVIEW MODAL */}
            {showPreview && (
                <div
                    onClick={() => setShowPreview(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        cursor: "zoom-out"
                    }}
                >
                    <img
                        src={
                            previewImage
                                ? `http://localhost:3001${previewImage}`
                                : "https://via.placeholder.com/300"
                        }
                        alt="animal-full"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            borderRadius: "12px",
                            boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                        }}
                    />
                </div>
            )}

        </div>
    );
}

const thStyle = {
    padding: "14px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "15px",
    borderBottom: "1px solid #c8e6c9",
};

const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
};

export default AdminAnimals;
