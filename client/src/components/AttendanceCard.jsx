import React, { useState } from 'react';
import axios from 'axios';
import { CalendarCheck, CheckCircle2, Loader2 } from 'lucide-react';

const AttendanceCard = ({ isMarked, onMarked }) => {
    const [loading, setLoading] = useState(false);

    const markAttendance = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/attendance/mark');
            onMarked();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card attendance-card">
            <div className="card-header">
                <CalendarCheck className="icon-main" />
                <div>
                    <h3>Daily Attendance</h3>
                    <p>Mark your presence for today</p>
                </div>
            </div>

            <div className="card-body">
                {isMarked ? (
                    <div className="status-marked">
                        <CheckCircle2 size={32} color="var(--success)" />
                        <span>Attendance Marked!</span>
                    </div>
                ) : (
                    <button className="btn-primary mark-btn" onClick={markAttendance} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Mark as Present'}
                    </button>
                )}
            </div>

            <style jsx>{`
        .attendance-card { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .card-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; }
        .icon-main { color: var(--primary); }
        .card-body { text-align: center; padding: 1rem 0; }
        .status-marked { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--success); font-weight: 600; }
        .mark-btn { width: 100%; padding: 12px; font-size: 1rem; }
      `}</style>
        </div>
    );
};

export default AttendanceCard;
