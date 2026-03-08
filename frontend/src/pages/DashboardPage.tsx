import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AutoDetail Pro - Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información de Usuario
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            {user?.name && (
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              </div>
            )}
            {user?.role && (
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="text-lg font-medium text-gray-900">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Token Info */}
        <div className="bg-gray-900 rounded-lg shadow p-6 mb-8 text-white">
          <h2 className="text-xl font-semibold mb-4">
            Token de Acceso
          </h2>
          <div className="bg-gray-800 p-4 rounded overflow-auto max-h-32">
            <code className="text-sm font-mono text-green-400 break-all">
              {accessToken || 'No disponible'}
            </code>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Este token se envía en el header Authorization para acceder a endpoints protegidos
          </p>
        </div>

        {/* Features Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Clientes', 'Citas', 'Servicios'].map((feature) => (
            <div
              key={feature}
              className="bg-white rounded-lg shadow p-6 text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature}
              </h3>
              <p className="text-gray-500 text-sm">
                Próximamente en Phase 4
              </p>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            ℹ️ Información de Depuración
          </h3>
          <pre className="text-xs bg-white p-3 rounded border border-yellow-300 overflow-auto max-h-48">
            {JSON.stringify(
              {
                user,
                isAuthenticated: true,
                tokenLength: accessToken?.length || 0,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    </div>
  );
};
