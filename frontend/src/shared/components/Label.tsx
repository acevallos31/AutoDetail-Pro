import { LabelHTMLAttributes } from 'react';
import { CSSProperties } from 'react';
import { colors, typography } from '../design/tokens';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = ({
  children,
  required = false,
  className = '',
  ...props
}: LabelProps) => {
  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textLight,
    fontFamily: typography.fontFamily?.display,
    letterSpacing: '-0.01em',
  };

  return (
    <label
      className={className}
      style={labelStyle}
      {...props}
    >
      {children}
      {required && <span style={{ color: colors.error, marginLeft: '4px' }}>*</span>}
    </label>
  );
};
