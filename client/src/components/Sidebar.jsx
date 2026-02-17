import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Users, Clock, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
        { icon: Calendar, label: 'Meetings', path: '/dashboard/meetings' },
        { icon: Users, label: 'Employees', path: '/dashboard/employees' },
        { icon: Clock, label: 'Attendance', path: '/dashboard/attendance' },
        { icon: User, label: 'My Profile', path: '/dashboard/profile' },
    ];

    return (
        <div className="w-64 h-screen bg-neural-card border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm transition-colors duration-300">
            <div className="p-6 flex justify-center">
                <img src={logo} alt="NeuralNest Logo" className="h-12 w-auto object-contain" />
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                                ? 'bg-neural-accent/10 text-neural-accent'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
