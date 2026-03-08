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
          backgroundColor: colors.backgroundLight,
          boxShadow: shadows.lg,
        };
      case 'outlined':
        return {
          backgroundColor: colors.background,
          border: `2px solid ${colors.primaryLight}`,
        };
      default:
        return {
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
        };
    }
  };

  const cardStyles: CSSProperties = {
    borderRadius: borderRadius.xl,
    transition: 'all 200ms ease',
    padding: paddingMap[padding],
    ...getVariantStyles(),
    ...(hover && {
      boxShadow: shadows['lg'],
      borderColor: colors.primary[300],
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
