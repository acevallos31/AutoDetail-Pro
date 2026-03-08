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
    background: `linear-gradient(135deg, ${colors.backgroundLight} 0%, #eef6ff 45%, #e8f9fc 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  };

  const innerStyles: CSSProperties = {
    width: '100%',
    maxWidth: '460px',
    position: 'relative',
    zIndex: 2,
  };

  const glowOneStyles: CSSProperties = {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(2,132,199,0.18) 0%, rgba(2,132,199,0) 70%)',
    top: '-120px',
    left: '-140px',
    zIndex: 0,
  };

  const glowTwoStyles: CSSProperties = {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0) 72%)',
    bottom: '-140px',
    right: '-120px',
    zIndex: 0,
  };

  return (
    <div style={containerStyles}>
      <div style={glowOneStyles} />
      <div style={glowTwoStyles} />
      <div style={innerStyles}>{children}</div>
    </div>
  );
};
