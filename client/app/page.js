'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);

  // Conditionally call hook? No, hooks must be top level. 
  // We handle null user inside hook.
  const { socket, onlineUsers } = useSocket(user);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        currentUser={user}
        onSelectUser={setSelectedUser}
        selectedUser={selectedUser}
        onlineUsers={onlineUsers}
      />
      <ChatWindow
        currentUser={user}
        selectedUser={selectedUser}
        socket={socket}
      />
    </div>
  );
}
