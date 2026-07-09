const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Work', 'Personal', 'Urgent'], default: 'Work' },
    completed: { type: Boolean, default: false },
    userId: { type: String, required: true, default: 'default-user' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);

