import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'interactive' | 'static' | 'panel';
  tone?: 'yellow' | 'lavender' | 'sky' | 'dark';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'interactive',
  tone,
  children,
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'interactive'
      ? 'glass-card p-6'
      : variant === 'panel'
      ? 'glass-panel rounded-2xl p-6'
      : 'glass-card-static p-6';

  const toneClass = tone ? `card-tone-${tone}` : '';

  return (
    <div className={`${variantClass} ${toneClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
    <div>
      <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
