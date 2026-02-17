import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Calendar, Users } from 'lucide-react';

const Meetings = () => {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [newMeeting, setNewMeeting] = useState({ title: '', description: '', dateTime: '', attendees: [] });
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchMeetings();
        if (user.role === 'admin') fetchUsers();
    }, []);

    const fetchMeetings = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/meetings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMeetings(res.data);
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
    };

    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/meetings`, newMeeting, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsModalOpen(false);
            fetchMeetings();
            setNewMeeting({ title: '', description: '', dateTime: '', attendees: [] });
        } catch (error) {
            console.error('Error creating meeting', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/meetings/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchMeetings();
        } catch (error) {
            console.error('Error deleting meeting', error);
        }
    };

    const handleAttendeeChange = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setNewMeeting({ ...newMeeting, attendees: value });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neural-text">Meetings</h2>
                {user.role === 'admin' && (
                    <button onClick={() => setIsModalOpen(true)} className="neuro-btn flex items-center space-x-2">
                        <Plus size={18} />
                        <span>Schedule Meeting</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map(meeting => (
                    <div key={meeting._id} className="glass-panel p-6 relative group bg-white dark:bg-gray-800 transition-colors">
                        <h3 className="text-lg font-semibold text-neural-text">{meeting.title}</h3>
                        <p className="text-neural-secondary mt-2 text-sm">{meeting.description}</p>
                        <div className="mt-4 flex flex-col space-y-2 text-sm text-neural-secondary">
                            <div className="flex items-center space-x-2">
                                <Calendar size={16} />
                                <span>{new Date(meeting.dateTime).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users size={16} />
                                <span>{meeting.attendees.length} Attendees</span>
                            </div>
                        </div>
                        {user.role === 'admin' && (
                            <button onClick={() => handleDelete(meeting._id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-panel p-8 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-neural-text">Schedule Meeting</h3>
                        <form onSubmit={handleCreateMeeting} className="space-y-4">
                            <input
                                type="text" placeholder="Title" required
                                value={newMeeting.title} onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <textarea
                                placeholder="Description"
                                value={newMeeting.description} onChange={e => setNewMeeting({ ...newMeeting, description: e.target.value })}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[100px]"
                            />
                            <input
                                type="datetime-local" required
                                value={newMeeting.dateTime} onChange={e => setNewMeeting({ ...newMeeting, dateTime: e.target.value })}
                                className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <div className="space-y-2">
                                <label className="text-sm text-neural-secondary">Select Attendees (Hold Ctrl for multiple)</label>
                                <select
                                    multiple
                                    value={newMeeting.attendees}
                                    onChange={handleAttendeeChange}
                                    className="neuro-input dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32"
                                >
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Cancel</button>
                                <button type="submit" className="neuro-btn">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Meetings;
