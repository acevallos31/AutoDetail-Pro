import { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { colors, spacing, typography, borderRadius, transitions, shadows } from '../design/tokens';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const getVariantStyles = (): CSSProperties => {
    const baseBackground = {
      primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      secondary: 'rgba(255, 255, 255, 0.88)',
      danger: colors.error,
      ghost: 'transparent',
    }[variant];

    const baseColor = {
      primary: colors.textWhite,
      secondary: colors.textDark,
      danger: colors.textWhite,
      ghost: colors.primary,
    }[variant];

    return {
      background: baseBackground,
      color: baseColor,
      boxShadow: variant === 'primary' ? shadows.glow : shadows.none,
      border: variant === 'secondary' ? `1px solid ${colors.border}` : 'none',
    };
  };

  const getSizeStyles = (): CSSProperties => {
    const sizes = {
      sm: { padding: `${spacing.sm} ${spacing.md}`, fontSize: typography.fontSize.sm },
      md: { padding: `${spacing.md} ${spacing.lg}`, fontSize: typography.fontSize.base },
      lg: { padding: `${spacing.lg} ${spacing.xl}`, fontSize: typography.fontSize.lg },
    };
    return sizes[size];
  };

  const baseStyles: CSSProperties = {
    fontWeight: 600,
    fontFamily: typography.fontFamily?.display,
    letterSpacing: '-0.01em',
    borderRadius: borderRadius.lg,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    whiteSpace: 'nowrap',
    transition: transitions.colors,
    width: isFullWidth ? '100%' : 'auto',
    outline: 'none',
    backdropFilter: variant === 'secondary' ? 'blur(4px)' : undefined,
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{ ...baseStyles, ...getVariantStyles(), ...getSizeStyles() }}
      className={className}
      {...props}
    >
      {leftIcon && <span style={{ flexShrink: 0 }}>{leftIcon}</span>}
      {isLoading ? '...' : children}
      {rightIcon && <span style={{ flexShrink: 0 }}>{rightIcon}</span>}
    </button>
  );
};
