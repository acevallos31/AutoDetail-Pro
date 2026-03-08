import { ReactNode, useState, CSSProperties } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { colors, spacing } from '../design/tokens';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

/**
 * Layout para páginas de aplicación (dashboard, customers, etc)
 * Con header fijo, sidebar colapsable, y contenido principal
 */
export const AppLayout = ({ children, pageTitle = 'AutoDetail Pro' }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const mainStyles: CSSProperties = {
    paddingTop: '64px',
    transition: 'all 300ms ease',
    minHeight: '100vh',
    marginLeft: sidebarCollapsed ? '80px' : '256px',
    backgroundColor: colors.backgroundLight,
  };

  const contentStyles: CSSProperties = {
    padding: spacing.lg,
    maxWidth: '80rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.backgroundLight }}>
      {/* Header */}
      <Header title={pageTitle} onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main style={mainStyles}>
        <div style={contentStyles}>{children}</div>
      </main>
    </div>
  );
};
