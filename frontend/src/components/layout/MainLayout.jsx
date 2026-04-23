/**
 * MainLayout Component
 * Complete page layout with header, sidebar, and content area
 */

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({
  children,
  headerProps = {},
  sidebarProps = {},
  showSidebar = true,
  containerMaxWidth = 1400,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      {/* Header */}
      <Header
        onMenuClick={(isOpen) => setSidebarOpen(isOpen)}
        {...headerProps}
      />

      <div className="main-layout-container">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            {...sidebarProps}
          />
        )}

        {/* Main Content Area */}
        <main className={`main-content ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
          <div className="main-content-wrapper" style={{ maxWidth: containerMaxWidth }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
