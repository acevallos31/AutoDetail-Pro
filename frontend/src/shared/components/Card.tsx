import { ReactNode, HTMLAttributes, CSSProperties } from 'react';
import { colors, shadows, borderRadius, spacing } from '../design/tokens';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingMap = {
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
};

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  style = {},
  ...props
}: CardProps) => {
  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'elevated':
        return {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.98) 100%)',
          boxShadow: shadows.lg,
          border: `1px solid ${colors.border}`,
        };
      case 'outlined':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: `2px solid ${colors.primaryLight}`,
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.sm,
        };
    }
  };

  const cardStyles: CSSProperties = {
    borderRadius: borderRadius.xl,
    transition: 'all 200ms ease',
    padding: paddingMap[padding],
    ...getVariantStyles(),
    ...(hover && {
      boxShadow: shadows.lg,
      borderColor: colors.primaryLight,
      transform: 'translateY(-2px)',
    }),
    ...style,
  };

  return (
    <div
      className={className}
      style={cardStyles}
      {...props}
    >
      {children}
    </div>
  );
};
