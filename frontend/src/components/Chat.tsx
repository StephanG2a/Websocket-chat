'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ConnectedUser } from '@/types';

interface ChatProps {
  messages: Message[];
  connectedUsers: ConnectedUser[];
  isConnected: boolean;
  isAuthenticated: boolean;
  onSendMessage: (message: string) => void;
}

export default function Chat({
  messages,
  connectedUsers,
  isConnected,
  isAuthenticated,
  onSendMessage,
}: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected && isAuthenticated) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 text-white p-4 border-b">
        <h2 className="text-xl font-bold">Chat</h2>
        <div className="flex items-center mt-2">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected && isAuthenticated ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm">
            {isConnected && isAuthenticated
              ? `Connecté - ${connectedUsers.length} utilisateur(s) en ligne`
              : 'Déconnecté'}
          </span>
        </div>
      </div>

      {isAuthenticated && (
        <div className="bg-gray-100 p-3 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Utilisateurs connectés:
          </h3>
          <div className="flex flex-wrap gap-2">
            {connectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center bg-white rounded-full px-3 py-1 text-sm shadow-sm"
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: user.color }}
                />
                <span className='text-black'>{user.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto p-4 space-y-3 ${
          !isAuthenticated ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {!isAuthenticated && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg">Connectez-vous pour accéder au chat</p>
          </div>
        )}

        {isAuthenticated && messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Aucun message pour le moment. Soyez le premier à écrire !</p>
          </div>
        )}

        {isAuthenticated &&
          messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: message.user.color }}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {message.user.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{message.message}</p>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                isConnected ? 'Tapez votre message...' : 'Connexion en cours...'
              }
              disabled={!isConnected}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-black bg-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 