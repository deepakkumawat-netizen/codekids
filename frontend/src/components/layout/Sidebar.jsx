/**
 * Sidebar Component
 * Navigation sidebar with collapsible items
 */

import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({
  items = [],           // Navigation items
  activeItem = null,    // Active item key
  onItemClick,
  collapsed = false,
  onCollapse,
  isOpen = true,        // For mobile
  onClose,
  variant = 'default',  // default, compact, minimal
}) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const sidebarClass = [
    'sidebar',
    `sidebar-${variant}`,
    collapsed && 'sidebar-collapsed',
    !isOpen && 'sidebar-closed',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Mobile Backdrop */}
      {!isOpen && (
        <div className="sidebar-backdrop" onClick={onClose}></div>
      )}

      <aside className={sidebarClass}>
        {/* Sidebar Header with Close Button */}
        <div className="sidebar-header">
          <h3 className="sidebar-title">Navigation</h3>
          <button
            className="sidebar-close-button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <ul className="sidebar-list">
            {items.map((item, idx) => (
              <li key={item.key || idx} className="sidebar-item">
                {item.children ? (
                  // Expandable Item
                  <>
                    <button
                      className={`sidebar-link ${
                        expandedItems[item.key || idx] ? 'expanded' : ''
                      }`}
                      onClick={() => toggleExpand(item.key || idx)}
                      aria-expanded={expandedItems[item.key || idx]}
                    >
                      {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                      <span className="sidebar-label">{item.label}</span>
                      <span className="sidebar-arrow">▼</span>
                    </button>

                    {expandedItems[item.key || idx] && (
                      <ul className="sidebar-sublist">
                        {item.children.map((child, childIdx) => (
                          <li key={child.key || childIdx} className="sidebar-subitem">
                            <a
                              href={child.href || '#'}
                              className={`sidebar-sublink ${
                                activeItem === child.key ? 'active' : ''
                              }`}
                              onClick={(e) => {
                                if (child.onClick) {
                                  e.preventDefault();
                                  child.onClick();
                                }
                                if (onItemClick) {
                                  onItemClick(child.key);
                                }
                              }}
                            >
                              {child.icon && <span className="sidebar-icon">{child.icon}</span>}
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // Regular Item
                  <a
                    href={item.href || '#'}
                    className={`sidebar-link ${activeItem === item.key ? 'active' : ''}`}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                      if (onItemClick) {
                        onItemClick(item.key);
                      }
                    }}
                  >
                    {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                    <span className="sidebar-label">{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="sidebar-footer">
            <button
              className="sidebar-collapse-button"
              onClick={onCollapse}
              title="Collapse sidebar"
            >
              ◀ Collapse
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
