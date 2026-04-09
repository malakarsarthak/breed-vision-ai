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
        <div className="gov-page gov-admin-wrap">
            <h2 className="gov-page-title">Edit FLW</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit} className="gov-form-stack gov-panel" style={{ maxWidth: 440, marginTop: 16 }}>
                    <div className="gov-panel__head">Worker details</div>
                    <div className="gov-panel__body">
                        <label htmlFor="edit-flw-name">Name</label>
                        <input
                            id="edit-flw-name"
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <label htmlFor="edit-flw-gender">Gender</label>
                        <select
                            id="edit-flw-gender"
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        <label htmlFor="edit-flw-district">District</label>
                        <input
                            id="edit-flw-district"
                            type="text"
                            value={form.district}
                            onChange={(e) => setForm({ ...form, district: e.target.value })}
                        />

                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <input
                                type="checkbox"
                                checked={form.isTrained}
                                onChange={(e) => setForm({ ...form, isTrained: e.target.checked })}
                            />
                            Trained
                        </label>

                        <button type="submit" className="gov-btn-primary" style={{ width: 'auto', marginTop: 8 }}>
                            Update FLW
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default EditFLW;
