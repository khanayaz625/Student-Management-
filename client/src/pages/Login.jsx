import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="glass login-card animate-fade">
                <div className="login-header">
                    <div className="logo-icon">DS</div>
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to access your dashboard</p>
                </div>

                {error && <div className="error-badge">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="field-icon" size={18} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="field-icon" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary login-btn" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    Don't have an account? <Link to="/register">Create one for free</Link>
                </div>
            </div>

            <style jsx>{`
                body{
                    background-color: #09090b;
                }
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    // background: #09090b;
                    position: relative;
                    overflow: hidden;
                    padding: 20px;
                }

                .login-background {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                .blob {
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    // background: #27272a;
                    filter: blur(120px);
                    border-radius: 50%;
                    opacity: 0.2;
                    animation: float 20s infinite alternate;
                }

                .blob-1 { top: -100px; right: -100px; }
                // .blob-2 { bottom: -100px; left: -100px; background: #3f3f46; }

                @keyframes float {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }

                .login-card {
                    width: 100%;
                    max-width: 440px;
                    padding: 40px;
                    position: relative;
                    z-index: 1;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .logo-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--primary);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.2rem;
                    margin: 0 auto 16px;
                    box-shadow: 0 0 20px var(--primary-glow);
                }

                .login-header h1 {
                    font-size: 1.8rem;
                    color: white;
                    margin-bottom: 8px;
                }

                .login-header p {
                    color: #94a3b8;
                    font-size: 0.95rem;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .field-group label {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #e2e8f0;
                }

                .input-wrapper {
                    position: relative;
                }

                .field-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 12px 14px 12px 42px;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius);
                    color: white;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                }

                .input-wrapper input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(15, 23, 42, 0.8);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }

                .login-btn {
                    width: 100%;
                    margin-top: 10px;
                    padding: 14px;
                }

                .error-badge {
                    background: rgba(239, 68, 68, 0.15);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #f87171;
                    padding: 12px;
                    border-radius: 10px;
                    margin-bottom: 24px;
                    font-size: 0.9rem;
                    text-align: center;
                }

                .login-footer {
                    margin-top: 32px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 0.95rem;
                }

                .login-footer a {
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }

                .login-footer a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 30px 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
