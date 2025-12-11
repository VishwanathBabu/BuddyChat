'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from './Avatar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ currentUser, onSelectUser, selectedUser, onlineUsers }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/messages/users?userId=${currentUser?._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                console.error('Error fetching users', err);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) fetchUsers();
    }, [currentUser]);

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-1/3 min-w-[320px] backdrop-blur-md bg-white/80 border-r border-white/20 flex flex-col h-full shadow-2xl relative z-10">

            {/* Header Profile */}
            <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-3 transition-transform hover:scale-105 duration-300 cursor-pointer group">
                    <div className="ring-2 ring-emerald-500/20 rounded-full p-0.5 group-hover:ring-emerald-500/50 transition-all">
                        <Avatar src={currentUser?.picture} alt={currentUser?.name} size="md" />
                    </div>
                    <span className="font-bold text-gray-800 tracking-tight group-hover:text-emerald-700 transition-colors">{currentUser?.name}</span>
                </div>
                <button
                    onClick={logout}
                    className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-300"
                    title="Logout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-2.062a.112.112 0 0 0 0-.158L15.75 12" />
                    </svg>
                </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-50">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search Messenger..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100/50 border border-transparent focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-sm outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center pt-20 space-y-3">
                        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400 font-medium">Loading contacts...</p>
                    </div>
                ) : (
                    filteredUsers.map((u, idx) => (
                        <div
                            key={u._id}
                            onClick={() => onSelectUser(u)}
                            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent
                        ${selectedUser?._id === u._id
                                    ? 'bg-emerald-50/80 border-emerald-100 shadow-sm'
                                    : 'hover:bg-gray-50 hover:shadow-sm'
                                }
                    `}
                            style={{ animationDelay: `${idx * 0.05}s` }} // Staggered fade in? Need class for that.
                        >
                            <div className="relative">
                                <Avatar src={u.picture} alt={u.name} size="md" />
                                {(onlineUsers.has(u._id) || u.isOnline) && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse-ring"></span>
                                )}
                                {(onlineUsers.has(u._id) || u.isOnline) && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h3 className={`font-semibold text-sm truncate transition-colors ${selectedUser?._id === u._id ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>{u.name}</h3>
                                    <span className="text-[10px] text-gray-400">12:30</span> {/* Placeholder Time */}
                                </div>
                                <p className={`text-xs truncate transition-colors ${selectedUser?._id === u._id ? 'text-emerald-600 font-medium' : 'text-gray-500 group-hover:text-gray-600'}`}>
                                    Click to start conversation
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
