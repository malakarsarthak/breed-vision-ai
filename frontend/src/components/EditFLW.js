import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";


function EditFLW() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        gender: "male",
        district: "",
        isTrained: false,
    });

    const [loading, setLoading] = useState(true);

    // Fetch FLW Data
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/users/${id}`);
                const data = await res.json();

                if (data.success) {
                    setForm({
                        name: data.user.name,
                        gender: data.user.gender,
                        district: data.user.district,
                        isTrained: data.user.isTrained,
                    });
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }

        fetchData();
    }, [id]);

    // Update FLW
    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await authAPI.updateFLW(id, form);

        if (result.success) {
            alert("FLW updated successfully!");
            navigate("/admin");
        } else {
            alert(result.error);
        }
    };
    return (
        <div style={{ padding: "25px" }}>
            <h2 style={{ color: "#2e7d32"}}>Edit FLW</h2>

            {
        loading ? (
            <p>Loading...</p>
        ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
                <label>Name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />

                <label>Gender</label>
                <select
                    value={form.gender}
                    onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                    }
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                >
                    <option value="male">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label>District</label>
                <input
                    type="text"
                    value={form.district}
                    onChange={(e) =>
                        setForm({ ...form, district: e.target.value })
                    }
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={form.isTrained}
                        onChange={(e) =>
                            setForm({ ...form, isTrained: e.target.checked })
                        }
                    />
                    &nbsp; Trained
                </label>

                <br /><br />

                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#2e7d32",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Update FLW
                </button>
            </form>
        )
    }
        </div >
    );
}

export default EditFLW;
