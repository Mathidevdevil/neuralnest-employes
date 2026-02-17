import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
        if (user.role === 'admin') fetchUsers();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsModalOpen(false);
            fetchTasks();
            setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neural-text">Tasks</h2>
                {user.role === 'admin' && (
                    <button onClick={() => setIsModalOpen(true)} className="neuro-btn flex items-center space-x-2">
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <div key={task._id} className="glass-panel p-6 relative group bg-white dark:bg-gray-800 transition-colors">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-neural-text">{task.title}</h3>
                            <button
                                onClick={() => handleStatusUpdate(task._id, task.status)}
                                className={`text-neural-accent hover:text-neural-text transition-colors`}
                            >
                                {task.status === 'completed' ? <CheckCircle size={20} /> : <Circle size={20} />}
                            </button>
                        </div>
                        <p className="text-neural-secondary mt-2 text-sm">{task.description}</p>
                        <div className="mt-4 flex justify-between items-center text-xs text-neural-secondary">
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full border ${task.status === 'completed'
                                ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                                }`}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </span>
                        </div>
                        {user.role === 'admin' && (
                            <button onClick={() => handleDelete(task._id)} className="absolute top-4 right-12 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-panel p-8 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-neural-text">Create New Task</h3>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <input
                                type="text" placeholder="Title" required
                                value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <textarea
                                placeholder="Description"
                                value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[100px]"
                            />
                            {/* Improved User Selection for Admin */}
                            <div>
                                <label className="block text-sm font-medium text-neural-secondary mb-1">Assign To</label>
                                <select
                                    value={newTask.assignedTo}
                                    onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="date" required
                                value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Cancel</button>
                                <button type="submit" className="neuro-btn">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
