import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (currentUser) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        if (!currentUser) return;

        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('join', currentUser._id);

        newSocket.on('user_status_change', ({ userId, isOnline }) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                if (isOnline) next.add(userId);
                else next.delete(userId);
                return next;
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, [currentUser]);

    return { socket, onlineUsers };
};
