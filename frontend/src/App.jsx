import { useState, useRef, useEffect, useContext } from 'react'
import './index.css'
import UsageCounter from './components/UsageCounter'
import ChatHistory from './components/ChatHistory'
import { ThemeContext } from './context/ThemeContext'

const LANGUAGES = [
  { value: 'python',     label: 'Python',     ext: 'py',   default: '# Welcome to CodeKids!\nprint("Hello, World!")' },
  { value: 'javascript', label: 'JavaScript', ext: 'js',   default: '// Welcome to CodeKids!\nconsole.log("Hello, World!");' },
  { value: 'java',       label: 'Java',       ext: 'java', default: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}' },
  { value: 'cpp',        label: 'C++',        ext: 'cpp',  default: '#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}' },
  { value: 'go',         label: 'Go',         ext: 'go',   default: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, World!")\n}' },
]

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

const AI_ACTIONS = [
  { id: 'explain', label: 'Explain',  emoji: '📖', endpoint: '/api/explain' },
  { id: 'debug',   label: 'Debug',    emoji: '🔍', endpoint: '/api/debug'   },
  { id: 'improve', label: 'Improve',  emoji: '✨', endpoint: '/api/improve' },
  { id: 'analyze', label: 'Analyze',  emoji: '📊', endpoint: '/api/analyze/search' },
]

export default function App() {
  const [language, setLanguage]     = useState(LANGUAGES[0])
  const [grade, setGrade]           = useState('6')
  const [code, setCode]             = useState(LANGUAGES[0].default)
  const [output, setOutput]         = useState('')
  const [outputError, setOutputError] = useState(false)
  const [isRunning, setIsRunning]   = useState(false)
  const [activePanel, setActivePanel] = useState('output')
  const [aiMode, setAiMode]         = useState(null)
  const [aiResult, setAiResult]     = useState('')
  const [aiLoading, setAiLoading]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [userId] = useState(() => {
    const stored = localStorage.getItem('codekids_user_id')
    if (stored) return stored
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('codekids_user_id', newId)
    return newId
  })
  const [showHistory, setShowHistory] = useState(false)
  const [usageRefresh, setUsageRefresh] = useState(0)
  const [chatHistory, setChatHistory] = useState([])
  const { theme, toggleTheme } = useContext(ThemeContext)

  const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:7000'
    : window.location.origin

  const saveAndTrack = async (toolName, codeText, response, lang) => {
    try {
      await Promise.all([
        fetch(`${apiUrl}/api/save-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, tool_name: toolName, code: codeText, response, language: lang })
        }),
        fetch(`${apiUrl}/api/increment-usage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, tool_name: toolName })
        })
      ])
      setUsageRefresh(n => n + 1)
    } catch (e) {
      console.error('Failed to track usage:', e)
    }
  }
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)

  const lines = code.split('\n').length

  // Voice input for search
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice search not supported in your browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.language = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      console.log('Listening for voice input...')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript.toLowerCase())
      // Auto-search after voice input
      setTimeout(() => {
        const submitEvent = new Event('submit', { bubbles: true })
        document.querySelector('.ai-search')?.dispatchEvent(submitEvent)
      }, 300)
    }

    recognition.onerror = (event) => {
      console.error('Voice error:', event.error)
    }

    recognition.start()
  }

  // Auto-dismiss error notifications after 2 seconds
  useEffect(() => {
    if (outputError) {
      const timer = setTimeout(() => {
        setOutput('')
        setOutputError(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [outputError])

  // Auto-dismiss AI error messages after 2 seconds
  useEffect(() => {
    if (aiResult && aiResult.startsWith('Error:')) {
      const timer = setTimeout(() => {
        setAiResult('')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [aiResult])

  // Sync line numbers scroll with textarea scroll
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleLanguageChange = (e) => {
    const lang = LANGUAGES.find(l => l.value === e.target.value)
    setLanguage(lang)
    setCode(lang.default)
    setOutput('')
    setAiResult('')
    setAiMode(null)
    setOutputError(false)
    setChatHistory([])
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('Running…')
    setOutputError(false)
    setActivePanel('output')
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: language.value }),
      })
      const data = await res.json()
      if (data.stderr) {
        setOutput(data.stderr)
        setOutputError(true)
      } else {
        setOutput(data.stdout || '(No output)')
        setOutputError(false)
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`)
      setOutputError(true)
    } finally {
      setIsRunning(false)
    }
  }

  const handleAI = async (action) => {
    setAiMode(action.id)
    setActivePanel('ai')

    // For analyze, show search bar instead of calling API immediately
    if (action.id === 'analyze') {
      setSearchQuery('')
      setSearchResults(null)
      setAiLoading(false)
      return
    }

    // For other tools, code is required
    if (!code.trim()) return

    setAiLoading(true)
    setAiResult('')
    try {
      const res = await fetch(action.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: language.value, grade_level: grade, history: chatHistory }),
      })
      const data = await res.json()

      let resultText = ''
      if (data.explanation) {
        resultText = data.explanation
      } else {
        const parts = []
        if (data.definition && data.definition.length > 100)  parts.push(data.definition)
        if (data.keyPoints?.length) parts.push('Key Points:\n' + data.keyPoints.join('\n'))
        if (data.example)     parts.push(`Example:\n${data.example}`)
        if (data.summary)     parts.push(`Summary:\n${data.summary}`)
        if (data.problem_identified) parts.push(`Problem: ${data.problem_identified}`)
        if (data.guiding_questions?.length) parts.push('Questions to think about:\n' + data.guiding_questions.join('\n'))
        if (data.hint)        parts.push(`Hint: ${data.hint}`)
        const flat = data.solution || data.response || data.message
        resultText = parts.length ? parts.join('\n\n') : flat || 'No response'
      }
      setAiResult(resultText)
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: `[${action.label}] ${language.value} code:\n\`\`\`\n${code.slice(0, 400)}\n\`\`\`` },
        { role: 'assistant', content: resultText.slice(0, 800) }
      ])
      saveAndTrack(action.id, code, resultText, language.value)
    } catch (err) {
      setAiResult(`Error: ${err.message}`)
    } finally {
      setAiLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setAiLoading(true)
    try {
      const res = await fetch('/api/analyze/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, grade_level: grade }),
      })
      const data = await res.json()
      setSearchResults(data)
      const resultText = data.results.map(r => `${r.topic}: ${r.definition}`).join('\n\n')
      setAiResult(resultText)
      saveAndTrack('analyze', searchQuery, resultText, language.value)
    } catch (err) {
      setAiResult(`Search error: ${err.message}`)
    } finally {
      setAiLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const next = code.substring(0, start) + '  ' + code.substring(end)
      setCode(next)
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      })
    }
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="logo">
          <span className="logo-bracket">&lt;/&gt;</span>
          <span className="logo-name">CodeKids</span>
        </div>

        <div className="header-controls">
          <div className="ctrl-group">
            <span className="ctrl-label">Language</span>
            <select className="ctrl-select" value={language.value} onChange={handleLanguageChange}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          <div className="ctrl-group">
            <span className="ctrl-label">Grade</span>
            <select className="ctrl-select ctrl-select--grade" value={grade} onChange={e => setGrade(e.target.value)}>
              {GRADES.map(g => <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `Grade ${g}`}</option>)}
            </select>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: '#399aff',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              marginLeft: '12px'
            }}
          >
            💬 History
          </button>

          <div style={{ marginLeft: '12px' }}>
            <UsageCounter userId={userId} toolName="codekids" apiUrl={apiUrl} refreshKey={usageRefresh} />
          </div>

          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-hover)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              marginLeft: '12px',
              transition: 'all 0.3s ease'
            }}
            title="Toggle dark/light mode"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="workspace">
        {/* Editor */}
        <div className="editor-pane">
          <div className="editor-bar">
            <span className="file-tab active-tab">main.{language.ext}</span>
            <span className="editor-meta">{lines} {lines === 1 ? 'line' : 'lines'}</span>
          </div>
          <div className="editor-body">
            <div className="line-numbers" ref={lineNumbersRef} aria-hidden="true">
              {Array.from({ length: lines }, (_, i) => (
                <div className="ln" key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="code-area"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
            />
            <button className="run-btn run-btn-corner" onClick={handleRun} disabled={isRunning}>
              {isRunning
                ? <><span className="spin" /> Running…</>
                : <><span className="run-icon">▶</span> Run</>
              }
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="side-pane">
          <div className="side-tabs">
            <button
              className={`side-tab ${activePanel === 'output' ? 'side-tab--active' : ''}`}
              onClick={() => setActivePanel('output')}
            >
              Output
            </button>
            <button
              className={`side-tab ${activePanel === 'ai' ? 'side-tab--active' : ''}`}
              onClick={() => setActivePanel('ai')}
            >
              AI Help
            </button>
          </div>

          {/* Output */}
          {activePanel === 'output' && (
            <div className="side-content">
              {output ? (
                <pre className={`output-box ${outputError ? 'output-box--error' : 'output-box--success'}`}>
                  {output}
                </pre>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">▶</span>
                  <p>Click <strong>Run</strong> to see your output here</p>
                </div>
              )}
            </div>
          )}

          {/* AI Help */}
          {activePanel === 'ai' && (
            <div className="side-content">
              <div className="ai-grid">
                {AI_ACTIONS.map(action => (
                  <button
                    key={action.id}
                    className={`ai-btn ${aiMode === action.id ? 'ai-btn--active' : ''}`}
                    onClick={() => handleAI(action)}
                    disabled={aiLoading}
                  >
                    <span className="ai-btn-emoji">{action.emoji}</span>
                    <span className="ai-btn-label">{action.label}</span>
                  </button>
                ))}
              </div>

              {aiLoading && (
                <div className="ai-loading">
                  <span className="spin spin--dark" />
                  <span>Thinking…</span>
                </div>
              )}

              {aiResult && !aiLoading && (
                <div className="ai-result">
                  <div className="ai-result-header">
                    {AI_ACTIONS.find(a => a.id === aiMode)?.emoji}{' '}
                    {AI_ACTIONS.find(a => a.id === aiMode)?.label}
                  </div>
                  <div className="ai-result-body">
                    {aiMode === 'debug' ? (
                      // Debug tool - Show errors in red, solutions in green
                      <div className="debug-content">
                        {aiResult.split('\n\n').map((section, idx) => {
                          const isError = section.toLowerCase().includes('error') || section.toLowerCase().includes('problem')
                          const isSolution = section.toLowerCase().includes('try') || section.toLowerCase().includes('fix') || section.toLowerCase().includes('hint')

                          return (
                            <div key={idx} className="debug-section">
                              {isError && (
                                <div className="debug-error-header">
                                  <span className="ai-chip ai-chip-error">❌ Error</span>
                                </div>
                              )}
                              {isSolution && (
                                <div className="debug-solution-header">
                                  <span className="ai-chip ai-chip-solution">✓ Solution</span>
                                </div>
                              )}
                              <div className={`debug-text ${isError ? 'error-text' : isSolution ? 'solution-text' : ''}`}>
                                {section.split('\n').map((line, j) => (
                                  <p key={j} className="ai-line">{line}</p>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      // Other tools - Standard colored chips formatting
                      aiResult.split('\n\n').map((paragraph, i) => (
                        <div key={i} className="ai-paragraph">
                          {paragraph.split('\n').map((line, j) => {
                            // Format section headers with colored chips
                            if (line.match(/^#{1,3}\s|^[A-Z][A-Z\s]+:$/)) {
                              return (
                                <div key={j} className="ai-section-header">
                                  <span className={`ai-chip ai-chip-${i % 5}`}>
                                    {line.replace(/^#+\s/, '').replace(/:$/, '')}
                                  </span>
                                </div>
                              )
                            }
                            // Format bullet points
                            if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                              return (
                                <div key={j} className="ai-bullet">
                                  • {line.replace(/^[-•]\s?/, '')}
                                </div>
                              )
                            }
                            // Format code blocks
                            if (line.trim().startsWith('```')) {
                              return null
                            }
                            return (
                              <p key={j} className="ai-line">
                                {line}
                              </p>
                            )
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Search Interface for Analyze Tool */}
              {aiMode === 'analyze' && (
                <>
                  <form onSubmit={handleSearch} className="ai-search">
                    <input
                      type="text"
                      className="ai-search-input"
                      placeholder="Search topics: variables, loop, function, array, string, etc."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button type="button" className="ai-search-voice" onClick={handleVoiceSearch} title="Search by voice">
                      🎤
                    </button>
                    <button type="submit" className="ai-search-btn" disabled={!searchQuery.trim()}>
                      Search
                    </button>
                  </form>
                  {!aiResult && !aiLoading && (
                    <p className="ai-hint">Try searching: variables, loop, function, array, string, conditionals, data types, recursion, object, class, algorithm, debugging</p>
                  )}
                </>
              )}

              {!aiResult && !aiLoading && aiMode !== 'analyze' && (
                <p className="ai-hint">Choose an option above to get AI-powered help with your code.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <ChatHistory userId={userId} toolName="codekids" isOpen={showHistory} onClose={() => setShowHistory(false)} apiUrl={apiUrl} />
    </div>
  )
}
