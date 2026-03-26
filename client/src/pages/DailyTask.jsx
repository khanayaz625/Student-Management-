import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Send, Loader2, AlertCircle } from 'lucide-react';

const DailyTask = () => {
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [task, setTask] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, loading, submitted, error
    const [submission, setSubmission] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTask();
    }, []);

    useEffect(() => {
        if (task) {
            fetchMySubmission();
        }
    }, [task]);

    const fetchTask = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/tasks/today`);
            setTask(data);
            if (data) {
                setAnswers(data.questions.map((_, i) => ({ questionIndex: i, answer: '' })));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMySubmission = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/submissions/my`);
            const sub = data.find(s => s.taskId?._id === task._id);
            if (sub) {
                setSubmission(sub);
                if (sub.answers && sub.answers.length > 0) {
                    setAnswers(sub.answers);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                taskId: task._id,
                answers
            });
            setSubmission(data);
            setStatus('submitted');
            setIsEditing(false);
        } catch (err) {
            setStatus('error');
            const errMsg = err.response?.data?.message || "Error submitting task";
            alert(errMsg);
            if (errMsg.includes('already submitted')) {
                fetchMySubmission();
            }
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

    if (!task) return <div className="loading-state"><p>No task assigned for today yet.</p></div>;

    const totalProgress = answers.reduce((acc, curr) => acc + calculateAccuracy(curr.answer), 0) / (answers.length || 1);

    return (
        <div className="task-page">
            <div className="task-header">
                <div className="greeting-box">
                    <h2>Hello, {user?.name}! 👋</h2>
                    <p>You have new minimal tasks to complete today.</p>
                </div>
                <div className="topic-badge">Current Topic</div>
                <h1>{task.topic}</h1>
                <div className="task-meta">
                    <span>Difficulty: <strong>{task.difficulty}</strong></span>
                    <span>Due: <strong>{new Date(task.deadline).toLocaleTimeString()}</strong></span>
                </div>

                <div className="overall-progress card">
                    <div className="progress-label">
                        <span>Overall Progress & Completeness</span>
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
                        <h2>Task Submitted Successfully!</h2>
                        <p>Your answers have been sent to the teacher for review.</p>

                        {submission.status !== 'Reviewed' ? (
                            <button
                                className="btn-outline"
                                style={{ marginTop: '1.5rem' }}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Your Answers
                            </button>
                        ) : (
                            <div className="feedback-box">
                                <h4>Teacher Feedback</h4>
                                <div className="score-badge">Score: {submission.score}/10</div>
                                <p>{submission.feedback}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="task-form">
                        {task.questions.map((q, idx) => {
                            const qAccuracy = calculateAccuracy(answers[idx]?.answer);
                            return (
                                <div key={idx} className="card question-card">
                                    <div className="q-header">
                                        <span className="q-number">Question {idx + 1}</span>
                                        <span className={`q-accuracy ${qAccuracy > 70 ? 'good' : ''}`}>
                                            {qAccuracy}% Completeness
                                        </span>
                                    </div>
                                    <p className="q-text">{q.question}</p>
                                    <textarea
                                        placeholder="Type your answer or code here..."
                                        value={answers[idx]?.answer}
                                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                        required
                                    />
                                    <div className="q-footer">
                                        <small>{answers[idx]?.answer?.length || 0} characters typed</small>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="form-actions">
                            {isEditing && (
                                <button
                                    type="button"
                                    className="btn-outline"
                                    style={{ marginRight: '1rem' }}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel Edit
                                </button>
                            )}
                            <button type="submit" className="btn-primary submit-btn" disabled={status === 'loading'}>
                                {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> {isEditing ? 'Update Answers' : 'Submit Answers'}</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <style jsx>{`
        .task-page { width: 100%; margin: 0 auto; padding-bottom: 4rem; }
        .task-header { margin-bottom: 2rem; }
        .greeting-box { margin-bottom: 2rem; }
        .greeting-box h2 { font-size: 1.5rem; margin-bottom: 0.3rem; }
        .greeting-box p { color: var(--text-muted); }
        
        .overall-progress { margin-top: 1.5rem; padding: 1.2rem; }
        .progress-label { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
        .progress-bar { height: 8px; background: var(--bg-main); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--primary); transition: width 0.4s ease; border-radius: 4px; }
        
        .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .q-accuracy { font-size: 0.75rem; background: #fee2e2; color: #991b1b; padding: 2px 10px; border-radius: 20px; font-weight: 700; }
        .q-accuracy.good { background: #dcfce7; color: #166534; }
        .q-footer { margin-top: 0.8rem; display: flex; justify-content: flex-end; color: var(--text-muted); }
        
        .topic-badge { background: var(--primary); color: white; display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 1rem; }
        .task-meta { display: flex; gap: 2rem; margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem; }
        
        .question-card { margin-bottom: 1.5rem; }
        .q-number { font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; }
        .q-text { font-size: 1.1rem; font-weight: 600; margin: 0.5rem 0 1.5rem 0; }
        textarea { 
          width: 100%; min-height: 120px; padding: 1rem; border: 1px solid var(--border); 
          border-radius: var(--radius); background: var(--bg-main); color: var(--text-main); 
          font-family: inherit; resize: vertical; outline: none;
        }
        textarea:focus { border-color: var(--primary); }
        
        .form-actions { display: flex; justify-content: flex-end; }
        .submit-btn { padding: 12px 32px; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; }
        
        .submission-success { text-align: center; padding: 3rem; }
        .submission-success h2 { margin-top: 1.5rem; }
        .submission-success p { color: var(--text-muted); margin-top: 0.5rem; }
        
        .feedback-box { margin-top: 2rem; padding: 1.5rem; background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; text-align: left; }
        .score-badge { display: inline-block; background: var(--success); color: white; padding: 4px 12px; border-radius: 20px; font-weight: 700; margin: 1rem 0; }
      `}</style>
        </div>
    );
};

export default DailyTask;
