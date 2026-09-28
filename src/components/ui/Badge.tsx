import React from 'react';

export type BadgeVariant = 'emerald' | 'indigo' | 'cyan' | 'amber' | 'rose' | 'purple' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  withDot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'indigo',
  withDot = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {withDot && <span className="badge-dot" />}
      <span>{children}</span>
    </span>
  );
};
