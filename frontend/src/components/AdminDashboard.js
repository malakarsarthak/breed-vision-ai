import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const EMBLEM_SRC = `${process.env.PUBLIC_URL}/assests/gov-emblem.svg`;

function AdminDashboard() {
    const [flws, setFlws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const fetchFLWs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/api/users/flw');
            const data = await response.json();
            if (data.success) setFlws(data.users);
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFLWs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FLW?')) return;

        try {
            setDeletingId(id);
            const result = await authAPI.deleteFLW(id);

            if (result.success) {
                alert('FLW Deleted Successfully!');
                fetchFLWs();
            } else alert(`Delete Failed: ${result.error}`);
        } catch (err) {
            alert('Something went wrong.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="gov-page gov-admin-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <img src={EMBLEM_SRC} alt="" style={{ width: 44, height: 44 }} />
                <div>
                    <h2 className="gov-page-title" style={{ marginBottom: 0 }}>
                        Admin Dashboard
                    </h2>
                </div>
            </div>

            <div className="gov-action-grid">
                <button type="button" className="gov-btn-action gov-btn-action--navy" onClick={() => navigate('/admin/charts')}>
                    View charts
                </button>
                <button type="button" className="gov-btn-action gov-btn-action--navy" onClick={() => navigate('/admin/animals')}>
                    View all animals
                </button>
                <button type="button" className="gov-btn-action gov-btn-action--green" onClick={() => navigate('/admin/add-flw')}>
                    Add new FLW
                </button>
            </div>

            <h3 className="gov-page-title" style={{ fontSize: '1.1rem', marginBottom: 12 }}>
                Field Level Workers
            </h3>

            {loading ? (
                <p style={{ color: '#64748b', fontWeight: 600 }}>Loading…</p>
            ) : flws.length === 0 ? (
                <div className="gov-empty-panel">
                    <h3>No field level workers</h3>
                    <p>No records to display.</p>
                </div>
            ) : isMobile ? (
                <div>
                    {flws.map((flw) => (
                        <div key={flw._id} className="gov-card-mobile">
                            <p>
                                <strong>ID:</strong> {flw.userId}
                            </p>
                            <p>
                                <strong>Name:</strong> {flw.name}
                            </p>
                            <p>
                                <strong>District:</strong> {flw.district}
                            </p>
                            <p>
                                <strong>Gender:</strong> {flw.gender}
                            </p>
                            <p>
                                <strong>Trained:</strong> {flw.isTrained ? 'Yes' : 'No'}
                            </p>
                            <p>
                                <strong>Breeds:</strong> {flw.totalBreedsIdentified || 0}
                            </p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="button" className="gov-btn-edit" onClick={() => navigate(`/admin/edit-flw/${flw._id}`)}>
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="gov-btn-delete"
                                    onClick={() => handleDelete(flw._id)}
                                    disabled={deletingId === flw._id}
                                    style={{
                                        opacity: deletingId === flw._id ? 0.6 : 1,
                                    }}
                                >
                                    {deletingId === flw._id ? '...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="gov-table-wrap">
                    <table className="gov-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>District</th>
                                <th>Gender</th>
                                <th>Trained</th>
                                <th>Breeds</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flws.map((flw) => (
                                <tr key={flw._id}>
                                    <td>{flw.userId}</td>
                                    <td>{flw.name}</td>
                                    <td>{flw.district}</td>
                                    <td>{flw.gender}</td>
                                    <td>{flw.isTrained ? 'Yes' : 'No'}</td>
                                    <td>{flw.totalBreedsIdentified || 0}</td>
                                    <td>
                                        <button type="button" className="gov-btn-edit" onClick={() => navigate(`/admin/edit-flw/${flw._id}`)}>
                                            Edit
                                        </button>{' '}
                                        <button
                                            type="button"
                                            className="gov-btn-delete"
                                            onClick={() => handleDelete(flw._id)}
                                            disabled={deletingId === flw._id}
                                            style={{ opacity: deletingId === flw._id ? 0.6 : 1 }}
                                        >
                                            {deletingId === flw._id ? '...' : 'Delete'}
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

export default AdminDashboard;
