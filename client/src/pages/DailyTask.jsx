import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Send, Loader2, AlertCircle } from 'lucide-react';

const DailyTask = () => {
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [status, setStatus] = useState('fetching'); // fetching, idle, loading, submitted, error
    const [submission, setSubmission] = useState(null);
    const [submissions, setSubmissions] = useState([]); // Store all submissions for this user
    const [isEditing, setIsEditing] = useState(false);

    // Submission fetching is now handled inside fetchTask and handleSelectTask

    const fetchTask = async () => {
        setStatus('fetching');
        try {
            const [tasksRes, subRes] = await Promise.all([
                axios.get(`${apiUrl}/api/tasks/today`),
                axios.get(`${apiUrl}/api/submissions/my`)
            ]);
            
            setSubmissions(subRes.data);
            setTasks(tasksRes.data);
            
            if (tasksRes.data.length > 0) {
                const firstTask = tasksRes.data[0];
                setSelectedTask(firstTask);
                // Check if already submitted
                const sub = subRes.data.find(s => s.taskId?._id === firstTask._id || s.taskId === firstTask._id);
                if (sub) {
                    setSubmission(sub);
                    setAnswers(sub.answers || []);
                } else {
                    setSubmission(null);
                    setAnswers(firstTask.questions.map((_, i) => ({ questionIndex: i, answer: '' })));
                }
            }
            setStatus('idle');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const handleSelectTask = (task) => {
        setSelectedTask(task);
        setIsEditing(false);
        const sub = submissions.find(s => s.taskId?._id === task._id || s.taskId === task._id);
        if (sub) {
            setSubmission(sub);
            setAnswers(sub.answers || []);
        } else {
            setSubmission(null);
            setAnswers(task.questions.map((_, i) => ({ questionIndex: i, answer: '' })));
        }
    };

    useEffect(() => {
        fetchTask();
    }, []);

    const handleAnswerChange = (index, val) => {
        const newAnswers = [...answers];
        newAnswers[index].answer = val;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (answers.some(a => !a.answer.trim())) {
            alert("Please answer all questions.");
            return;
        }
        setStatus('loading');
        try {
            const { data } = await axios.post(`${apiUrl}/api/submissions`, {
                taskId: selectedTask._id,
                answers
            });
            // Update local submissions list
            setSubmissions(prev => {
                const existingIdx = prev.findIndex(s => s.taskId?._id === selectedTask._id || s.taskId === selectedTask._id);
                if (existingIdx !== -1) {
                    const newSubs = [...prev];
                    newSubs[existingIdx] = data;
                    return newSubs;
                }
                return [...prev, data];
            });
            setSubmission(data);
            setStatus('submitted');
            setIsEditing(false);
        } catch (err) {
            setStatus('error');
            const errMsg = err.response?.data?.message || "Error submitting task";
            alert(errMsg);
        }
    };

    const calculateAccuracy = (answer) => {
        if (!answer) return 0;
        const length = answer.trim().length;
        if (length < 10) return 30;
        if (length < 30) return 60;
        if (length < 60) return 85;
        return 100;
    };

    if (status === 'fetching') return (
        <div className="loader-state main-loader">
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            <p>Scanning for today's tasks...</p>
            <style jsx>{`
                .loader-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; color: var(--text-muted); text-align: center; min-height: 400px; }
            `}</style>
        </div>
    );

    if (tasks.length === 0) return (
        <div className="loader-state main-loader">
            <AlertCircle size={48} color="var(--text-muted)" />
            <p>No tasks assigned for your group today yet.</p>
        </div>
    );

    const totalProgress = (answers && answers.length > 0) 
        ? answers.reduce((acc, curr) => acc + calculateAccuracy(curr?.answer), 0) / answers.length 
        : 0;

    return (
        <div className="task-hub">
            <div className="task-sidebar">
                <h3>Today's Learning Tasks</h3>
                <div className="task-nav-list">
                    {tasks.map(t => {
                        const isDone = submissions.some(s => s.taskId?._id === t._id || s.taskId === t._id);
                        return (
                            <button 
                                key={t._id} 
                                className={`task-nav-item ${selectedTask?._id === t._id ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                                onClick={() => handleSelectTask(t)}
                            >
                                <div className="t-nav-icon">
                                    {isDone ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                </div>
                                <div className="t-nav-info">
                                    <span className="t-nav-topic">{t.topic}</span>
                                    <span className="t-nav-meta">{t.difficulty} • {new Date(t.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="task-main-content">
                {selectedTask && (
                    <div className="task-page">
                        <div className="task-header">
                            <div className="greeting-box">
                                <h2>{user?.name}, let's tackle this!</h2>
                                <p>Progress through today's specific learning modules.</p>
                            </div>
                            <div className="topic-badge">{selectedTask.technology} Focus</div>
                            <h1>{selectedTask.topic}</h1>
                            <div className="task-meta">
                                <span>Difficulty: <strong>{selectedTask.difficulty}</strong></span>
                                <span>Due: <strong>{new Date(selectedTask.deadline).toLocaleTimeString()}</strong></span>
                            </div>

                            <div className="overall-progress card">
                                <div className="progress-label">
                                    <span>Completeness & Confidence</span>
                                    <span>{Math.round(totalProgress)}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${totalProgress}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="task-body">
                            {submission && !isEditing ? (
                                <div className="card submission-success">
                                    <CheckCircle size={48} color="var(--success)" />
                                    <h2>Well Done!</h2>
                                    <p>Your submission for "{selectedTask.topic}" is recorded.</p>

                                    {submission.status !== 'Reviewed' ? (
                                        <button
                                            className="btn-outline"
                                            style={{ marginTop: '1.5rem' }}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Modify Your Answers
                                        </button>
                                    ) : (
                                        <div className="feedback-box">
                                            <h4>Performance Review</h4>
                                            <div className="score-badge">Final Grade: {submission.score}/10</div>
                                            <p>{submission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="task-form">
                                    {selectedTask.questions.map((q, idx) => {
                                        const qAccuracy = calculateAccuracy(answers[idx]?.answer);
                                        return (
                                            <div key={idx} className="card question-card">
                                                <div className="q-header">
                                                    <span className="q-number">Task {idx + 1}</span>
                                                    <span className={`q-accuracy ${qAccuracy > 70 ? 'good' : ''}`}>
                                                        {qAccuracy}% Ready
                                                    </span>
                                                </div>
                                                <p className="q-text">{q.question}</p>
                                                <textarea
                                                    placeholder="Synthesize your understanding or provide solution..."
                                                    value={answers[idx]?.answer}
                                                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        );
                                    })}

                                    <div className="form-actions">
                                        {isEditing && (
                                            <button
                                                type="button"
                                                className="btn-outline"
                                                style={{ marginRight: '1rem' }}
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    handleSelectTask(selectedTask); // Reset to saved values
                                                }}
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                                        <button type="submit" className="btn-primary submit-btn" disabled={status === 'loading'}>
                                            {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> {isEditing ? 'Save Changes' : 'Confirm Submission'}</>}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .task-hub { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; min-height: 80vh; }
        .task-sidebar { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; height: fit-content; position: sticky; top: 1.5rem; }
        .task-sidebar h3 { font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--text-main); }
        .task-nav-list { display: flex; flex-direction: column; gap: 0.8rem; }
        .task-nav-item { 
            display: flex; align-items: center; gap: 1rem; width: 100%; padding: 12px; 
            border-radius: 12px; border: 1px solid transparent; background: var(--bg-main);
            color: var(--text-muted); transition: 0.2s; text-align: left; cursor: pointer;
        }
        .task-nav-item:hover { transform: translateY(-2px); border-color: var(--primary); color: var(--primary); }
        .task-nav-item.active { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); color: var(--primary); box-shadow: 0 4px 12px var(--primary-glow); }
        .task-nav-item.completed { border-left: 4px solid var(--success); }
        .t-nav-topic { display: block; font-size: 0.9rem; font-weight: 700; line-height: 1.2; }
        .t-nav-meta { font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px; }
        .task-nav-item.active .t-nav-meta { color: var(--primary); opacity: 0.8; }

        .task-page { width: 100%; margin: 0 auto; }
        .task-header { margin-bottom: 2rem; }
        .greeting-box { margin-bottom: 1.5rem; }
        .greeting-box h2 { font-size: 1.5rem; margin-bottom: 0.3rem; }
        .greeting-box p { color: var(--text-muted); }
        
        .overall-progress { margin-top: 1.5rem; padding: 1.2rem; }
        .progress-label { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
        .progress-bar { height: 8px; background: var(--bg-main); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--primary); transition: width 0.4s ease; border-radius: 4px; }
        
        .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .q-accuracy { font-size: 0.75rem; background: #fee2e2; color: #991b1b; padding: 2px 10px; border-radius: 20px; font-weight: 700; }
        .q-accuracy.good { background: #dcfce7; color: #166534; }
        
        .topic-badge { background: var(--primary); color: white; display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.8rem; }
        .task-meta { display: flex; gap: 2rem; margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem; }
        
        .question-card { margin-bottom: 1.5rem; }
        .q-number { font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; }
        .q-text { font-size: 1.1rem; font-weight: 600; margin: 0.5rem 0 1.2rem 0; }
        textarea { 
          width: 100%; min-height: 120px; padding: 1rem; border: 1px solid var(--border); 
          border-radius: var(--radius); background: var(--bg-main); color: var(--text-main); 
          font-family: inherit; resize: vertical; outline: none; transition: 0.2s;
        }
        textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }
        
        .form-actions { display: flex; justify-content: flex-end; margin-top: 2rem; }
        .submit-btn { padding: 14px 36px; display: flex; align-items: center; gap: 0.6rem; font-size: 1rem; border-radius: 12px; }
        
        .submission-success { text-align: center; padding: 4rem 2rem; }
        .submission-success h2 { margin-top: 1.5rem; font-size: 1.8rem; }
        .submission-success p { color: var(--text-muted); margin-top: 0.5rem; font-size: 1.1rem; }
        
        .feedback-box { margin-top: 2rem; padding: 2rem; background: rgba(16, 185, 129, 0.05); border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.2); text-align: left; }
        .score-badge { display: inline-block; background: var(--success); color: white; padding: 6px 16px; border-radius: 20px; font-weight: 800; margin: 1.2rem 0; }

        @media (max-width: 1024px) {
            .task-hub { grid-template-columns: 1fr; }
            .task-sidebar { position: static; }
        }
      `}</style>
        </div>
    );
};

export default DailyTask;
