/**
 * Card Component
 * Reusable card container with variants and styling
 */

import React from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',    // default, elevated, outlined
  padding = 'lg',         // sm, md, lg, xl
  onClick,
  className = '',
  hoverable = false,
  ...props
}) => {
  const cardClass = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable && 'card-hoverable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
