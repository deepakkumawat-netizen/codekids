import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const API_BASE = "http://localhost:7000";

const ChatHistory = ({ userId, toolName = "", isOpen, onClose, onSelectChat, apiUrl = API_BASE }) => {
  const { theme } = useContext(ThemeContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChatHistory = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      console.log('[ChatHistory] Fetching for user:', userId, 'tool:', toolName);

      const response = await fetch(`${apiUrl}/api/chat-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, tool_name: toolName })
      });

      console.log('[ChatHistory] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[ChatHistory] Fetched data:', data);
        setChats(data.chats || []);
      } else {
        const errorText = await response.text();
        console.error('[ChatHistory] API error:', response.status, errorText);
        setError(`Failed to load chat history (${response.status})`);
      }
    } catch (error) {
      console.error('[ChatHistory] Error fetching chat history:', error);
      setError(`Connection error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, userId, toolName]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isDark = theme === 'dark';

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: 320,
      height: '100vh',
      background: isDark ? '#1a2332' : 'white',
      borderLeft: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
      boxShadow: `-2px 0 8px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out, background 0.3s, border-color 0.3s',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: isDark ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : 'linear-gradient(135deg, #399aff 0%, #1a84ff 100%)',
        color: 'white',
        transition: 'background 0.3s, border-color 0.3s'
      }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>💬 Chat History</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            padding: 0,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px'
      }}>
        {error && (
          <div style={{
            padding: 12,
            background: isDark ? '#7f1d1d' : '#fee2e2',
            borderRadius: 8,
            margin: 8,
            color: isDark ? '#fee2e2' : '#991b1b',
            fontSize: 12,
            transition: 'background 0.3s, color 0.3s'
          }}>
            ⚠️ {error}
          </div>
        )}
        {loading ? (
          <div style={{
            padding: 48,
            textAlign: 'center',
            color: isDark ? '#cbd5e1' : '#7a99c0',
            transition: 'color 0.3s'
          }}>
            Loading history...
          </div>
        ) : chats.length === 0 ? (
          <div style={{
            padding: 48,
            textAlign: 'center',
            color: isDark ? '#cbd5e1' : '#7a99c0',
            transition: 'color 0.3s'
          }}>
            <p>No chat history yet.</p>
            <p style={{
              fontSize: 12,
              color: isDark ? '#94a3b8' : '#b8d4ff',
              marginTop: 8,
              transition: 'color 0.3s'
            }}>
              Start using tools and your recent chats will appear here!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {chats.map((chat, i) => (
              <div
                key={chat.id || i}
                onClick={() => onSelectChat && onSelectChat(chat)}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: 12,
                  borderRadius: 10,
                  background: isDark ? '#253549' : '#f7faff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${isDark ? '#334155' : '#ddeaff'}`,
                  userSelect: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDark ? '#2d4563' : '#e8f3ff';
                  e.currentTarget.style.borderColor = isDark ? '#06b6d4' : '#399aff';
                  e.currentTarget.style.transform = 'translateX(-4px)';
                  e.currentTarget.style.boxShadow = isDark ? '0 2px 4px rgba(6, 182, 212, 0.2)' : '0 2px 4px rgba(57, 154, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDark ? '#253549' : '#f7faff';
                  e.currentTarget.style.borderColor = isDark ? '#334155' : '#ddeaff';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 20, flexShrink: 0 }}>💻</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600,
                    color: isDark ? '#e2e8f0' : '#1a2740',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 4,
                    transition: 'color 0.3s'
                  }}>
                    {chat.tool_name || 'Chat'}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: isDark ? '#cbd5e1' : '#7a99c0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 4,
                    transition: 'color 0.3s'
                  }}>
                    {chat.preview || 'No preview'}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: isDark ? '#94a3b8' : '#b8d4ff',
                    transition: 'color 0.3s'
                  }}>
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
