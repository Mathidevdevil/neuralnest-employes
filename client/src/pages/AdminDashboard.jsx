import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, CheckSquare, Clock, Plus } from 'lucide-react';
import AddEmployeeModal from '../components/AddEmployeeModal';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ employees: 0, pendingTasks: 0, todayAttendance: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="glass-panel p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${color} text-white`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-neural-secondary text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-neural-text">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neural-text">Dashboard Overview</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="neuro-btn flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Users}
                    title="Total Employees"
                    value={stats.employees}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={CheckSquare}
                    title="Pending Tasks"
                    value={stats.pendingTasks}
                    color="bg-yellow-500"
                />
                <StatCard
                    icon={Clock}
                    title="Present Today"
                    value={stats.todayAttendance}
                    color="bg-green-500"
                />
            </div>

            <div className="glass-panel p-8 text-center py-16">
                <h3 className="text-lg font-medium text-neural-text mb-2">Welcome to NeuralNest Admin</h3>
                <p className="text-neural-secondary max-w-md mx-auto">
                    Manage your employees, track attendance, and schedule meetings from this centralized dashboard.
                </p>
            </div>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserAdded={fetchStats}
            />
        </div>
    );
};

export default AdminDashboard;
