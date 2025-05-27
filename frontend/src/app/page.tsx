'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import Chat from '@/components/Chat';
import AuthPanel from '@/components/AuthPanel';

export default function Home() {
  const { user, token, isLoading, isAuthenticated, login, logout, updateUser } = useAuth();
  const { messages, connectedUsers, isConnected, sendMessage } = useSocket(token);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Chat WebSocket
          </h1>
          <p className="text-gray-600">
            Application de chat en temps réel avec NestJS et Next.js
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <Chat
              messages={messages}
              connectedUsers={connectedUsers}
              isConnected={isConnected}
              isAuthenticated={isAuthenticated}
              onSendMessage={sendMessage}
            />
          </div>

          <div className="lg:col-span-1">
            <AuthPanel
              user={user}
              isAuthenticated={isAuthenticated}
              onLogin={login}
              onLogout={logout}
              onUpdateUser={updateUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
