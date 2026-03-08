import { ReactNode, CSSProperties } from 'react';
import { colors, spacing } from '../design/tokens';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout para páginas de autenticación (login, register, etc)
 * Fondo gradiente slate igual que el dashboard
 */
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const containerStyles: CSSProperties = {
    minHeight: '100vh',
    background: `linear-gradient(to bottom right, ${colors.backgroundLight}, ${colors.backgroundLighter})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  };

  const innerStyles: CSSProperties = {
    width: '100%',
    maxWidth: '440px',
  };

  return (
    <div style={containerStyles}>
      <div style={innerStyles}>{children}</div>
    </div>
  );
};
