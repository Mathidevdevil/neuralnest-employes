import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('');

    const handleClockIn = async () => {
        try {
            await axios.post('http://localhost:5000/api/attendance/clockin', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStatus('Clocked In Successfully');
        } catch (error) {
            setStatus(error.response?.data?.message || 'Error clocking in');
        }
    };

    const handleClockOut = async () => {
        try {
            await axios.post('http://localhost:5000/api/attendance/clockout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStatus('Clocked Out Successfully');
        } catch (error) {
            setStatus(error.response?.data?.message || 'Error clocking out');
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}</h2>
                    <p className="text-gray-500 mt-1">Ready to start your day?</p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={handleClockIn} className="neuro-btn bg-green-600 hover:bg-green-700 shadow-md shadow-green-200">
                        Clock In
                    </button>
                    <button onClick={handleClockOut} className="neuro-btn bg-red-600 hover:bg-red-700 shadow-md shadow-red-200">
                        Clock Out
                    </button>
                </div>
            </div>
            {status && <p className="text-center font-medium text-neural-accent">{status}</p>}
        </div>
    );
};

export default EmployeeDashboard;
