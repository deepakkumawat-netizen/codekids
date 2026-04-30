import React, { useState, useEffect } from 'react';

const LIMIT = 50;
const KEY = (userId, toolName) => `usage_${toolName}_${userId}_${new Date().toLocaleDateString()}`;

const UsageCounter = ({ userId, toolName, refreshKey = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId || !toolName) return;
    const stored = parseInt(localStorage.getItem(KEY(userId, toolName)) || '0', 10);
    setCount(stored);
  }, [userId, toolName, refreshKey]);

  const exceeded = count >= LIMIT;
  const color = exceeded ? '#ef4444' : count >= 40 ? '#f59e0b' : '#10b981';

  return (
    <div style={{
      background: color,
      color: 'white',
      padding: '8px 14px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      display: 'inline-block',
      minWidth: '60px',
      textAlign: 'center',
      transition: 'all 0.2s'
    }}>
      {count}/{LIMIT}
    </div>
  );
};

export const incrementUsage = (userId, toolName) => {
  const key = `usage_${toolName}_${userId}_${new Date().toLocaleDateString()}`;
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  localStorage.setItem(key, current + 1);
};

export const checkUsageExceeded = (userId, toolName) => {
  const key = `usage_${toolName}_${userId}_${new Date().toLocaleDateString()}`;
  return parseInt(localStorage.getItem(key) || '0', 10) >= LIMIT;
};

export default UsageCounter;
