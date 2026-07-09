const express = require('express');
const router = express.Router();
const Task = require('./models/Task');

function getUserId(req) {
    return req.query.userId || req.headers['x-user-id'] || 'default-user';
}

//get all tasks
router.get('/tasks', async (req, res) => {
    const userId = getUserId(req);
    const tasks = await Task.find({ userId });
    res.json(tasks);
});

//add new task
router.post('/tasks', async (req, res) => {
    const userId = req.body.userId || getUserId(req);
    const task = new Task({ ...req.body, userId });
    await task.save();
    res.status(201).json(task);
});

//update task
router.put('/tasks/:id', async (req, res) => {
    const userId = getUserId(req);
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });
    if (!task) {
        return res.status(404).json({ error: 'Task not found for this user' });
    }
    res.json(task);
});

//delete task
router.delete('/tasks/:id', async (req, res) => {
    const userId = getUserId(req);
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId });
    if (!task) {
        return res.status(404).json({ error: 'Task not found for this user' });
    }
    res.json({ message: 'Task deleted' });
});

module.exports = router;