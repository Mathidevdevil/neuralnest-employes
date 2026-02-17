const Task = require('../models/Task');

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        const task = await Task.create({
            title,
            description,
            assignedTo,
            dueDate
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const tasks = await Task.find().populate('assignedTo', 'name email');
            res.json(tasks);
        } else {
            const tasks = await Task.find({ assignedTo: req.user._id });
            res.json(tasks);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.status = req.body.status || task.status;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
