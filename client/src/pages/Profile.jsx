import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Shield, Calendar } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="text-center mt-10">Loading profile...</div>;

    const InfoCard = ({ icon: Icon, label, value, color }) => (
        <div className="glass-panel p-6 flex items-start space-x-4">
            <div className={`p-3 rounded-full ${color} text-white shrink-0`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white mt-1 break-all">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="glass-panel p-8 bg-gradient-to-r from-indigo-500 to-purple-600 border-none text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-xl">
                        <span className="text-4xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-indigo-100 mt-1 flex items-center justify-center md:justify-start space-x-2">
                            <Briefcase size={16} />
                            <span>{user.designation || 'Employee'}</span>
                        </p>
                    </div>
                    <div className="md:ml-auto">
                        <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-sm font-medium uppercase tracking-wide">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    icon={Mail}
                    label="Email Address"
                    value={user.email}
                    color="bg-blue-500"
                />
                <InfoCard
                    icon={Shield}
                    label="Department"
                    value={user.department || 'Not Assigned'}
                    color="bg-purple-500"
                />
                <InfoCard
                    icon={Briefcase}
                    label="Employee ID"
                    value={user._id}
                    color="bg-emerald-500"
                />
                <InfoCard
                    icon={Calendar}
                    label="Joined Date"
                    value={new Date().toLocaleDateString()} // Mock join date if not in DB
                    color="bg-orange-500"
                />
            </div>

            <div className="text-center pt-8 text-gray-400 text-sm">
                <p>Profile information is managed by administrators.</p>
                <p>Contact HR to request changes.</p>
            </div>
        </div>
    );
};

export default Profile;
