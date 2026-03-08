import { useState, FormEvent, CSSProperties } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';
import { motion } from 'framer-motion';
import { Car, LogIn } from 'lucide-react';

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState('demo@autodetail.com');
  const [password, setPassword] = useState('password123');
  const { login, isValidating, error, clearError } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    const result = await login({ email, password });
    if (result.success) {
      onSuccess();
    }
  };

  const cardStyles: CSSProperties = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.95) 100%)',
    borderRadius: borderRadius['2xl'],
    boxShadow: shadows.xl,
    padding: spacing['3xl'],
    border: `1px solid ${colors.border}`,
    backdropFilter: 'blur(8px)',
  };

  const logoContainerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
    gap: spacing.lg,
  };

  const logoIconStyles: CSSProperties = {
    background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})`,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    boxShadow: `0 10px 25px -5px rgba(6, 182, 212, 0.3)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyles: CSSProperties = {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    letterSpacing: '-0.03em',
    background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: spacing.xs,
  };

  const subtitleStyles: CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    lineHeight: typography.lineHeight.base,
  };

  const formStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  };

  const errorStyles: CSSProperties = {
    padding: spacing.lg,
    background: colors.errorBg,
    border: `1px solid ${colors.errorLight}`,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const errorTextStyles: CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  };

  const dividerStyles: CSSProperties = {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTop: `1px solid ${colors.border}`,
  };

  const demoTextStyles: CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.lineHeight.base,
  };

  const submitButtonStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: `${spacing.md} ${spacing.xl}`,
    background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
    color: colors.textWhite,
    border: 'none',
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.display,
    letterSpacing: '-0.01em',
    cursor: isValidating ? 'not-allowed' : 'pointer',
    boxShadow: `0 10px 25px -5px rgba(6, 182, 212, 0.3)`,
    transition: 'all 0.2s',
    opacity: isValidating ? 0.7 : 1,
    width: '100%',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={cardStyles}
    >
      {/* Logo y Título */}
      <div style={logoContainerStyles}>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          style={logoIconStyles}
        >
          <Car style={{ width: '32px', height: '32px', color: colors.textWhite }} />
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={titleStyles}>AutoDetail Pro</h1>
          <p style={subtitleStyles}>Sistema de Gestión de Detallado Automotriz</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={formStyles}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={errorStyles}
          >
            <p style={errorTextStyles}>{error}</p>
          </motion.div>
        )}

        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isValidating}
          required
          placeholder="demo@autodetail.com"
        />

        <Input
          id="password"
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isValidating}
          required
          placeholder="••••••••"
        />

        <motion.button
          type="submit"
          disabled={isValidating}
          whileHover={!isValidating ? { scale: 1.02 } : {}}
          whileTap={!isValidating ? { scale: 0.98 } : {}}
          style={submitButtonStyles}
        >
          <LogIn style={{ width: '20px', height: '20px' }} />
          {isValidating ? 'Validando...' : 'Ingresar'}
        </motion.button>
      </form>

      {/* Info demo */}
      <div style={dividerStyles}>
        <p style={demoTextStyles}>
          Demo: <strong>demo@autodetail.com</strong> / <strong>password123</strong>
        </p>
      </div>
    </motion.div>
  );
};
