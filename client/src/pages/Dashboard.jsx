import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import Tasks from './Tasks';
import Meetings from './Meetings';
import Employees from './Employees';
import Attendance from './Attendance';
import Profile from './Profile';

const Dashboard = () => {
    const { user } = useAuth();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-neural-bg text-neural-text overflow-hidden">
            <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Dashboard" onMenuClick={toggleMobileSidebar} />
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <Routes>
                        <Route path="/" element={
                            user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />
                        } />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="meetings" element={<Meetings />} />
                        <Route path="employees" element={<Employees />} />
                        <Route path="attendance" element={<Attendance />} />
                        <Route path="profile" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
