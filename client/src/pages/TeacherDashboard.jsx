import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskGenerator from '../components/TaskGenerator';
import { Users, ClipboardList, CheckCircle, TrendingUp, Trash2, Edit2, X, Save, ArrowRight, Loader2 } from 'lucide-react';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({ students: 0, tasks: 0, pending: 0 });
    const [recentTasks, setRecentTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({ topic: '', deadline: '' });
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', technology: '' });
    const [loading, setLoading] = useState(true);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/add-staff`, staffForm);
            alert('Staff member added successfully!');
            setShowStaffModal(false);
            setStaffForm({ name: '', email: '', password: '', technology: '' });
        } catch (err) {
            alert('Error adding staff: ' + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [studentsRes, tasksRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/students`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/all`)
            ]);

            setStats({
                students: studentsRes.data.length,
                tasks: tasksRes.data.length,
                pending: tasksRes.data.length > 0 ? 12 : 0 // Mock pending count
            });
            setRecentTasks(tasksRes.data.slice(0, 10));
        } catch (err) {
            console.error('Error fetching dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/${id}`);
            setRecentTasks(recentTasks.filter(t => t._id !== id));
        } catch (err) {
            alert('Error deleting task: ' + (err.response?.data?.message || err.message));
        }
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        const dateStr = new Date(task.deadline).toISOString().split('T')[0];
        setEditForm({ topic: task.topic, deadline: dateStr });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/${editingTask}`, editForm);
            setRecentTasks(recentTasks.map(t => t._id === editingTask ? data : t));
            setEditingTask(null);
        } catch (err) {
            alert('Error updating task: ' + (err.response?.data?.message || err.message));
            setEditingTask(null);
        }
    };

    return (
        <div className="dashboard-wrapper animate-fade">
            <header className="page-header">
                <div>
                    <h1>Teacher Overview</h1>
                    <p>Monitoring your classroom's performance and assignments</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="btn-primary" onClick={() => setShowStaffModal(true)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        + Add Staff
                    </button>
                    <span className="live-indicator">
                        <span className="dot"></span> Live Data
                    </span>
                </div>
            </header>

            {loading ? (
                <div className="loader-state main-loader">
                    <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                    <p>Fetching classroom data...</p>
                </div>
            ) : (
                <>
                    <div className="stats-container">
                        <div className="stat-card-premium">
                            <div className="stat-main">
                                <div className="stat-label">Students</div>
                                <div className="stat-value">{stats.students}</div>
                            </div>
                            <div className="stat-icon-box blue"><Users /></div>
                            <div className="stat-trend positive">+12% from last month</div>
                        </div>

                        <div className="stat-card-premium">
                            <div className="stat-main">
                                <div className="stat-label">Total Tasks</div>
                                <div className="stat-value">{stats.tasks}</div>
                            </div>
                            <div className="stat-icon-box purple"><ClipboardList /></div>
                            <div className="stat-trend positive">+5 new today</div>
                        </div>

                        <div className="stat-card-premium">
                            <div className="stat-main">
                                <div className="stat-label">Pending Reviews</div>
                                <div className="stat-value">{stats.pending}</div>
                            </div>
                            <div className="stat-icon-box orange"><CheckCircle /></div>
                            <div className="stat-trend negative">Requires attention</div>
                        </div>

                        <div className="stat-card-premium">
                            <div className="stat-main">
                                <div className="stat-label">Avg. Engagement</div>
                                <div className="stat-value">84%</div>
                            </div>
                            <div className="stat-icon-box green"><TrendingUp /></div>
                            <div className="stat-trend positive">Above average</div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <section className="generator-pane">
                            <div className="card glass-card">
                                <TaskGenerator onTaskCreated={fetchDashboardData} />
                            </div>
                        </section>

                        <section className="tasks-pane">
                            <div className="card list-card">
                                <div className="card-header">
                                    <h3>Assigned Tasks</h3>
                                    <button className="view-all-btn">View All <ArrowRight size={14} /></button>
                                </div>
                                <div className="tasks-scroll-area">
                                    {recentTasks.map(task => (
                                        <div key={task._id} className="task-row-premium">
                                            {editingTask === task._id ? (
                                                <form className="task-edit-inline" onSubmit={handleUpdate}>
                                                    <input
                                                        type="text"
                                                        value={editForm.topic}
                                                        onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                                                        autoFocus
                                                    />
                                                    <div className="edit-btns">
                                                        <button type="submit" className="save-btn"><Save size={18} /></button>
                                                        <button type="button" onClick={() => setEditingTask(null)} className="cancel-btn"><X size={18} /></button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className="task-info-main">
                                                        <span className="task-name">{task.topic}</span>
                                                        <span className="task-date-alt">{new Date(task.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="task-status-box">
                                                        <span className={`pill-badge ${task.difficulty.toLowerCase()}`}>
                                                            {task.difficulty}
                                                        </span>
                                                        <div className="hover-actions">
                                                            <button onClick={() => startEditing(task)}><Edit2 size={16} /></button>
                                                            <button onClick={() => handleDeleteTask(task._id)} className="delete"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    {recentTasks.length === 0 && (
                                        <div className="empty-state">
                                            <ClipboardList size={40} />
                                            <p>No tasks found. Try generating one!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}

            {showStaffModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card card">
                        <div className="modal-header">
                            <h3>Add Staff Member</h3>
                            <button onClick={() => setShowStaffModal(false)} className="close-btn"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddStaff} className="staff-form">
                            <input type="text" placeholder="Name" required value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} />
                            <input type="email" placeholder="Email" required value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} />
                            <input type="password" placeholder="Password" required value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} />
                            <input type="text" placeholder="Technology (Optional)" value={staffForm.technology} onChange={e => setStaffForm({ ...staffForm, technology: e.target.value })} />
                            <button type="submit" className="btn-primary">Create Staff Account</button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .dashboard-wrapper { padding: 10px 0; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
                .page-header h1 { font-size: 2rem; margin-bottom: 4px; }
                .page-header p { color: var(--text-muted); }
                
                .live-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 6px 12px; border-radius: 20px; }
                .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; animation: blink 1.5s infinite; }
                @keyframes blink { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

                .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .stat-card-premium { background: var(--bg-card); border: 1px solid var(--border); padding: 24px; border-radius: 20px; position: relative; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
                .stat-card-premium:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
                .stat-main { display: flex; flex-direction: column; gap: 4px; }
                .stat-label { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }
                .stat-value { font-size: 2rem; font-weight: 800; color: var(--text-main); }
                .stat-icon-box { position: absolute; right: 24px; top: 24px; width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; }
                .stat-icon-box.blue { background: linear-gradient(135deg, #6366f1, #4f46e5); box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2); }
                .stat-icon-box.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 8px 16px rgba(139, 92, 246, 0.2); }
                .stat-icon-box.orange { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 8px 16px rgba(245, 158, 11, 0.2); }
                .stat-icon-box.green { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2); }
                .stat-trend { margin-top: 16px; font-size: 0.8rem; font-weight: 600; }
                .stat-trend.positive { color: #10b981; }
                .stat-trend.negative { color: #ef4444; }

                .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; align-items: flex-start; }
                .glass-card { background: var(--glass-bg); backdrop-filter: blur(8px); }
                
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .view-all-btn { background: none; border: none; color: var(--primary); font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }

                .tasks-scroll-area { display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto; padding-right: 5px; }
                .task-row-premium { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-main); border-radius: 14px; border: 1px solid var(--border); transition: 0.2s; }
                .task-row-premium:hover { border-color: var(--primary); background: var(--bg-card); }
                
                .task-info-main { display: flex; flex-direction: column; gap: 2px; }
                .task-name { font-weight: 600; font-size: 1rem; color: var(--text-main); }
                .task-date-alt { font-size: 0.8rem; color: var(--text-muted); }

                .task-status-box { display: flex; align-items: center; gap: 12px; }
                .pill-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                .pill-badge.beginner { background: #dcfce7; color: #166534; }
                .pill-badge.intermediate { background: #fef9c3; color: #854d0e; }
                .pill-badge.advanced { background: #fee2e2; color: #991b1b; }

                .hover-actions { display: flex; gap: 4px; opacity: 0; transition: 0.2s; }
                .task-row-premium:hover .hover-actions { opacity: 1; }
                .hover-actions button { padding: 6px; color: var(--text-muted); background: none; }
                .hover-actions button:hover { color: var(--primary); background: var(--bg-main); border-radius: 6px; }
                .hover-actions button.delete:hover { color: var(--danger); }

                .task-edit-inline { display: flex; width: 100%; gap: 10px; }
                .task-edit-inline input { flex: 1; background: var(--bg-card); border: 1px solid var(--primary); color: var(--text-main); padding: 8px 12px; border-radius: 8px; outline: none; }
                .edit-btns { display: flex; gap: 4px; }
                .save-btn { color: #10b981; }
                .cancel-btn { color: #ef4444; }

                .empty-state { text-align: center; padding: 40px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 12px; }

                @media (max-width: 1100px) { .dashboard-grid { grid-template-columns: 1fr; } }
                @media (max-width: 640px) {
                    .task-row-premium { flex-direction: column; align-items: flex-start; gap: 15px; }
                    .task-status-box { width: 100%; justify-content: space-between; }
                    .hover-actions { opacity: 1; }
                }

                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
                .modal-content { width: 400px; padding: 25px; border-radius: 16px; background: rgba(15, 23, 42, 0.95); }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
                .close-btn:hover { color: var(--danger); }
                .staff-form { display: flex; flex-direction: column; gap: 15px; }
                .staff-form input { padding: 12px; border-radius: 8px; border: 1px solid var(--border); background: rgba(15, 23, 42, 0.6); color: white; outline: none; }
                .staff-form input:focus { border-color: var(--primary); }
                .loader-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; color: var(--text-muted); text-align: center; }
                .main-loader { min-height: 400px; }
            `}</style>
        </div>
    );
};

export default TeacherDashboard;
