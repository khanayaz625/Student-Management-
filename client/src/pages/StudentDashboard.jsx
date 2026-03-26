import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, TrendingUp, Clock, Calendar, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [isMarked, setIsMarked] = useState(false);
    const [stats, setStats] = useState({ completion: 0, attendance: 0, rank: '-' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [taskRes, attRes, subRes, leaderRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/today`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/attendance/my`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/my`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/leaderboard`)
            ]);

            setTask(taskRes.data);

            const today = new Date().toISOString().split('T')[0];
            setIsMarked(attRes.data.some(a => a.date === today));

            const rankIdx = leaderRes.data.findIndex(s => s._id === user._id);
            setStats({
                completion: ((subRes.data.length / (leaderRes.data.length || 1)) * 100).toFixed(0),
                attendance: ((attRes.data.length / (leaderRes.data.length || 1)) * 100).toFixed(0),
                rank: rankIdx !== -1 ? rankIdx + 1 : '-'
            });
        } catch (err) {
            console.error('Error fetching dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Activity',
            data: [65, 78, 82, 75, 90, 85, 95],
            borderColor: '#6366f1',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            pointBackgroundColor: '#fff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2,
            pointRadius: 4
        }]
    };

    return (
        <div className="dashboard-wrapper animate-fade">
            <header className="page-header">
                <div>
                    <h1>Student Hub</h1>
                    <p>Welcome back, <strong>{user?.name}</strong>. Here's your progress for today.</p>
                </div>
                <div className="header-badge">
                    <div className="avatar-mini">{user?.name?.charAt(0)}</div>
                    <div className="badge-text">{user?.technology || 'Learning'}</div>
                </div>
            </header>

            {loading ? (
                <div className="loader-state main-loader">
                    <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                    <p>Building your personalized dashboard...</p>
                </div>
            ) : (
                <>
                    <div className="stats-container">
                        <div className="stat-card-premium">
                            <div className="stat-main">
                                <div className="stat-label">Completion</div>
                                <div className="stat-value">{stats.completion}%</div>
                            </div>
                            <div className="stat-icon-box purple"><CheckCircle /></div>
                            <div className="progress-bar-mini">
                                <div className="progress-fill" style={{ width: `${stats.completion}%` }}></div>
                            </div>
                        </div>

                        <div className="stat-card-premium">
                            <div className="stat-main">
                                <div className="stat-label">Attendance</div>
                                <div className="stat-value">{stats.attendance}%</div>
                            </div>
                            <div className="stat-icon-box blue"><Calendar /></div>
                            <div className="progress-bar-mini">
                                <div className="progress-fill" style={{ width: `${stats.attendance}%`, background: '#3b82f6' }}></div>
                            </div>
                        </div>

                        <div className="stat-card-premium">
                            <div className="stat-main">
                                <div className="stat-label">Current Rank</div>
                                <div className="stat-value">#{stats.rank}</div>
                            </div>
                            <div className="stat-icon-box orange"><Award /></div>
                            <div className="stat-trend positive">Top 15%</div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="left-column">
                            <div className="card highlight-card">
                                <div className="card-header">
                                    <h3>Today's Learning Objective</h3>
                                    <span className="live-tag">NEW</span>
                                </div>
                                {task ? (
                                    <div className="task-focus-content">
                                        <h4 className="task-name-large">{task.topic}</h4>
                                        <p className="task-description">
                                            Complete the subjective assessment to earn progress points.
                                            AI generation has tailored this for your skill level.
                                        </p>
                                        <div className="task-meta-list">
                                            <div className="meta-item">
                                                <Clock size={16} />
                                                <span>Due by {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="meta-item">
                                                <TrendingUp size={16} />
                                                <span>Difficultly: {task.difficulty}</span>
                                            </div>
                                        </div>
                                        <Link to="/tasks" className="btn-primary-large">
                                            Begin Learning Session <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>No active tasks for today. Check your curriculum for updates.</p>
                                    </div>
                                )}
                            </div>

                            <div className="card chart-card-premium">
                                <div className="card-header">
                                    <h3>Performance Analytics</h3>
                                    <select className="chart-select">
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                    </select>
                                </div>
                                <div className="chart-wrapper">
                                    <Line data={chartData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { display: false },
                                            x: { grid: { display: false } }
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="right-column">
                            {/* Attendance moved to Navbar */}
                            <div className="card info-card-premium">
                                <div className="card-header">
                                    <h3>Quick Stats</h3>
                                </div>
                                <div className="quick-stats-list">
                                    <div className="qs-item">
                                        <span>Current Technology</span>
                                        <strong>{user?.technology || 'MERN Stack'}</strong>
                                    </div>
                                    <div className="qs-item">
                                        <span>Learning Path</span>
                                        <strong>Web Development</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .qs-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
                .qs-item:last-child { border-bottom: none; }
                .qs-item span { color: var(--text-muted); }
                .qs-item strong { color: var(--text-main); }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .page-header h1 { font-size: 2.2rem; margin-bottom: 6px; }
                .page-header p { color: var(--text-muted); font-size: 1.05rem; }
                
                .header-badge { display: flex; align-items: center; gap: 12px; background: var(--bg-card); padding: 8px 16px; border-radius: 50px; border: 1px solid var(--border); }
                .avatar-mini { width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                .badge-text { font-size: 0.9rem; font-weight: 600; color: var(--text-main); }

                .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .stat-card-premium { background: var(--bg-card); border: 1px solid var(--border); padding: 24px; border-radius: 20px; transition: transform 0.3s; position: relative; }
                .stat-card-premium:hover { transform: translateY(-5px); }
                .stat-label { font-size: 0.9rem; font-weight: 500; color: var(--text-muted); margin-bottom: 4px; }
                .stat-value { font-size: 2rem; font-weight: 800; color: var(--text-main); }
                .stat-icon-box { position: absolute; right: 24px; top: 24px; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
                .stat-icon-box.purple { background: #8b5cf6; }
                .stat-icon-box.blue { background: #3b82f6; }
                .stat-icon-box.orange { background: #f59e0b; }
                
                .progress-bar-mini { width: 100%; height: 6px; background: var(--bg-main); border-radius: 10px; margin-top: 15px; overflow: hidden; }
                .progress-fill { height: 100%; background: #8b5cf6; border-radius: 10px; }

                .dashboard-grid { display: grid; grid-template-columns: 1fr 380px; gap: 25px; align-items: flex-start; }
                .left-column, .right-column { display: flex; flex-direction: column; gap: 25px; }

                .highlight-card { background: linear-gradient(135deg, var(--bg-card) 0%, #f5f3ff 100%); border-color: #ddd6fe; border-width: 2px; }
                [data-theme='dark'] .highlight-card { background: linear-gradient(135deg, var(--bg-card) 0%, #1e1b4b 100%); border-color: #312e81; }
                
                .live-tag { background: #ef4444; color: white; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.5px; }
                .task-name-large { font-size: 1.6rem; color: var(--text-main); margin: 15px 0 10px; }
                .task-description { color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }
                
                .task-meta-list { display: flex; gap: 20px; margin-bottom: 25px; }
                .meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }
                
                .btn-primary-large { background: var(--primary); color: white; padding: 14px 28px; border-radius: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 10px; width: fit-content; box-shadow: 0 10px 20px var(--primary-glow); }
                .btn-primary-large:hover { background: var(--primary-hover); transform: translateX(4px); }

                .chart-card-premium { height: 350px; }
                .chart-wrapper { height: 210px; margin-top: 20px; }
                .chart-select { background: var(--bg-main); border: 1px solid var(--border); padding: 4px 10px; border-radius: 8px; font-size: 0.85rem; color: var(--text-main); }

                .feedback-card-premium { padding: 0; overflow: hidden; }
                .feedback-card-premium .card-header { padding: 20px; border-bottom: 1px solid var(--border); margin: 0; }
                .feedback-content { display: flex; gap: 15px; padding: 20px; background: var(--bg-main); }
                .mentor-avatar { font-size: 1.5rem; width: 44px; height: 44px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); }
                .feedback-topic { font-weight: 700; font-size: 0.95rem; margin-bottom: 5px; color: var(--text-main); }
                .feedback-body p { font-size: 0.95rem; color: var(--text-muted); font-style: italic; line-height: 1.5; }
                .feedback-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
                .score-badge { background: var(--primary); color: white; font-weight: 800; font-size: 0.8rem; padding: 3px 10px; border-radius: 20px; }
                .time-ago { font-size: 0.8rem; color: var(--text-muted); }

                @media (max-width: 1024px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .right-column { order: -1; }
                }
                @media (max-width: 640px) {
                    .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
                    .task-meta-list { flex-direction: column; gap: 10px; }
                    .btn-primary-large { width: 100%; justify-content: center; }
                }
                .loader-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; color: var(--text-muted); text-align: center; }
                .main-loader { min-height: 400px; }
            `}</style>
        </div>
    );
};

export default StudentDashboard;
