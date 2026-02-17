import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginType, setLoginType] = useState('employee'); // 'employee' or 'admin'
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.message === 'Network Error') {
                setError('Backend not reachable or Database timeout. Check server console.');
            } else {
                setError(err.response?.data?.message || 'Login failed');
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
            <div className="glass-panel p-8 w-96 shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="NeuralNest" className="h-12 w-auto" />
                </div>
                <h3 className="text-sm font-medium mb-6 text-center text-gray-500 dark:text-gray-400">
                    {loginType === 'admin' ? 'Administrator Portal' : 'Employee Portal'}
                </h3>

                {/* Login Type Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
                    <button
                        className={`flex-1 py-1 text-sm rounded-md transition-all font-medium ${loginType === 'employee' ? 'bg-white dark:bg-gray-600 text-neural-accent shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        onClick={() => setLoginType('employee')}
                    >
                        Employee
                    </button>
                    <button
                        className={`flex-1 py-1 text-sm rounded-md transition-all font-medium ${loginType === 'admin' ? 'bg-white dark:bg-gray-600 text-neural-accent shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        onClick={() => setLoginType('admin')}
                    >
                        Admin
                    </button>
                </div>

                {error && <p className="text-red-500 text-center mb-4 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="neuro-input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="neuro-input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full neuro-btn mt-4 font-bold shadow-lg shadow-indigo-500/20">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
