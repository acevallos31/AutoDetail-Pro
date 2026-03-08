import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { CSSProperties } from 'react';
import { colors, spacing, typography } from '../design/tokens';

interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export const Header = ({ title = 'AutoDetail Pro', onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const headerStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    backdropFilter: 'blur(8px)',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    zIndex: 50,
  };

  const containerStyles: CSSProperties = {
    height: '100%',
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const leftSectionStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
  };

  const titleStyles: CSSProperties = {
    fontSize: typography.fontSize['2xl'],
    fontWeight: 700,
    color: colors.textDark,
    fontFamily: typography.fontFamily?.display,
    letterSpacing: '-0.02em',
  };

  const buttonStyles: CSSProperties = {
    padding: spacing.sm,
    backgroundColor: colors.backgroundLight,
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 200ms ease',
    cursor: 'pointer',
    fontSize: '20px',
  };

  const rightSectionStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
  };

  const userNameStyles: CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: 600,
    color: colors.textDark,
  };

  const userRoleStyles: CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  };

  const avatarStyles: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: typography.fontSize.lg,
  };

  const logoutButtonStyles: CSSProperties = {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    color: colors.error,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 200ms ease',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: typography.fontSize.sm,
  };

  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        {/* Left: Logo + Menu Toggle */}
        <div style={leftSectionStyles}>
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              style={buttonStyles}
              title="Toggle sidebar"
            >
              ☰
            </button>
          )}
          <h1 style={titleStyles}>{title}</h1>
        </div>

        {/* Right: User Info + Logout */}
        <div style={rightSectionStyles}>
          {/* User Info */}
          <div style={{ textAlign: 'right' }}>
            <p style={userNameStyles}>
              {user?.name || user?.email || 'Usuario'}
            </p>
            {user?.role && <p style={userRoleStyles}>{user.role}</p>}
          </div>

          {/* Avatar */}
          <div style={avatarStyles}>
            {user?.email?.charAt(0).toUpperCase() || '👤'}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={logoutButtonStyles}
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};
