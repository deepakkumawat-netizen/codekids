import React, { useState, useEffect } from 'react';

const UsageCounter = ({ userId, toolName, apiUrl = "http://localhost:7000", refreshKey = 0 }) => {
  const [usage, setUsage] = useState({ usage_count: 0, limit: 50, remaining: 50, exceeded: false });
  const [loading, setLoading] = useState(false);

  const fetchUsage = async () => {
    if (!userId || !toolName) return;

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/check-usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, tool_name: toolName })
      });

      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [userId, toolName, refreshKey]);

  const color = usage.exceeded ? '#ef4444' : usage.usage_count >= 40 ? '#f59e0b' : '#10b981';

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
      {usage.usage_count}/{usage.limit}
    </div>
  );
};

export default UsageCounter;
