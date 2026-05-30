import React, { useState, useEffect, useMemo } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8000' : window.location.origin;

const todayIso = () => new Date().toISOString().slice(0, 10);
const daysAgoIso = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

const formatDateTime = (s) => {
  if (!s) return '';
  const d = new Date(s.includes('Z') || s.includes('T') ? s : s.replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const sessionLabel = (sess, idx) => {
  if (!sess) return `Session ${idx + 1}`;
  const ts = sess.first_at ? formatDateTime(sess.first_at) : '';
  return ts ? `${ts} · ${sess.count} item${sess.count === 1 ? '' : 's'}` : `Session ${idx + 1}`;
};

// Persist a chat to the SQLite backend, tagged with the active login session_id.
// Falls back silently if the backend isn't reachable (offline / dev mode).
export const saveChatToHistory = async (userId, toolName, _toolLabel, code, response, language) => {
  try {
    await fetch(`${API_BASE}/api/save-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        session_id: localStorage.getItem('codekids_session_id') || null,
        tool_name: toolName,
        code,
        response,
        language: language || '',
      }),
    });
  } catch (e) {
    console.warn('saveChatToHistory:', e?.message || e);
  }
};

// ─── CHAT VIEWER MODAL ─────────────────────────────────────────────────────────
function ChatViewer({ chat, onClose }) {
  if (!chat) return null;
  const text = [
    `Tool: ${chat.tool_name || ''}`,
    `Language: ${chat.language || 'auto'}`,
    `Saved: ${formatDateTime(chat.created_at)}`,
    '',
    '=== CODE ===',
    chat.code || '',
    '',
    '=== AI RESPONSE ===',
    chat.response || '',
  ].join('\n');

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codekids-${chat.id || Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 15, maxW = pageW - margin * 2;
      let y = margin;
      text.split('\n').forEach(line => {
        if (y > pageH - margin) { doc.addPage(); y = margin; }
        const t = line;
        if (!t.trim()) { y += 4; return; }
        const isHeading = /^={3,}.*={3,}$/.test(t.trim());
        doc.setFont(isHeading ? 'helvetica' : 'courier', isHeading ? 'bold' : 'normal');
        doc.setFontSize(isHeading ? 11 : 9.5);
        doc.setTextColor(11, 27, 45);
        const wrapped = doc.splitTextToSize(t, maxW);
        if (y + wrapped.length * 5 > pageH - margin) { doc.addPage(); y = margin; }
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5 + 1.5;
      });
      doc.save(`codekids-${chat.id || Date.now()}.pdf`);
    };
    document.head.appendChild(script);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1500,
        background: 'rgba(2, 6, 23, 0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(820px, 100%)', height: 'min(86vh, 820px)',
          background: 'var(--bg-elevated, #fff)', color: 'var(--text, #111)',
          borderRadius: 14, boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          border: '1.5px solid var(--border, #e5e7eb)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '12px 16px',
          background: 'linear-gradient(135deg, var(--accent-blue, #5ea1ff) 0%, #3a7fe5 100%)',
          color: 'white', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>👶 {chat.tool_name || 'CodeKids'} · {chat.language || ''}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>{formatDateTime(chat.created_at)}</div>
          </div>
          <button onClick={downloadPdf} title="Download as PDF"
            style={{ background: 'white', color: '#dc2626', border: 'none', borderRadius: 8,
              padding: '6px 12px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>⬇ PDF</button>
          <button onClick={downloadTxt} title="Download as TXT"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#16a34a', border: 'none', borderRadius: 8,
              padding: '6px 10px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>TXT</button>
          <button onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
              width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
        <pre style={{
          flex: 1, margin: 0, padding: '20px 24px', overflow: 'auto',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: 13, lineHeight: 1.6,
          background: 'var(--bg, #fff)', color: 'var(--text, #111)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>{text}</pre>
      </div>
    </div>
  );
}

const ChatHistory = ({ userId, toolName = '', isOpen, onClose }) => {
  const [chats, setChats]       = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [sessionId, setSessionId] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chat-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, tool_name: toolName }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (_) { /* ignored */ }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(`${API_BASE}/api/chat-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          tool_name: toolName,
          date_from: dateFrom || null,
          date_to: dateTo || null,
          session_id: sessionId || null,
          limit: 100,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      } else {
        setError(`Failed to load history (${res.status})`);
      }
    } catch (e) {
      setError(`Connection error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!isOpen) return; fetchSessions(); fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId, toolName]);
  useEffect(() => { if (!isOpen) return; fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo, sessionId]);

  const sessionOptions = useMemo(() => sessions.map((s, i) => ({
    value: s.session_id, label: sessionLabel(s, i),
  })), [sessions]);

  const setPreset = (p) => {
    const t = todayIso();
    if (p === 'today')      { setDateFrom(t);             setDateTo(t); }
    else if (p === 'week')  { setDateFrom(daysAgoIso(7)); setDateTo(t); }
    else if (p === 'month') { setDateFrom(daysAgoIso(30));setDateTo(t); }
    else                    { setDateFrom('');            setDateTo(''); }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(2, 6, 23, 0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: 'min(720px, 100%)', height: 'min(86vh, 760px)',
            background: 'var(--bg-elevated, #fff)', color: 'var(--text, #111)',
            borderRadius: 14, boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            border: '1.5px solid var(--border, #e5e7eb)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, var(--accent-blue, #5ea1ff) 0%, #3a7fe5 100%)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>📋 CodeKids History</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                {loading ? 'Loading…' : `${chats.length} item${chats.length === 1 ? '' : 's'}`}
              </div>
            </div>
            <button onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>

          <div style={{
            padding: '12px 16px', borderBottom: '1.5px solid var(--border, #e5e7eb)',
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
            background: 'var(--bg, #f9fafb)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setPreset('today')} style={presetBtn}>Today</button>
              <button onClick={() => setPreset('week')}  style={presetBtn}>7d</button>
              <button onClick={() => setPreset('month')} style={presetBtn}>30d</button>
              <button onClick={() => setPreset('all')}   style={presetBtn}>All</button>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={dateInput} />
              <span style={{ fontSize: 12, color: 'var(--text-2, #6b7280)' }}>→</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={dateInput} />
            </div>
            <select value={sessionId} onChange={e => setSessionId(e.target.value)} style={{ ...dateInput, minWidth: 160 }}>
              <option value="">All sessions</option>
              {sessionOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {(dateFrom || dateTo || sessionId) && (
              <button onClick={() => { setDateFrom(''); setDateTo(''); setSessionId(''); }}
                style={{ ...presetBtn, color: '#ef4444', borderColor: '#fecaca' }}>Clear</button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {error && (
              <div style={{ padding: 12, background: '#ef444418', border: '1px solid #ef444455',
                color: '#ef4444', borderRadius: 8, fontSize: 13, marginBottom: 10 }}>⚠️ {error}</div>
            )}
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-2, #6b7280)' }}>Loading history…</div>
            ) : chats.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-2, #6b7280)' }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>No items match your filters.</p>
                <p style={{ fontSize: 12, marginTop: 6 }}>Run or explain some code — saved sessions will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {chats.map((c, i) => (
                  <div key={c.id || i}
                    onClick={() => setActiveChat(c)}
                    style={{
                      display: 'flex', gap: 12, padding: 12, borderRadius: 10,
                      background: 'var(--bg, #f9fafb)', cursor: 'pointer',
                      border: '1px solid var(--border, #e5e7eb)', transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-blue, #5ea1ff)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border, #e5e7eb)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <div style={{ fontSize: 22, flexShrink: 0 }}>💻</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {c.tool_name || 'session'} · {c.language || 'auto'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2, #6b7280)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        fontFamily: '"JetBrains Mono", monospace', marginTop: 2 }}>
                        {c.preview || 'No preview'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3, #9ca3af)', marginTop: 4 }}>
                        {formatDateTime(c.created_at)}
                      </div>
                    </div>
                    <div style={{ alignSelf: 'center', fontSize: 11, color: 'var(--accent-blue, #5ea1ff)', whiteSpace: 'nowrap', fontWeight: 700 }}>Open →</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeChat && <ChatViewer chat={activeChat} onClose={() => setActiveChat(null)} />}
    </>
  );
};

const presetBtn = {
  padding: '5px 10px', fontSize: 12, fontWeight: 600,
  background: 'var(--bg-elevated, #fff)', color: 'var(--text, #111)',
  border: '1px solid var(--border, #e5e7eb)', borderRadius: 6,
  cursor: 'pointer',
};
const dateInput = {
  padding: '5px 8px', fontSize: 12,
  background: 'var(--bg-elevated, #fff)', color: 'var(--text, #111)',
  border: '1px solid var(--border, #e5e7eb)', borderRadius: 6,
  fontFamily: 'inherit',
};

export default ChatHistory;
