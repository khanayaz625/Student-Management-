import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Edit3, Check, X, Trash2, UserPlus, Sparkles, ClipboardList } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [studentSubmissions, setStudentSubmissions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', enrollmentNo: '', technology: '', password: 'student123' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/students`);
            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this student? All their data will be lost.')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}`);
            fetchStudents();
        } catch (err) {
            alert('Error deleting student');
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, { ...newStudent, role: 'student' });
            setShowAddModal(false);
            setNewStudent({ name: '', email: '', enrollmentNo: '', technology: '', password: 'student123' });
            fetchStudents();
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding student');
        }
    };

    const viewSubmissions = async (student) => {
        setSelectedStudent(student);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/student/${student._id}`);
            setStudentSubmissions(data);
            setShowSubmissionModal(true);
        } catch (err) {
            alert('Error fetching student submissions');
            console.error(err);
        }
    };

    const handleAIReview = async (submissionId) => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/ai-review/${submissionId}`);
            setStudentSubmissions(studentSubmissions.map(s => s._id === submissionId ? data : s));
            alert('AI Review completed!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error performing AI review');
        } finally {
            setLoading(false);
        }
    };

    const submitManualReview = async (submissionId) => {
        const score = document.getElementById(`score-${submissionId}`).value;
        const feedback = document.getElementById(`feedback-${submissionId}`).value;
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/review/${submissionId}`, {
                score, feedback
            });
            setStudentSubmissions(studentSubmissions.map(s => s._id === submissionId ? data : s));
            alert('Review saved successfully!');
        } catch (err) {
            alert('Error saving review');
        }
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="students-page">
            <header className="page-header">
                <div>
                    <h1>Student Records</h1>
                    <p>Monitor student enrollment and individual performance.</p>
                </div>
                <button className="btn-primary add-student-btn" onClick={() => setShowAddModal(true)}>
                    <UserPlus size={20} /> Add Student
                </button>
            </header>

            <div className="table-actions">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or enrollment no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card students-card">
                <div className="table-responsive">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Enrollment No</th>
                                <th>Technology</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student._id}>
                                    <td>
                                        <div className="student-profile">
                                            <div className="mini-avatar">{student.name.charAt(0)}</div>
                                            <div className="name-box">
                                                <span className="s-name">{student.name}</span>
                                                <span className="s-email">{student.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{student.enrollmentNo || 'N/A'}</td>
                                    <td>{student.technology || 'N/A'}</td>
                                    <td>
                                        <div className="action-row">
                                            <button className="icon-btn view-btn" onClick={() => viewSubmissions(student)} title="View Submissions">
                                                <Eye size={18} />
                                            </button>
                                            <button className="icon-btn delete-btn" onClick={() => handleDelete(student._id)} title="Remove Student">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showSubmissionModal && (
                <div className="modal-overlay">
                    <div className="modal-content card submission-modal">
                        <div className="modal-header">
                            <div>
                                <h2>{selectedStudent.name}'s Submissions</h2>
                                <p className="modal-subtitle">Review and score daily tasks</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowSubmissionModal(false)}><X /></button>
                        </div>
                        <div className="modal-body">
                            {studentSubmissions.length === 0 ? (
                                <div className="empty-submissions">
                                    <ClipboardList size={40} />
                                    <p>No submissions found for this student.</p>
                                </div>
                            ) : (
                                <div className="sub-list-expanded">
                                    {studentSubmissions.map(sub => (
                                        <div key={sub._id} className="sub-card-premium">
                                            <div className="sub-card-header">
                                                <div className="sub-task-info">
                                                    <h3>{sub.taskId?.topic || 'Deleted Task'}</h3>
                                                    <span className={`status-badge ${sub.status.toLowerCase()}`}>{sub.status}</span>
                                                </div>
                                                <div className="sub-actions-top">
                                                    <button
                                                        className="ai-review-btn"
                                                        onClick={() => handleAIReview(sub._id)}
                                                        disabled={loading}
                                                    >
                                                        <Sparkles size={16} /> Check with AI
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="answers-section">
                                                {sub.taskId?.questions.map((q, qIdx) => (
                                                    <div key={qIdx} className="answer-item">
                                                        <p className="q-text-mini">Q: {q.question}</p>
                                                        <div className="ans-text-box">
                                                            {sub.answers.find(a => a.questionIndex === qIdx)?.answer || 'Not answered'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="review-interface">
                                                <div className="review-inputs">
                                                    <div className="score-input">
                                                        <label>Score (0-10)</label>
                                                        <input
                                                            type="number" min="0" max="10"
                                                            key={`score-${sub._id}-${sub.score}`}
                                                            defaultValue={sub.score}
                                                            id={`score-${sub._id}`}
                                                        />
                                                    </div>
                                                    <div className="feedback-input">
                                                        <label>Feedback</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Add feedback..."
                                                            key={`feedback-${sub._id}-${sub.feedback}`}
                                                            defaultValue={sub.feedback}
                                                            id={`feedback-${sub._id}`}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn-primary-sm"
                                                    onClick={() => submitManualReview(sub._id)}
                                                >
                                                    Save Review
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content card add-modal">
                        <div className="modal-header">
                            <h2>Add New Student</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleAddStudent} className="add-student-form">
                            <input
                                type="text" placeholder="Full Name" required
                                value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            />
                            <input
                                type="email" placeholder="Email Address" required
                                value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                            />
                            <input
                                type="text" placeholder="Enrollment No" required
                                value={newStudent.enrollmentNo} onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })}
                            />
                            <select
                                value={newStudent.technology}
                                onChange={(e) => setNewStudent({ ...newStudent, technology: e.target.value })}
                                required
                            >
                                <option value="">Select Technology</option>
                                <option value="Python">Python</option>
                                <option value="MERN">MERN</option>
                                <option value="PHP">PHP</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="password" placeholder="Default Password" required
                                value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                            />
                            <button type="submit" className="btn-primary">Create Student Account</button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .table-actions { margin-bottom: 2rem; }
        .search-bar { display: flex; align-items: center; gap: 0.8rem; background: var(--bg-card); padding: 0.8rem 1.2rem; border-radius: var(--radius); border: 1px solid var(--border); max-width: 400px; }
        .search-bar input { border: none; background: none; outline: none; width: 100%; color: var(--text-main); }
        
        .students-table { width: 100%; border-collapse: collapse; }
        .students-table th { text-align: left; padding: 1rem; border-bottom: 2px solid var(--border); color: var(--text-muted); font-size: 0.85rem; }
        .students-table td { padding: 1.2rem 1rem; border-bottom: 1px solid var(--border); }
        
        .student-profile { display: flex; align-items: center; gap: 1rem; }
        .mini-avatar { width: 36px; height: 36px; background: #e0e7ff; color: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .name-box { display: flex; flex-direction: column; }
        .s-name { font-weight: 600; font-size: 0.95rem; }
        .s-email { font-size: 0.8rem; color: var(--text-muted); }
        
        .view-btn { color: var(--primary); }
        .delete-btn { color: var(--danger); }
        .action-row { display: flex; gap: 0.5rem; }
        
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .add-student-btn { display: flex; align-items: center; gap: 0.5rem; padding: 10px 20px; }

        .add-modal { width: 450px; }
        .add-student-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        .add-student-form input, .add-student-form select { 
            padding: 12px; border: 1px solid var(--border); border-radius: 8px; 
            background: var(--bg-main); color: var(--text-main); outline: none;
        }

        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { max-height: 90vh; overflow-y: auto; position: relative; border: 1px solid var(--border); box-shadow: var(--shadow-xl); }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .modal-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }
        .close-btn { background: none; color: var(--text-muted); padding: 4px; transition: 0.2s; }
        .close-btn:hover { color: var(--danger); background: rgba(239, 68, 68, 0.1); border-radius: 6px; }

        /* Submission Modal Specifics */
        .submission-modal { width: 800px; max-width: 95vw; padding: 2rem; }
        
        .empty-submissions { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 3rem; color: var(--text-muted); }
        
        .sub-list-expanded { display: flex; flex-direction: column; gap: 1.5rem; }
        .sub-card-premium { background: var(--bg-main); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
        
        .sub-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
        .sub-task-info h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
        .status-badge { font-size: 0.75rem; padding: 4px 10px; border-radius: 12px; font-weight: 600; text-transform: uppercase; }
        .status-badge.submitted { background: #fef9c3; color: #854d0e; }
        .status-badge.reviewed { background: #dcfce7; color: #166534; }
        .status-badge.pending { background: #fee2e2; color: #991b1b; }

        .ai-review-btn { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
        .ai-review-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3); }
        .ai-review-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .answers-section { background: var(--bg-card); padding: 1rem; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 1.5rem; max-height: 200px; overflow-y: auto; }
        .answer-item { margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px dashed var(--border); }
        .answer-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .q-text-mini { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
        .ans-text-box { font-size: 0.95rem; color: var(--text-main); white-space: pre-wrap; font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; }

        .review-interface { background: var(--bg-card); padding: 1rem; border-radius: 8px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 1rem; }
        .review-inputs { display: grid; grid-template-columns: 100px 1fr; gap: 1rem; }
        .score-input, .feedback-input { display: flex; flex-direction: column; gap: 6px; }
        .review-inputs label { font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }
        .review-inputs input { width: 100%; padding: 8px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 6px; color: var(--text-main); outline: none; }
        .review-inputs input:focus { border-color: var(--primary); }
        
        .btn-primary-sm { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; width: fit-content; align-self: flex-end; cursor: pointer; }

        @media (max-width: 768px) {
          .search-bar { max-width: 100%; }
          .students-table th:nth-child(2), .students-table td:nth-child(2),
          .students-table th:nth-child(3), .students-table td:nth-child(3) {
            display: none;
          }
          .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .review-inputs { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .modal-content { width: 95%; margin: 1rem; padding: 1rem; }
          .submission-modal { padding: 1rem; }
        }
      `}</style>
        </div>
    );
};

export default Students;
