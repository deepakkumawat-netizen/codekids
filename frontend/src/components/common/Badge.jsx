/**
 * Badge Component
 * Small status indicator with variants and colors
 */

import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'solid',         // solid, outline
  size = 'md',               // sm, md, lg
  color = 'primary',         // primary, success, warning, danger
  icon = null,               // Icon element
  className = '',
  ...props
}) => {
  const badgeClass = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    `badge-${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClass} {...props}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-text">{children}</span>
    </span>
  );
};

export default Badge;
