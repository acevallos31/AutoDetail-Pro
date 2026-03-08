import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const API_BASE_URL = rawApiBase
  ? (rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`)
  : '/api';

export const useAuth = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { login, logout, setError, clearError, ...state } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsValidating(true);
    clearError();

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || 'Error en la autenticación'
        );
      }

      if (!data.success || !data.data) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Guardar usuario y tokens
      const user = data.data.user || { email: credentials.email };
      login(
        user,
        data.data.accessToken,
        data.data.refreshToken
      );

      return { success: true, user };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    ...state,
    isValidating,
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };
};
