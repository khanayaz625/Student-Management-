import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Clock, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';

const AttendanceAdmin = () => {
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, [selectedDate]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const [studentsRes, attendanceRes] = await Promise.all([
                axios.get(`${apiUrl}/api/users/students`),
                axios.get(`${apiUrl}/api/attendance/by-date/${selectedDate}`)
            ]);
            setStudents(studentsRes.data);
            setAttendanceData(attendanceRes.data);
        } catch (err) {
            console.error('Error fetching attendance data', err);
        } finally {
            setLoading(false);
        }
    };

    const getAttendanceStatus = (studentId) => {
        const record = attendanceData.find(a => a.studentId._id === studentId || a.studentId === studentId);
        return record ? { status: record.status, time: record.markedAt } : { status: 'Absent', time: null };
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.enrollmentNo && s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="attendance-admin">
            <header className="page-header">
                <div>
                    <h1>Attendance Management</h1>
                    <p>Track student presence and check-in times.</p>
                </div>
                <div className="date-picker-wrapper card">
                    <Calendar size={18} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </header>

            <div className="content-filters card">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search student by name or enrollment no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="stats-summary">
                    <div className="stat-item">
                        <span className="label">Total Students</span>
                        <span className="value">{students.length}</span>
                    </div>
                    <div className="stat-item present">
                        <span className="label">Present</span>
                        <span className="value">{attendanceData.length}</span>
                    </div>
                </div>
            </div>

            <div className="attendance-grid">
                {loading ? (
                    <div className="loader-state main-loader">
                        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                        <p>Loading attendance records...</p>
                    </div>
                ) : (
                    filteredStudents.map(student => {
                        const { status, time } = getAttendanceStatus(student._id);
                        return (
                            <div key={student._id} className={`student-card card ${status.toLowerCase()}`}>
                                <div className="student-info">
                                    <div className="avatar">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3>{student.name}</h3>
                                        <p className="roll">{student.enrollmentNo || student.rollNumber || 'No Enrollment #'}</p>
                                    </div>
                                </div>
                                <div className="status-badge-container">
                                    <div className={`status-badge ${status.toLowerCase()}`}>
                                        {status === 'Present' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        {status}
                                    </div>
                                    {time && (
                                        <div className="time-info">
                                            <Clock size={14} />
                                            {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <style jsx>{`
                .attendance-admin { width: 100%; margin: 0 auto; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
                
                .date-picker-wrapper { display: flex; align-items: center; gap: 0.8rem; padding: 10px 20px; }
                .date-picker-wrapper input { border: none; background: none; font-family: inherit; font-size: 1rem; color: var(--text-main); font-weight: 600; outline: none; }
                
                .content-filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1rem 2rem; }
                .search-bar { display: flex; align-items: center; gap: 1rem; flex: 1; max-width: 400px; background: var(--bg-main); padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); }
                .search-bar input { background: none; border: none; outline: none; width: 100%; color: var(--text-main); }
                
                .stats-summary { display: flex; gap: 2rem; }
                .stat-item { display: flex; flex-direction: column; align-items: center; }
                .stat-item .label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
                .stat-item .value { font-size: 1.5rem; font-weight: 700; color: var(--text-main); }
                .stat-item.present .value { color: var(--success); }

                .attendance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
                .student-card { display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s; }
                .student-card:hover { transform: translateY(-3px); }
                .student-card.absent { border-left: 4px solid var(--danger); opacity: 0.8; }
                .student-card.present { border-left: 4px solid var(--success); }
                
                .student-info { display: flex; align-items: center; gap: 1rem; }
                .avatar { width: 48px; height: 48px; background: var(--bg-main); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .student-info h3 { font-size: 1rem; margin-bottom: 2px; }
                .roll { font-size: 0.8rem; color: var(--text-muted); }

                .status-badge-container { text-align: right; }
                .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; }
                .status-badge.present { background: #dcfce7; color: #166534; }
                .status-badge.absent { background: #fee2e2; color: #991b1b; }
                .time-info { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; justify-content: flex-end; gap: 4px; }

                @media (max-width: 640px) {
                    .content-filters { flex-direction: column; gap: 1rem; align-items: stretch; }
                    .search-bar { max-width: none; }
                    .stats-summary { justify-content: space-around; }
                    .page-header { flex-direction: column; align-items: flex-start; }
                    .date-picker-wrapper { width: 100%; }
                }
                .loader-state { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; color: var(--text-muted); text-align: center; }
                .main-loader { min-height: 400px; }
            `}</style>
        </div>
    );
};

export default AttendanceAdmin;
