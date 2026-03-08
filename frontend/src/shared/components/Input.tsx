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
    fontFamily: 'inherit',
    outline: 'none',
  };

  const labelStyles: CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    fontWeight: 600,
    color: colors.textLight,
    marginBottom: spacing.sm,
  };

  const errorStyles: CSSProperties = {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.error[600],
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
            backgroundColor: props.disabled ? colors.backgroundLight : colors.background,
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
