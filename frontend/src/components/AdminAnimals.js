import React, { useEffect, useState } from "react";

const BASE_URL =process.env.REACT_APP_API_BASE_URL ||"https://breed-vision-ai-backend.onrender.com";

function AdminAnimals() {
    const [animals, setAnimals] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Image preview modal
    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // Fetch All Animals
    const fetchAnimals = async () => {
        try {
            const res = await fetch(`${BASE_URL}/animals/all`);
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
        <div className="gov-page gov-admin-wrap">
            <h2 className="gov-page-title">Registered Animals</h2>

            <div style={{ margin: "16px 0 20px" }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by Tag ID, Owner Name, Breed, Location..."
                    className="gov-search-input"
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
                <div className="gov-table-wrap" style={{ padding: 0 }}>
                    <table
                        className="gov-table"
                        style={{ minWidth: "900px" }}
                    >
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Tag ID</th>
                                <th>FLW</th>
                                <th>Breed</th>
                                <th>Location</th>
                                <th>Registered By</th>
                                <th>Date</th>
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
                                    {/* IMAGE */}
                                    <td>
                                        <img
                                            src={
                                                animal.imageUrl
                                                    ? `${BASE_URL}${animal.imageUrl}`
                                                    : "https://via.placeholder.com/60"
                                            }
                                            alt="animal"
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                                border: "1px solid #ddd",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                setPreviewImage(animal.imageUrl);
                                                setShowPreview(true);
                                            }}
                                        />
                                    </td>

                                    <td>{animal.tagId}</td>

                                    <td>
                                        <strong>{animal.ownerName}</strong> <br />
                                        <small style={{ color: "#555" }}>
                                            {animal.ownerPhone}
                                        </small>
                                    </td>

                                    <td>{animal.breed}</td>
                                    <td>{animal.location}</td>
                                    <td>{animal.registeredBy}</td>

                                    <td>
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
                                ? `${BASE_URL}${previewImage}`
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

export default AdminAnimals;
