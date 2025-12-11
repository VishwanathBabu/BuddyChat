const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
    // Map of userId -> socketId
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('join', async (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.userId = userId;

            // Update user status
            await User.findByIdAndUpdate(userId, { isOnline: true });
            io.emit('user_status_change', { userId, isOnline: true });
        });

        socket.on('send_message', async (data) => {
            const { senderId, recipientId, content } = data;

            // Save to DB
            const message = new Message({
                sender: senderId,
                recipient: recipientId,
                content
            });
            await message.save();

            // Send to recipient if online
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receive_message', message);
            }

            // Send back to sender (for confirmation/optimistic update confirmation)
            socket.emit('message_sent', message);
        });

        socket.on('typing', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('user_typing', { userId: socket.userId });
            }
        });

        socket.on('stop_typing', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('user_stop_typing', { userId: socket.userId });
            }
        });

        socket.on('disconnect', async () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
                io.emit('user_status_change', { userId: socket.userId, isOnline: false });
            }
        });
    });
};
