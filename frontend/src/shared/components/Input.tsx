import { InputHTMLAttributes, CSSProperties } from 'react';
import { colors, borderRadius, spacing, typography } from '../design/tokens';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  style = {},
  ...props
}: InputProps) => {
  const inputStyles: CSSProperties = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    paddingLeft: icon ? '2.5rem' : spacing.lg,
    borderRadius: borderRadius.lg,
    border: `1px solid ${error ? colors.error : colors.borderDark}`,
    fontSize: typography.fontSize.base,
    transition: 'all 200ms ease',
    fontFamily: typography.fontFamily?.body || 'inherit',
    color: colors.textDark,
    boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.04)',
    outline: 'none',
  };

  const labelStyles: CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    fontWeight: 600,
    color: colors.textLight,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily?.display,
  };

  const errorStyles: CSSProperties = {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.error,
  };

  const helperStyles: CSSProperties = {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  };

  const iconStyles: CSSProperties = {
    position: 'absolute',
    left: spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.textMuted,
  };

  return (
    <div style={{ width: '100%' }}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={iconStyles}>{icon}</div>}
        <input
          style={{
            ...inputStyles,
            ...style,
            backgroundColor: props.disabled ? colors.backgroundLight : 'rgba(255, 255, 255, 0.9)',
            cursor: props.disabled ? 'not-allowed' : 'auto',
          }}
          className={className}
          {...props}
        />
      </div>
      {error && <p style={errorStyles}>{error}</p>}
      {helperText && !error && <p style={helperStyles}>{helperText}</p>}
    </div>
  );
};
