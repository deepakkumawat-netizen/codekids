/**
 * Header Component
 * Main navigation header with logo, menu, and theme toggle
 */

import React, { useState } from 'react';
import Button from '../common/Button';
import Icon from '../common/Icon';
import './Header.css';

const Header = ({
  onThemeToggle,
  currentTheme = 'light',
  onMenuClick,
  menuItems = [],
  logo = 'CodeKids',
  showMenu = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (onMenuClick) onMenuClick(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <a href="/" className="logo-link">
            <span className="logo-icon">💻</span>
            <span className="logo-text">{logo}</span>
          </a>
        </div>

        {/* Navigation Menu (Desktop) */}
        {showMenu && menuItems.length > 0 && (
          <nav className="header-nav-desktop">
            <ul className="nav-list">
              {menuItems.map((item, idx) => (
                <li key={idx} className="nav-item">
                  <a
                    href={item.href || '#'}
                    className={`nav-link ${item.active ? 'nav-link-active' : ''}`}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                  >
                    {item.icon && <span className="nav-icon">{item.icon}</span>}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Right Side: Actions */}
        <div className="header-actions">
          {/* Mobile Menu Button */}
          {showMenu && menuItems.length > 0 && (
            <button
              className="header-button mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && menuItems.length > 0 && mobileMenuOpen && (
        <nav className="header-nav-mobile">
          <ul className="nav-list">
            {menuItems.map((item, idx) => (
              <li key={idx} className="nav-item">
                <a
                  href={item.href || '#'}
                  className={`nav-link ${item.active ? 'nav-link-active' : ''}`}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.icon && <span className="nav-icon">{item.icon}</span>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
