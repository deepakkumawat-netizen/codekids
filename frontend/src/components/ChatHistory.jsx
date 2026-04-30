import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const HISTORY_KEY = (userId, toolName) => `chat_history_${toolName}_${userId}`;

export const saveChatToHistory = (userId, toolName, toolLabel, code, response, language) => {
  const key = HISTORY_KEY(userId, toolName);
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const entry = {
    id: Date.now(),
    tool_name: toolLabel,
    preview: response.slice(0, 80) + (response.length > 80 ? '...' : ''),
    code,
    response,
    language,
    created_at: new Date().toISOString(),
  };
  const updated = [entry, ...existing].slice(0, 50);
  localStorage.setItem(key, JSON.stringify(updated));
};

const ChatHistory = ({ userId, toolName = "", isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!isOpen || !userId) return;
    const key = HISTORY_KEY(userId, toolName);
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    setChats(stored);
  }, [isOpen, userId, toolName]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffMins = Math.floor((Date.now() - date) / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY(userId, toolName));
    setChats([]);
  };

  const isDark = theme === 'dark';

  return (
    <div style={{
      position: 'fixed',
      right: 0, top: 0,
      width: 320, height: '100vh',
      background: isDark ? '#1a2332' : 'white',
      borderLeft: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
      boxShadow: `-2px 0 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 999,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: isDark
          ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
          : 'linear-gradient(135deg, #399aff 0%, #1a84ff 100%)',
        color: 'white',
      }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>💬 Chat History</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {chats.length > 0 && (
            <button onClick={clearHistory} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
              fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
            }}>Clear</button>
          )}
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'white',
            fontSize: 20, cursor: 'pointer', padding: 0,
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6,
          }}>✕</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {chats.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: isDark ? '#cbd5e1' : '#7a99c0' }}>
            <p>No chat history yet.</p>
            <p style={{ fontSize: 12, marginTop: 8, color: isDark ? '#94a3b8' : '#b8d4ff' }}>
              Use Explain, Debug, or Improve and your chats will appear here!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {chats.map((chat, i) => (
              <div key={chat.id || i} style={{
                display: 'flex', gap: 12, padding: 12, borderRadius: 10,
                background: isDark ? '#253549' : '#f7faff',
                border: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
              }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>💻</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, color: isDark ? '#e2e8f0' : '#1a2740',
                    fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', marginBottom: 4,
                  }}>{chat.tool_name || 'Chat'}</div>
                  <div style={{
                    fontSize: 12, color: isDark ? '#cbd5e1' : '#7a99c0',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4,
                  }}>{chat.preview || 'No preview'}</div>
                  <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#b8d4ff' }}>
                    {formatDate(chat.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
