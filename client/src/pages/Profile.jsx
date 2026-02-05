import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Award, Save, Loader2 } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        enrollmentNo: user?.enrollmentNo || user?.rollNumber || '',
        technology: user?.technology || user?.class || '',
        skills: user?.skills?.join(', ') || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                enrollmentNo: user.enrollmentNo || user.rollNumber || '',
                technology: user.technology || user.class || '',
                skills: user.skills?.join(', ') || ''
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
            const { data } = await axios.put('http://localhost:5000/api/users/profile', {
                ...formData,
                skills: skillsArray
            });
            setUser({ ...user, ...data });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <header className="page-header">
                <h1>My Profile</h1>
                <p>Manage your account settings and academic details.</p>
            </header>

            <div className="profile-grid">
                <div className="card profile-info-card">
                    <div className="profile-header">
                        <div className="large-avatar">{user?.name.charAt(0)}</div>
                        <div className="header-text">
                            <h2>{user?.name}</h2>
                            <span className="role-tag">{user?.role}</span>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="form-group">
                            <label><User size={16} /> Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><Mail size={16} /> Email Address</label>
                            <input type="email" value={user?.email} disabled />
                            <small>Email cannot be changed.</small>
                        </div>

                        {user?.role === 'student' && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label><GraduationCap size={16} /> Enrollment No.</label>
                                        <input
                                            type="text"
                                            value={formData.enrollmentNo}
                                            onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><GraduationCap size={16} /> Technology</label>
                                        <input
                                            type="text"
                                            value={formData.technology}
                                            onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label><Award size={16} /> Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. JavaScript, React, Python"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-primary save-btn" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </button>
                        {message && <div className={`msg ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}
                    </form>
                </div>

                <div className="right-col">
                    <div className="card achievement-card">
                        <h3>Stats Overview</h3>
                        <div className="mini-stats">
                            <div className="ms-item">
                                <span className="ms-label">Total Lessons</span>
                                <span className="ms-value">42</span>
                            </div>
                            <div className="ms-item">
                                <span className="ms-label">Achievements</span>
                                <span className="ms-value">15</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .profile-page { width: 100%; margin: 0 auto; }
        .profile-grid { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
        .profile-header { display: flex; align-items: center; gap: 1.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
        .large-avatar { width: 80px; height: 80px; background: var(--primary); color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; }
        .role-tag { background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-top: 0.5rem; display: inline-block; }
        
        .profile-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .form-group label { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        input { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-main); color: var(--text-main); font-size: 1rem; }
        input:disabled { opacity: 0.7; cursor: not-allowed; }
        .save-btn { width: fit-content; margin-top: 1rem; padding: 12px 32px; display: flex; align-items: center; gap: 0.5rem; }
        
        .msg { margin-top: 1rem; font-size: 0.9rem; padding: 10px; border-radius: 8px; }
        .msg.success { background: #dcfce7; color: #166534; }
        .msg.error { background: #fee2e2; color: #991b1b; }
        
        .mini-stats { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .ms-item { display: flex; justify-content: space-between; align-items: center; }
        .ms-label { font-size: 0.9rem; color: var(--text-muted); }
        .ms-value { font-weight: 700; color: var(--primary); }
      `}</style>
        </div>
    );
};

export default Profile;
