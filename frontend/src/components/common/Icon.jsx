/**
 * Icon Component
 * Unified icon wrapper supporting emoji and SVG icons
 */

import React from 'react';
import './Icon.css';

const Icon = ({
  name,                    // Icon identifier or emoji
  size = 'md',            // xs, sm, md, lg, xl
  color = 'inherit',      // inherit, primary, success, warning, danger, text, text-secondary
  className = '',
  title,                  // Tooltip/accessibility title
  ...props
}) => {
  const iconClass = [
    'icon',
    `icon-${size}`,
    color !== 'inherit' && `icon-${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Common icon mappings (can be extended)
  const iconMap = {
    // Navigation
    'home': '🏠',
    'menu': '☰',
    'close': '✕',
    'back': '←',
    'forward': '→',

    // Actions
    'edit': '✎',
    'delete': '🗑',
    'save': '💾',
    'download': '⬇',
    'upload': '⬆',
    'search': '🔍',
    'filter': '⊙',
    'settings': '⚙',

    // Status
    'check': '✓',
    'cross': '✕',
    'warning': '⚠',
    'error': '⛔',
    'info': 'ℹ',
    'success': '✓',

    // Code
    'code': '{ }',
    'play': '▶',
    'stop': '⏹',
    'pause': '⏸',
    'refresh': '↻',

    // Social
    'share': '↗',
    'like': '👍',
    'comment': '💬',

    // Other
    'star': '⭐',
    'heart': '❤',
    'bell': '🔔',
    'lock': '🔒',
    'unlock': '🔓',
    'eye': '👁',
    'hide': '⊘',
    'user': '👤',
    'users': '👥',
    'chat': '💬',
  };

  // Resolve icon - if it's in the map, use it, otherwise assume it's a character/emoji
  const iconContent = typeof name === 'string' ? (iconMap[name] || name) : name;

  return (
    <span
      className={iconClass}
      title={title}
      role={title ? 'img' : undefined}
      aria-label={title}
      {...props}
    >
      {iconContent}
    </span>
  );
};

export default Icon;
