import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const EMBLEM_SRC = `${process.env.PUBLIC_URL}/assests/gov-emblem.svg`;

function Authentication({ onLogin }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);

        const result = await authAPI.login({ userId, password });

        setLoading(false);

        if (!result.success) {
            alert(result.error || 'Login failed');
            return;
        }

        onLogin(result.user);
    };

    return (
        <div className="gov-auth-shell">
            <div className="gov-auth-shell__glow" aria-hidden />
            <div className="gov-auth-shell__grid" aria-hidden />

            <div className="gov-auth-form-wrap gov-auth-form-wrap--center">
                <div className="gov-auth-card-premium">
                    <div className="gov-auth-card-premium__accent" />
                    <div className="gov-auth-brand gov-auth-brand--premium">
                        <div className="gov-auth-emblem-ring">
                            <img src={EMBLEM_SRC} alt="" />
                        </div>
                        <h2>Bharat Pashudhan</h2>
                        <p className="gov-auth-tagline">Breed Recognition System</p>
                        <div className="gov-auth-pill">Secure sign in</div>
                    </div>

                    <div className="gov-input-group">
                        <label htmlFor="auth-userid">User ID</label>
                        <div className="gov-input-box gov-input-box--premium">
                            <span className="material-icons">person</span>
                            <input
                                id="auth-userid"
                                type="text"
                                autoComplete="username"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="gov-input-group">
                        <label htmlFor="auth-password">Password</label>
                        <div className="gov-input-box gov-input-box--premium">
                            <span className="material-icons">lock</span>
                            <input
                                id="auth-password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="material-icons eye-icon"
                                role="button"
                                tabIndex={0}
                                onClick={() => setShowPassword(!showPassword)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                    }
                                }}
                            >
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="gov-btn-primary gov-btn-primary--premium"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>

                    <div className="gov-auth-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="gov-link-register gov-link-register--premium"
                        onClick={() => navigate('/flw-register')}
                    >
                        Field Level Worker registration
                    </button>

                    <p className="gov-auth-footnote">Authorised personnel only</p>
                </div>
            </div>
        </div>
    );
}

export default Authentication;
