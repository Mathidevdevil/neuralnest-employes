const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, isAdmin, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, updateTask); // Employees can update status
router.delete('/:id', protect, isAdmin, deleteTask);

module.exports = router;
