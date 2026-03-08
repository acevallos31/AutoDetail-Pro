import { ReactNode, CSSProperties } from 'react';
import { colors, borderRadius, spacing, typography } from '../design/tokens';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) => {
  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.success[50],
          color: colors.success[700],
        };
      case 'warning':
        return {
          backgroundColor: colors.warning[50],
          color: colors.warning[700],
        };
      case 'error':
        return {
          backgroundColor: colors.error[50],
          color: colors.error[700],
        };
      case 'info':
        return {
          backgroundColor: colors.info[50],
          color: colors.info[700],
        };
      default: // primary
        return {
          backgroundColor: colors.primary[50],
          color: colors.primary[700],
        };
    }
  };

  const getSizeStyles = (): CSSProperties => {
    if (size === 'sm') {
      return {
        padding: `${spacing.xs} ${spacing.sm}`,
        fontSize: typography.fontSize.xs,
      };
    }
    return {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
    };
  };

  const badgeStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    fontWeight: 600,
    ...getVariantStyles(),
    ...getSizeStyles(),
  };

  return (
    <span style={badgeStyles} className={className}>
      {children}
    </span>
  );
};
