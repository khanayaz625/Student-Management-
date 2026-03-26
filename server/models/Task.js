const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    questions: [{
        question: { type: String, required: true },
        type: { type: String, default: 'subjective' }
    }],
    date: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
    technology: { type: String, default: 'All' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
