import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserCircle, Sun, Moon, Menu } from 'lucide-react';

const Header = ({ title, onMenuClick }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-neural-accent capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                    <UserCircle size={20} className="md:w-6 md:h-6" />
                </div>
            </div>
        </header>
    );
};

export default Header;
