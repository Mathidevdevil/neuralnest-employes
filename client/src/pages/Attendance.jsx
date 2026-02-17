import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, User } from 'lucide-react';

const Attendance = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setAttendance(res.data);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neural-text">Attendance History</h2>

            <div className="glass-panel overflow-hidden bg-white dark:bg-gray-800 transition-colors">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                            {user.role === 'admin' && <th className="p-4 font-semibold text-xs uppercase tracking-wider">Employee</th>}
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Clock In</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Clock Out</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-neural-text">
                        {attendance.map(record => (
                            <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="p-4">{new Date(record.date).toLocaleDateString()}</td>
                                {user.role === 'admin' && (
                                    <td className="p-4 flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <User size={14} />
                                        </div>
                                        <span>{record.user?.name || 'Unknown'}</span>
                                    </td>
                                )}
                                <td className="p-4 text-green-600 dark:text-green-400 font-medium">
                                    {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}
                                </td>
                                <td className="p-4 text-red-600 dark:text-red-400 font-medium">
                                    {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${record.status === 'present'
                                        ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                        : record.status === 'absent'
                                            ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                                        }`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {attendance.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No attendance records found.</div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
