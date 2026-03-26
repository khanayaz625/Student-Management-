import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, Loader2, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student', enrollmentNo: '', technology: '', otherTech: ''
    });
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const submissionData = { ...formData };
        if (submissionData.technology === 'Other') {
            submissionData.technology = submissionData.otherTech;
        }
        delete submissionData.otherTech;

        try {
            await register(submissionData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <div className="register-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="glass register-card animate-fade">
                <div className="register-header">
                    <div className="logo-icon">DS</div>
                    <h1>Create Account</h1>
                    <p>Join DigiSkill to start your learning journey</p>
                </div>

                {error && <div className="error-badge">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="row">
                        <div className="field-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User className="field-icon" size={18} />
                                <input
                                    name="name" type="text" placeholder="John Doe"
                                    value={formData.name} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        <div className="field-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="field-icon" size={18} />
                                <input
                                    name="email" type="email" placeholder="john@example.com"
                                    value={formData.email} onChange={handleChange} required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="field-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="field-icon" size={18} />
                            <input
                                name="password" type="password" placeholder="••••••••"
                                value={formData.password} onChange={handleChange} required
                            />
                        </div>
                    </div>

                    <div className="student-fields animate-fade">
                            <div className="row">
                                <div className="field-group">
                                    <label>Enrollment No.</label>
                                    <div className="input-wrapper">
                                        <GraduationCap className="field-icon" size={18} />
                                        <input
                                            name="enrollmentNo" type="text" placeholder="ENR12345"
                                            value={formData.enrollmentNo} onChange={handleChange} required
                                        />
                                    </div>
                                </div>
                                <div className="field-group">
                                    <label>Technology</label>
                                    <div className="input-wrapper">
                                        <GraduationCap className="field-icon" size={18} />
                                        <select
                                            name="technology"
                                            value={formData.technology}
                                            onChange={handleChange}
                                            required
                                            className="tech-select"
                                        >
                                            <option value="">Select Tech</option>
                                            <option value="Python">Python</option>
                                            <option value="MERN">MERN</option>
                                            <option value="PHP">PHP</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {formData.technology === 'Other' && (
                                <div className="field-group" style={{ marginTop: '15px' }}>
                                    <label>Specify Technology</label>
                                    <div className="input-wrapper">
                                        <GraduationCap className="field-icon" size={18} />
                                        <input
                                            name="otherTech" type="text" placeholder="Django, React, etc."
                                            value={formData.otherTech} onChange={handleChange} required
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                    <button type="submit" className="btn-primary register-btn" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Create Account <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="register-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>

            <style jsx>{`
            body {
                background-color: #09090b;
            }
                .register-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    // background: #09090b;
                    position: relative;
                    overflow: hidden;
                    padding: 40px 20px;
                }

                .register-background {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                .blob {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    // background: #27272a;
                    filter: blur(140px);
                    border-radius: 50%;
                    opacity: 0.15;
                    animation: float 25s infinite alternate;
                }

                .blob-1 { top: -200px; left: -100px; }
                // .blob-2 { bottom: -200px; right: -100px; background: #3f3f46; }

                @keyframes float {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 40px); }
                }

                .register-card {
                    width: 100%;
                    max-width: 540px;
                    padding: 40px;
                    position: relative;
                    z-index: 1;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    background: rgba(15, 23, 42, 0.8) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }

                .register-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .logo-icon {
                    width: 44px;
                    height: 44px;
                    background: var(--primary);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.1rem;
                    margin: 0 auto 16px;
                    box-shadow: 0 0 20px var(--primary-glow);
                }

                .register-header h1 {
                    font-size: 1.8rem;
                    color: white;
                    margin-bottom: 8px;
                }

                .register-header p {
                    color: #94a3b8;
                    font-size: 0.95rem;
                }

                .register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .field-group label {
                    font-size: 0.8rem;
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

                .input-wrapper input, .tech-select {
                    width: 100%;
                    padding: 11px 14px 11px 40px;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius);
                    color: white;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    appearance: none;
                }

                .input-wrapper input:focus, .tech-select:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(15, 23, 42, 0.8);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }

                .role-selector {
                    display: flex;
                    gap: 12px;
                    margin: 4px 0;
                }

                .role-selector label {
                    flex: 1;
                    padding: 10px;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius);
                    color: #94a3b8;
                    text-align: center;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }

                .role-selector label.active {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    box-shadow: 0 4px 12px var(--primary-glow);
                }

                .role-selector input {
                    display: none;
                }

                .register-btn {
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

                .register-footer {
                    margin-top: 32px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 0.95rem;
                }

                .register-footer a {
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }

                .register-footer a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 600px) {
                    .row { grid-template-columns: 1fr; }
                    .register-card { padding: 30px 20px; }
                }
            `}</style>
        </div>
    );
};

export default Register;
