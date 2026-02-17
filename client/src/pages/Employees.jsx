import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, User, Mail, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const results = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(results);
    }, [searchTerm, employees]);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data);
            setFilteredEmployees(res.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neural-accent"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
                    <p className="text-gray-500 text-sm">Manage and view all team members</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-gray-800 focus:outline-none focus:border-neural-accent focus:ring-1 focus:ring-neural-accent transition-colors shadow-sm"
                    />
                </div>
            </div>

            <div className="glass-panel overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                {user.role === 'admin' && (
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-medium border border-indigo-100">
                                                {emp.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{emp.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${emp.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                            {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-900">{emp.department || '—'}</div>
                                        <div className="text-xs text-gray-500">{emp.designation}</div>
                                    </td>
                                    <td className="p-4">
                                        <a href={`mailto:${emp.email}`} className="text-gray-400 hover:text-neural-accent transition-colors flex items-center space-x-2">
                                            <Mail size={16} />
                                            <span className="text-sm">{emp.email}</span>
                                        </a>
                                    </td>
                                    {user.role === 'admin' && (
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(emp._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Employee"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredEmployees.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No employees found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employees;
