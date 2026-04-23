/**
 * Button Component
 * Reusable button with multiple variants, sizes, and states
 * Uses design tokens for consistent styling
 */

import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',           // primary, secondary, outline, ghost
  size = 'md',                   // sm, md, lg
  color = 'primary',             // primary, success, warning, danger
  disabled = false,
  loading = false,
  icon = null,                   // Icon component or element
  iconPosition = 'left',         // left or right
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClass = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    `btn-${color}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          <span className="btn-text">{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
          <span className="btn-text">{children}</span>
          {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
