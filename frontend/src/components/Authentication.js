import React, { useState } from "react";
import "../styles/index.css";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Authentication({ onLogin }) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);

        const result = await authAPI.login({ userId, password });

        setLoading(false);

        if (!result.success) {
            alert(result.error || "Login failed");
            return;
        }

        Swal.fire({
        title: "Login Successful!",
        text: "Welcome back!",
        icon: "success",
        confirmButtonText: "Continue",
    }).then(() => {
        onLogin(result.user); // Redirect to Dashboard
    });
};

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <span className="material-icons cow-icon">pets</span>
                    <h2>Bharat Pashudhan</h2>
                    <p>Breed Recognition System</p>
                    <p className="subtext">Login</p>
                </div>

                <div className="input-group">
                    <label>User ID *</label>
                    <div className="input-box">
                        <span className="material-icons">person</span>
                        <input
                            type="text"
                            placeholder="Enter User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Password *</label>
                    <div className="input-box">
                        <span className="material-icons">lock</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="material-icons eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </div>
                </div>

                <button className="login-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "LOGIN"}
                </button>

                {/* ⭐ New Register Button */}
                <button
                    className="register-btn"
                    onClick={() => navigate("/flw-register")}
                    style={{
                        marginTop: "15px",
                        background: "transparent",
                        border: "none",
                        color: "green",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "15px"
                    }}
                >
                    Register as Field Level Worker
                </button>

            </div>
        </div>
    );
}

export default Authentication;
