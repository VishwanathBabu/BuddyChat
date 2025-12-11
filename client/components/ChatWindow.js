'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Avatar from './Avatar';
import { format } from 'date-fns';

export default function ChatWindow({ currentUser, selectedUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/messages/${selectedUser._id}?userId=${currentUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data);
            } catch (err) {
                console.error('Error fetching messages', err);
            }
        };
        fetchMessages();
    }, [selectedUser, currentUser]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg) => {
            if (msg.sender === selectedUser?._id || msg.recipient === selectedUser?._id) {
                setMessages(prev => [...prev, msg]);
            }
        };

        const handleSent = (msg) => {
            if (msg.recipient === selectedUser?._id) {
                setMessages(prev => [...prev, msg]);
            }
        }

        socket.on('receive_message', handleMessage);
        socket.on('message_sent', handleSent);

        return () => {
            socket.off('receive_message', handleMessage);
            socket.off('message_sent', handleSent);
        };
    }, [socket, selectedUser]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !socket) return;

        const msgData = {
            senderId: currentUser._id,
            recipientId: selectedUser._id,
            content: input
        };

        socket.emit('send_message', msgData);
        setInput('');
    };

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50/50 flex-col gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/bg-doodle.png')] opacity-[0.03]"></div> {/* Optional doodle bg */}
                <div className="relative text-center p-10 bg-white/40 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 animate-fadeIn">
                    <div className="w-24 h-24 bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-emerald-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">It's quiet here...</h2>
                    <p className="text-gray-500 max-w-xs mx-auto">Select a chat from the sidebar to start messaging instantly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#F3F4F6] relative">
            <div className="absolute inset-0 bg-[#e5ddd5]/10 pointer-events-none z-0"></div> {/* Very subtle texture overlay if possible */}

            {/* Header */}
            <div className="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
                <Avatar src={selectedUser.picture} alt={selectedUser.name} size="sm" />
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg leading-tight">{selectedUser.name}</span>
                    {selectedUser.isOnline ? (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Online
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">Offline</span>
                    )}
                </div>
                <div className="flex-1"></div>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender === currentUser._id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                            <div className={`
                        max-w-[65%] px-4 py-3 shadow-md text-sm relative 
                        ${isMe
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-50'
                                } 
                    `}>
                                <div className={`mb-1 break-words text-[15px] leading-relaxed ${isMe ? 'text-white/95' : 'text-gray-800'}`}>
                                    {msg.content}
                                </div>
                                <div className={`text-[10px] text-right font-medium tracking-wide ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>
                                    {msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : format(new Date(), 'HH:mm')}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-20">
                <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-5 py-3.5 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-600/40 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 flex items-center justify-center aspect-square"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
