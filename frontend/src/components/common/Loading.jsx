/**
 * Loading Component
 * Spinner, skeleton loaders, and loading overlays
 */

import React from 'react';
import './Loading.css';

// Spinner Component
export const Spinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  const spinnerClass = [
    'spinner',
    `spinner-${size}`,
    `spinner-${color}`,
    fullScreen && 'spinner-full-screen',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={spinnerClass}></div>;
};

// Skeleton Loader Component
export const Skeleton = ({
  width = '100%',
  height = '20px',
  variant = 'text',  // text, circular, rectangular
  className = '',
}) => {
  const skeletonClass = [
    'skeleton',
    `skeleton-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={skeletonClass}
      style={{
        width,
        height: variant === 'circular' ? width : height,
      }}
    ></div>
  );
};

// Loading State Wrapper
export const LoadingWrapper = ({
  isLoading,
  children,
  loadingComponent = <Spinner size="lg" fullScreen={false} />,
  skeleton = false,
  skeletonHeight = '100px',
}) => {
  if (isLoading) {
    return skeleton ? (
      <Skeleton height={skeletonHeight} variant="rectangular" />
    ) : (
      loadingComponent
    );
  }

  return children;
};

// Loading Overlay (for content)
export const LoadingOverlay = ({
  isLoading,
  children,
  spinnerSize = 'lg',
  opacity = 0.7,
}) => {
  return (
    <div className="loading-overlay-container" style={{ position: 'relative' }}>
      {children}
      {isLoading && (
        <div className="loading-overlay" style={{ background: `rgba(0, 0, 0, ${opacity})` }}>
          <Spinner size={spinnerSize} color="primary" />
        </div>
      )}
    </div>
  );
};

// Card Skeleton (pre-made pattern)
export const CardSkeleton = () => (
  <div className="card-skeleton">
    <Skeleton height="180px" variant="rectangular" className="card-skeleton-image" />
    <div className="card-skeleton-content">
      <Skeleton height="24px" className="card-skeleton-title" />
      <Skeleton height="16px" className="card-skeleton-text" />
      <Skeleton height="16px" width="80%" className="card-skeleton-text" />
    </div>
  </div>
);

export default Spinner;
