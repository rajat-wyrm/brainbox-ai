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

  const baseClass = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer rounded ${
    variant === 'circular' ? 'rounded-full' : ''
  } ${className}`;

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

// Add CSS for shimmer animation
export const SkeletonStyles = () => (
  <style>
    {`
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite linear;
        background-size: 1000px 100%;
      }
    `}
  </style>
);
