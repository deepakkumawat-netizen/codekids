/**
 * Container Component
 * Centered content wrapper with max-width constraints
 */

import React from 'react';
import './Container.css';

const Container = ({
  children,
  maxWidth = 'lg',          // sm, md, lg, xl, 2xl, full
  padding = 'lg',           // xs, sm, md, lg, xl
  className = '',
  centerContent = true,
  ...props
}) => {
  const containerClass = [
    'container',
    `container-${maxWidth}`,
    `container-padding-${padding}`,
    centerContent && 'container-center',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass} {...props}>
      {children}
    </div>
  );
};

export default Container;
