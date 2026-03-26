import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star, Loader2 } from 'lucide-react';

const Leaderboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${apiUrl}/api/users/leaderboard`);
            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy color="#fbbf24" size={24} />;
        if (index === 1) return <Medal color="#94a3b8" size={24} />;
        if (index === 2) return <Star color="#b45309" size={24} />;
        return <span>{index + 1}</span>;
    };

    return (
        <div className="leaderboard-page">
            <header className="page-header">
                <h1>Classroom Leaderboard</h1>
                <p>Recognizing hard work and consistency.</p>
            </header>

            <div className="card leaderboard-card">
                {loading ? (
                    <div className="loader-state">
                        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
                        <p>Fetching the latest rankings...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Student Name</th>
                                    <th>Enrollment No</th>
                                    <th>Score</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, idx) => (
                                    <tr key={student._id} className={idx < 3 ? `top-rank rank-${idx}` : ''}>
                                        <td className="rank-cell">{getRankIcon(idx)}</td>
                                        <td className="name-cell">
                                            <div className="student-info">
                                                <div className="avatar">{student.name.charAt(0)}</div>
                                                <span>{student.name}</span>
                                            </div>
                                        </td>
                                        <td>{student.enrollmentNo || 'N/A'}</td>
                                        <td><span className="score-badge-alt">{student.avgScore}/10</span></td>
                                        <td><span className="rate-badge">{student.attendanceRate}%</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && <div className="empty-table">No data available yet.</div>}
                    </div>
                )}
            </div>

            <style jsx>{`
        .leaderboard-table { width: 100%; border-collapse: collapse; }
        .leaderboard-table th { text-align: left; padding: 1.2rem; border-bottom: 2px solid var(--border); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; }
        .leaderboard-table td { padding: 1.2rem; border-bottom: 1px solid var(--border); }
        
        .rank-cell { text-align: center; font-weight: 700; width: 60px; }
        .name-cell { font-weight: 600; }
        .student-info { display: flex; align-items: center; gap: 1rem; }
        .avatar { width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
        
        .rate-badge { background: var(--bg-main); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .score-badge-alt { background: rgba(99, 102, 241, 0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: var(--primary); }
        .score-cell { color: var(--primary); font-size: 1.1rem; }
        
        .top-rank { background: rgba(99, 102, 241, 0.03); }
        .rank-0 { background: rgba(251, 191, 36, 0.05); }
        
        .empty-table { padding: 3rem; text-align: center; color: var(--text-muted); }
        .loader-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; color: var(--text-muted); }
      `}</style>
        </div>
    );
};

export default Leaderboard;
