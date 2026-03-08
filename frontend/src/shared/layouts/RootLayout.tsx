import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, LayoutDashboard, Users, Calendar, Zap, BarChart3 } from 'lucide-react';
import { colors, spacing, shadows, transitions } from '../design/tokens';
import { useAuthStore } from '../../store/authStore';

interface RootLayoutProps {
  children: ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Citas', href: '/appointments', icon: Calendar },
    { name: 'Servicios', href: '/services', icon: Zap },
    { name: 'Analíticas', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: colors.backgroundLight }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width: '288px',
              background: `linear-gradient(180deg, ${colors.sidebarDark} 0%, ${colors.sidebarLight} 100%)`,
              color: colors.textWhite,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: shadows.xl,
              zIndex: 40,
            }}
          >
            {/* Logo */}
            <div
              style={{
                padding: `${spacing.lg} ${spacing.lg}`,
                borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                    padding: spacing.md,
                    borderRadius: '12px',
                    boxShadow: shadows.lg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Car size={24} />
                </motion.div>
                <div>
                  <h1
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      background: `linear-gradient(90deg, ${colors.primaryLight}, ${colors.accentLight})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      margin: 0,
                    }}
                  >
                    AutoDetail
                  </h1>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Pro
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav
              style={{
                flex: 1,
                padding: spacing.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.sm,
              }}
            >
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderRadius: '12px',
                      transition: transitions.base,
                      cursor: 'pointer',
                      background: active
                        ? `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`
                        : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: active ? shadows.blue : 'none',
                    }}
                  >
                    <Icon size={20} />
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          marginLeft: 'auto',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: colors.textWhite,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* User Profile */}
            <div
              style={{
                padding: `${spacing.lg}`,
                borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>
                    {user?.name || 'Admin'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                    {user?.email || 'admin@autodetail.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  marginTop: spacing.lg,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: transitions.base,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
              >
                Salir
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: colors.background,
            borderBottom: `1px solid ${colors.border}`,
            padding: `${spacing.lg} ${spacing.lg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: shadows.sm,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: spacing.sm,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: colors.textDark,
                transition: transitions.base,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = colors.backgroundLight;
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: colors.textDark,
                  margin: 0,
                }}
              >
                {navigation.find((item) => isActive(item.href))?.name || 'Dashboard'}
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: colors.textMuted,
                  margin: 0,
                }}
              >
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/appointments')}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              color: colors.textWhite,
              borderRadius: '8px',
              boxShadow: shadows.blue,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            + Nueva Cita
          </motion.div>
        </header>

        {/* Content Area */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: spacing.lg,
          }}
        >
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
