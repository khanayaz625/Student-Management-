const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{
        questionIndex: { type: Number, required: true },
        answer: { type: String, required: true }
    }],
    status: { type: String, enum: ['Pending', 'Submitted', 'Reviewed'], default: 'Submitted' },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
