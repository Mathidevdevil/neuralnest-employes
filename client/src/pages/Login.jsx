import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginType, setLoginType] = useState('employee');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // convert loginType to backend role
            const role =
                loginType === 'admin'
                    ? 'administrator'
                    : 'employee';

            await login(email, password, role);

            navigate('/dashboard');

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                'Login failed'
            );

        }

    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">

            <div className="p-8 w-96 shadow-lg bg-white dark:bg-gray-800 rounded-lg">

                <div className="flex justify-center mb-4">
                    <img src={logo} alt="NeuralNest" className="h-12" />
                </div>

                <h3 className="text-center mb-4 text-gray-500">
                    {loginType === 'admin'
                        ? 'Administrator Portal'
                        : 'Employee Portal'}
                </h3>

                <div className="flex mb-4">

                    <button
                        className={`flex-1 p-2 ${loginType === 'employee'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200'
                            }`}
                        onClick={() => setLoginType('employee')}
                    >
                        Employee
                    </button>

                    <button
                        className={`flex-1 p-2 ${loginType === 'admin'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200'
                            }`}
                        onClick={() => setLoginType('admin')}
                    >
                        Admin
                    </button>

                </div>

                {error && (
                    <p className="text-red-500 text-center mb-2">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 mb-2 border rounded"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 mb-4 border rounded"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );

};

export default Login;
