import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    mint: 'bg-mint/10 text-mint-dark',
    navy: 'bg-navy/10 text-navy',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
