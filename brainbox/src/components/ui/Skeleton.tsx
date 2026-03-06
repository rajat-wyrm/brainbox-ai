import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '100px')
  };

  const baseClass = `skeleton ${variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-lg'} ${className}`;

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={baseClass} style={style} />
        ))}
      </div>
    );
  }

  return <div className={baseClass} style={style} />;
};
