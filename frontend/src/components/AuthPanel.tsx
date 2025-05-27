'use client';

import { useState } from 'react';
import { User } from '@/types';
import { authAPI } from '@/services/api';

interface AuthPanelProps {
  user: User | null;
  isAuthenticated: boolean;
  onLogin: (authData: { access_token: string; user: User }) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

export default function AuthPanel({
  user,
  isAuthenticated,
  onLogin,
  onLogout,
  onUpdateUser,
}: AuthPanelProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    color: '#3B82F6',
  });

  const [profileForm, setProfileForm] = useState({
    color: user?.color || '#3B82F6',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(loginForm);
      onLogin(response);
      setLoginForm({ username: '', password: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.register(registerForm);
      onLogin(response);
      setRegisterForm({
        username: '',
        email: '',
        password: '',
        color: '#3B82F6',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.updateProfile(profileForm);
      onUpdateUser(response.user);
      setShowProfile(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedColors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
  ];

  if (isAuthenticated && user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {!showProfile ? (
          <div>
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3"
                style={{ backgroundColor: user.color }}
              />
              <h2 className="text-xl font-bold text-gray-900">
                Bienvenue, {user.username}!
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowProfile(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Modifier le profil
              </button>
              <button
                onClick={onLogout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Modifier le profil
              </h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur du profil
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setProfileForm({ color })}
                      className={`w-12 h-12 rounded-full border-2 ${
                        profileForm.color === color
                          ? 'border-gray-800'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={profileForm.color}
                  onChange={(e) =>
                    setProfileForm({ color: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-300 bg-white"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Mise à jour...' : 'Sauvegarder'}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLoginMode ? 'Connexion' : 'Inscription'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isLoginMode
            ? 'Connectez-vous pour accéder au chat'
            : 'Créez votre compte pour commencer'}
        </p>
      </div>

      <form
        onSubmit={isLoginMode ? handleLogin : handleRegister}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            required
            value={isLoginMode ? loginForm.username : registerForm.username}
            onChange={(e) =>
              isLoginMode
                ? setLoginForm({ ...loginForm, username: e.target.value })
                : setRegisterForm({ ...registerForm, username: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          />
        </div>

        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={isLoginMode ? loginForm.password : registerForm.password}
            onChange={(e) =>
              isLoginMode
                ? setLoginForm({ ...loginForm, password: e.target.value })
                : setRegisterForm({ ...registerForm, password: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          />
        </div>

        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur du profil
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setRegisterForm({ ...registerForm, color })}
                  className={`w-12 h-12 rounded-full border-2 ${
                    registerForm.color === color
                      ? 'border-gray-800'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={registerForm.color}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, color: e.target.value })
              }
              className="w-full h-10 rounded border border-gray-300 bg-white"
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading
            ? 'Chargement...'
            : isLoginMode
            ? 'Se connecter'
            : 'S\'inscrire'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setError('');
          }}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          {isLoginMode
            ? 'Pas de compte ? Inscrivez-vous'
            : 'Déjà un compte ? Connectez-vous'}
        </button>
      </div>
    </div>
  );
} 