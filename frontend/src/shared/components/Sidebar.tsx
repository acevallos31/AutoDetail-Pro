import { CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
import { colors, spacing, typography, borderRadius } from '../design/tokens';

interface NavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
}

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar = ({ collapsed = false, onCollapse }: SidebarProps) => {
  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Customers', path: '/customers', icon: '👥' },
    { label: 'Appointments', path: '/appointments', icon: '📅' },
    { label: 'Services', path: '/services', icon: '🛠️' },
    { label: 'Analytics', path: '/analytics', icon: '📈' },
    { label: 'Operations', path: '/operations', icon: '⚙️' },
  ];

  const asideStyles: CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    paddingTop: '64px',
    backgroundColor: 'white',
    borderRightColor: colors.border,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    transition: 'all 300ms ease',
    zIndex: 40,
    width: collapsed ? '80px' : '256px',
  };

  const navStyles: CSSProperties = {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  };

  const getLinkStyles = (isActive: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    transition: 'colors 200ms ease',
    fontWeight: 600,
    fontSize: typography.fontSize.sm,
    textDecoration: 'none',
    color: isActive ? colors.primaryDark : colors.textLight,
    backgroundColor: isActive ? colors.primary[50] : 'transparent',
    cursor: 'pointer',
    border: 'none',
  });

  const footerStyles: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
  };

  const logoutButtonStyles: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    color: colors.error[600],
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color 200ms ease',
    fontWeight: 600,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
  };

  const iconStyles: CSSProperties = {
    flexShrink: 0,
    fontSize: '20px',
  };

  const badgeStyles: CSSProperties = {
    backgroundColor: colors.error[600],
    color: 'white',
    fontSize: typography.fontSize.xs,
    borderRadius: borderRadius.full,
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <aside style={asideStyles}>
      <nav style={navStyles}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => getLinkStyles(isActive)}
            title={collapsed ? item.label : undefined}
          >
            <span style={iconStyles}>{item.icon}</span>
            {!collapsed && (
              <>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span style={badgeStyles}>{item.badge}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Logout button */}
      <div style={footerStyles}>
        <button style={logoutButtonStyles} title={collapsed ? 'Logout' : undefined}>
          <span style={iconStyles}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
