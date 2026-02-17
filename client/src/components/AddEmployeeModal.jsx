import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const AddEmployeeModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department: '',
        designation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auth/register', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onUserAdded();
            onClose();
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'employee',
                department: '',
                designation: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel w-full max-w-md p-6 relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-neural-text mb-6">Add New User</h2>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div>
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    {formData.role === 'employee' && (
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleChange}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <input
                                name="designation"
                                placeholder="Designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full neuro-btn mt-6 flex justify-center py-2 shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? 'Adding...' : formData.role === 'admin' ? 'Add Admin' : 'Add Employee'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
