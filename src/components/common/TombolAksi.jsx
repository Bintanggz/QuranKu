import React from 'react';

export default function TombolAksi({
  variant = 'primary', // 'primary' | 'secondary' | 'gold' | 'outline' | 'icon'
  icon,
  iconFilled = false,
  children,
  onClick,
  className = '',
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  ...props
}) {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variants = {
    primary:
      'bg-primary text-on-primary hover:brightness-110 shadow-sm active:scale-95',
    secondary:
      'bg-secondary-container text-on-secondary-container hover:brightness-105 active:scale-95 shadow-sm',
    gold:
      'bg-secondary text-white hover:brightness-110 active:scale-95 shadow-sm',
    outline:
      'bg-transparent border border-accent-gold text-accent-gold hover:bg-accent-gold/10 active:scale-95',
    white:
      'bg-white text-primary hover:bg-surface-container-low shadow-md active:scale-95 font-semibold',
    icon:
      'p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low active:scale-90',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center transition-all ${variants.icon} ${className}`}
        {...props}
      >
        <span className={`material-symbols-outlined ${iconFilled ? 'fill-1' : ''}`}>
          {icon}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-label-sm tracking-wide transition-all duration-200 cursor-pointer ${
        sizeClasses[size] || sizeClasses.md
      } ${variants[variant] || variants.primary} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {icon && (
        <span className={`material-symbols-outlined text-[18px] ${iconFilled ? 'fill-1' : ''}`}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

