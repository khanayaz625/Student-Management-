import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, Calendar } from 'lucide-react';

const TaskGenerator = ({ onTaskCreated }) => {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [deadline, setDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/generate`, {
                topic, difficulty, deadline
            });
            onTaskCreated(data);
            setTopic('');
            setDeadline('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card task-gen-card">
            <h3>AI task Generator</h3>
            <p className="card-subtitle">Generate custom daily tasks using AI</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleGenerate}>
                <div className="form-group">
                    <label>Topic Taught Today</label>
                    <input
                        type="text" placeholder="e.g. React Hooks, JavaScript Closures"
                        value={topic} onChange={(e) => setTopic(e.target.value)} required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Difficulty Level</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Submission Deadline</label>
                        <input
                            type="datetime-local"
                            value={deadline} onChange={(e) => setDeadline(e.target.value)} required
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary gen-btn" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Generate Task</>}
                </button>
            </form>

            <style jsx>{`
        .task-gen-card { max-width: 600px; }
        .card-subtitle { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1.2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
        input, select { 
          width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; 
          background: var(--bg-main); color: var(--text-main);
        }
        .gen-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
        .error-msg { background: rgba(239, 68, 68, 0.1); color: var(--danger); padding: 10px; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
};

export default TaskGenerator;
