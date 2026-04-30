import { useState, useRef, useEffect, useContext } from 'react'
import './index.css'
import UsageCounter, { incrementUsage, checkUsageExceeded } from './components/UsageCounter'
import ChatHistory, { saveChatToHistory } from './components/ChatHistory'
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

// ── GAMIFICATION ─────────────────────────────────────────────────────────────

const BADGES = [
  { id: 'first_run',    icon: '🚀', name: 'First Launch',    desc: 'Run your first program',        check: g => g.runs >= 1 },
  { id: 'explorer',     icon: '💻', name: 'Explorer',         desc: 'Run code 5 times',              check: g => g.runs >= 5 },
  { id: 'speed_coder',  icon: '⚡', name: 'Speed Coder',      desc: 'Run code 25 times',             check: g => g.runs >= 25 },
  { id: 'bug_hunter',   icon: '🔍', name: 'Bug Hunter',       desc: 'Debug 3 times',                 check: g => (g.aiUses?.debug || 0) >= 3 },
  { id: 'debug_master', icon: '🧙', name: 'Debug Master',     desc: 'Debug 10 times',                check: g => (g.aiUses?.debug || 0) >= 10 },
  { id: 'student',      icon: '📖', name: 'Student',          desc: 'Explain code 3 times',          check: g => (g.aiUses?.explain || 0) >= 3 },
  { id: 'polisher',     icon: '✨', name: 'Polisher',         desc: 'Improve code 3 times',          check: g => (g.aiUses?.improve || 0) >= 3 },
  { id: 'polyglot',     icon: '🌍', name: 'Polyglot',         desc: 'Code in 3 different languages', check: g => (g.languages?.length || 0) >= 3 },
  { id: 'all_langs',    icon: '🌟', name: 'Language Master',  desc: 'Use all 5 languages',           check: g => (g.languages?.length || 0) >= 5 },
  { id: 'challenger',   icon: '🎯', name: 'Daily Challenger', desc: 'Complete first challenge',      check: g => (g.dailyChallenges || 0) >= 1 },
  { id: 'streak3',      icon: '🏆', name: 'Challenge Streak', desc: 'Complete 3 challenges',         check: g => (g.dailyChallenges || 0) >= 3 },
  { id: 'hot100',       icon: '🔥', name: 'Hot Streak',       desc: 'Earn 100 points',               check: g => (g.points || 0) >= 100 },
  { id: 'pro500',       icon: '💎', name: 'Pro Coder',         desc: 'Earn 500 points',               check: g => (g.points || 0) >= 500 },
  { id: 'legend',       icon: '👑', name: 'CodeKids Legend',  desc: 'Earn 1000 points',              check: g => (g.points || 0) >= 1000 },
]

const DAILY_CHALLENGES = [
  { title: 'Hello CodeKids!', desc: 'Print exactly: Hello, CodeKids!', expected: 'Hello, CodeKids!', starter: 'print("Hello, CodeKids!")' },
  { title: 'Count to 5',      desc: 'Print numbers 1 through 5, one per line.', expected: '1\n2\n3\n4\n5', starter: 'for i in range(1, 6):\n    print(i)' },
  { title: 'Sum to 10',       desc: 'Print the sum of 1+2+3+4+5+6+7+8+9+10 (answer: 55).', expected: '55', starter: 'print(sum(range(1, 11)))' },
  { title: 'Even Numbers',    desc: 'Print all even numbers from 2 to 10 (one per line).', expected: '2\n4\n6\n8\n10', starter: 'for i in range(2, 11, 2):\n    print(i)' },
  { title: 'Reverse a Word',  desc: 'Print "Python" reversed — should print: nohtyP', expected: 'nohtyP', starter: 'word = "Python"\nprint(word[::-1])' },
  { title: 'Stars!',          desc: 'Print exactly 5 stars on one line: *****', expected: '*****', starter: 'print("*" * 5)' },
  { title: 'Odd or Even',     desc: 'Print "Even" if 42 is even, "Odd" if not.', expected: 'Even', starter: 'n = 42\nprint("Even" if n % 2 == 0 else "Odd")' },
  { title: 'Max of Three',    desc: 'Print the largest of 15, 7, and 23 — should be: 23', expected: '23', starter: 'print(max(15, 7, 23))' },
  { title: 'List Length',     desc: 'Print the count of items in [10,20,30,40,50] — should be 5.', expected: '5', starter: 'nums = [10, 20, 30, 40, 50]\nprint(len(nums))' },
  { title: 'Fahrenheit!',     desc: 'Convert 100°C to Fahrenheit and print it (answer: 212.0).', expected: '212.0', starter: 'c = 100\nprint(c * 9/5 + 32)' },
  { title: 'Squares!',        desc: 'Print squares of 1–5 (1, 4, 9, 16, 25) one per line.', expected: '1\n4\n9\n16\n25', starter: 'for i in range(1, 6):\n    print(i ** 2)' },
  { title: 'FizzBuzz 1–5',    desc: 'FizzBuzz for 1–5: Fizz for 3, Buzz for 5, else number.', expected: '1\n2\nFizz\n4\nBuzz', starter: 'for i in range(1, 6):\n    if i%3==0: print("Fizz")\n    elif i%5==0: print("Buzz")\n    else: print(i)' },
  { title: 'Factorial 5',     desc: 'Print 5! (5 factorial = 120).', expected: '120', starter: 'import math\nprint(math.factorial(5))' },
  { title: 'Palindrome?',     desc: 'Print "Yes" if "racecar" is a palindrome, "No" if not.', expected: 'Yes', starter: 'w = "racecar"\nprint("Yes" if w == w[::-1] else "No")' },
]

const GAMI_KEY = 'codekids_gamification_v2'

function loadGami() {
  try { return JSON.parse(localStorage.getItem(GAMI_KEY)) || {} } catch { return {} }
}
function saveGami(g) { localStorage.setItem(GAMI_KEY, JSON.stringify(g)) }

function addPoints(g, pts) {
  const today = new Date().toLocaleDateString()
  const next = { ...g, points: (g.points || 0) + pts, todayPoints: (g.lastDate === today ? (g.todayPoints || 0) : 0) + pts, lastDate: today }
  saveGami(next); return next
}

function trackRun(g, lang) {
  const langs = new Set(g.languages || [])
  langs.add(lang)
  const next = { ...g, runs: (g.runs || 0) + 1, languages: [...langs] }
  return addPoints(next, 5)
}

function trackAI(g, toolId) {
  const aiUses = { ...(g.aiUses || {}), [toolId]: ((g.aiUses?.[toolId] || 0) + 1) }
  const pts = { explain: 10, debug: 15, improve: 10, analyze: 5 }[toolId] || 5
  const next = { ...g, aiUses }
  return addPoints(next, pts)
}

function checkNewBadges(prev, next) {
  const already = new Set(prev.badges || [])
  const earned = BADGES.filter(b => !already.has(b.id) && b.check(next)).map(b => b.id)
  if (!earned.length) return { next, newBadges: [] }
  const updated = { ...next, badges: [...(next.badges || []), ...earned] }
  saveGami(updated)
  return { next: updated, newBadges: earned.map(id => BADGES.find(b => b.id === id)) }
}

const LEADERBOARD_SEEDS = [
  { name: 'Alex K.',   pts: 1240 },
  { name: 'Priya S.',  pts: 980 },
  { name: 'Jordan T.', pts: 740 },
  { name: 'Sam W.',    pts: 560 },
  { name: 'Maya R.',   pts: 420 },
  { name: 'Chris L.',  pts: 310 },
  { name: 'Zoe P.',    pts: 190 },
]

function BadgeToast({ badges, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t) }, [])
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
      {badges.map(b => (
        <div key={b.id} style={{
          background:'linear-gradient(135deg,#1e3a5f,#0f2847)', border:'1.5px solid #399aff',
          borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:12,
          boxShadow:'0 8px 32px rgba(57,154,255,0.3)', animation:'slideUp 0.4s ease',
          minWidth:240,
        }}>
          <span style={{ fontSize:32 }}>{b.icon}</span>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'0.8px' }}>Badge Unlocked!</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>{b.name}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{b.desc}</div>
          </div>
        </div>
      ))}
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

function RewardsPanel({ gami }) {
  const [tab, setTab] = useState('badges')
  const todayIdx = Math.floor(Date.now() / 86400000) % DAILY_CHALLENGES.length
  const challenge = DAILY_CHALLENGES[todayIdx]
  const alreadyDone = gami.lastChallenge === new Date().toLocaleDateString()

  const leaderboard = [...LEADERBOARD_SEEDS, { name: 'You', pts: gami.points || 0 }]
    .sort((a, b) => b.pts - a.pts)

  const userRank = leaderboard.findIndex(e => e.name === 'You') + 1
  const unlockedIds = new Set(gami.badges || [])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Sub-tabs */}
      <div style={{ display:'flex', gap:4, padding:'10px 10px 0', borderBottom:'1.5px solid var(--border)' }}>
        {[['badges','🏅 Badges'],['challenge','📅 Challenge'],['leaderboard','🏆 Board']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1, padding:'7px 4px', borderRadius:'8px 8px 0 0', border:'none',
            background: tab===id ? 'var(--bg-hover)' : 'transparent',
            color: tab===id ? 'var(--text)' : 'var(--text-muted, #888)',
            fontWeight: tab===id ? 700 : 500, fontSize:12, cursor:'pointer',
            borderBottom: tab===id ? '2px solid #399aff' : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'12px' }}>

        {/* BADGES TAB */}
        {tab === 'badges' && (
          <div>
            <div style={{ fontSize:12, color:'var(--text-muted,#888)', marginBottom:12, fontWeight:600 }}>
              {unlockedIds.size} / {BADGES.length} badges • {gami.points || 0} pts
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {BADGES.map(b => {
                const unlocked = unlockedIds.has(b.id)
                return (
                  <div key={b.id} title={b.desc} style={{
                    padding:'10px 10px', borderRadius:12, textAlign:'center',
                    background: unlocked ? 'rgba(57,154,255,0.12)' : 'var(--bg-hover)',
                    border: `1.5px solid ${unlocked ? '#399aff' : 'var(--border)'}`,
                    opacity: unlocked ? 1 : 0.45, transition:'all 0.2s',
                  }}>
                    <div style={{ fontSize:26, filter: unlocked?'none':'grayscale(1)' }}>{b.icon}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--text)', marginTop:4, lineHeight:1.2 }}>{b.name}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted,#888)', marginTop:2 }}>{b.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CHALLENGE TAB */}
        {tab === 'challenge' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>📅 Today's Challenge</div>
              {alreadyDone && <span style={{ fontSize:11, color:'#22c55e', fontWeight:700, background:'rgba(34,197,94,0.12)', padding:'3px 8px', borderRadius:20 }}>✓ Done today!</span>}
            </div>
            <div style={{ background:'rgba(57,154,255,0.08)', border:'1.5px solid #399aff', borderRadius:12, padding:'14px 16px' }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#399aff', marginBottom:6 }}>{challenge.title}</div>
              <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.5 }}>{challenge.desc}</div>
            </div>
            <div style={{ fontSize:12, color:'var(--text-muted,#888)' }}>
              💡 Write your solution in the editor (Python), then click <strong>Submit Challenge</strong> below.
            </div>
            <div style={{ background:'var(--bg-hover)', borderRadius:10, padding:'10px 14px', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted,#888)', marginBottom:6 }}>STARTER CODE</div>
              <pre style={{ margin:0, fontSize:12, color:'#399aff', fontFamily:'monospace', whiteSpace:'pre-wrap' }}>{challenge.starter}</pre>
            </div>
            <div style={{ fontSize:12, color:'var(--text-muted,#888)' }}>Reward: <strong style={{ color:'#f59e0b' }}>+50 pts</strong> + badge progress</div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === 'leaderboard' && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:12, color:'var(--text-muted,#888)', fontWeight:600, marginBottom:4 }}>Your rank: #{userRank}</div>
            {leaderboard.map((entry, i) => {
              const isMe = entry.name === 'You'
              const medal = ['🥇','🥈','🥉'][i] || `#${i+1}`
              return (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:12,
                  background: isMe ? 'rgba(57,154,255,0.15)' : 'var(--bg-hover)',
                  border: `1.5px solid ${isMe ? '#399aff' : 'var(--border)'}`,
                }}>
                  <span style={{ fontSize:18, minWidth:28, textAlign:'center' }}>{medal}</span>
                  <span style={{ flex:1, fontSize:13, fontWeight: isMe?800:600, color:'var(--text)' }}>{entry.name}</span>
                  <span style={{ fontSize:14, fontWeight:800, color: isMe?'#399aff':'var(--text-muted,#888)' }}>{entry.pts} pts</span>
                </div>
              )
            })}
            <div style={{ fontSize:11, color:'var(--text-muted,#888)', textAlign:'center', marginTop:8 }}>Run code & use AI tools to earn points!</div>
          </div>
        )}
      </div>
    </div>
  )
}

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

  const [gami, setGami] = useState(() => loadGami())
  const [newBadges, setNewBadges] = useState([])

  const updateGami = (next) => {
    const { next: updated, newBadges: earned } = checkNewBadges(gami, next)
    setGami(updated)
    if (earned.length) setNewBadges(earned)
  }

  const saveAndTrack = (toolId, codeText, response, lang) => {
    const toolLabel = AI_ACTIONS.find(a => a.id === toolId)?.label || toolId
    saveChatToHistory(userId, 'codekids', toolLabel, codeText, response, lang)
    incrementUsage(userId, 'codekids')
    setUsageRefresh(n => n + 1)
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
      updateGami(trackRun(gami, language.value))
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
      updateGami(trackAI(gami, action.id))
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

  const handleSubmitChallenge = async () => {
    const todayIdx = Math.floor(Date.now() / 86400000) % DAILY_CHALLENGES.length
    const challenge = DAILY_CHALLENGES[todayIdx]
    const today = new Date().toLocaleDateString()
    if (gami.lastChallenge === today) { alert('Already completed today\'s challenge! Come back tomorrow.'); return }
    setIsRunning(true)
    setActivePanel('output')
    try {
      const res = await fetch('/api/run', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'python' }),
      })
      const data = await res.json()
      const actual = (data.stdout || '').trim()
      const expected = challenge.expected.trim()
      if (actual === expected) {
        setOutput(`✅ Challenge complete!\nOutput: ${actual}`)
        setOutputError(false)
        const next = { ...gami, lastChallenge: today, dailyChallenges: (gami.dailyChallenges || 0) + 1 }
        updateGami(addPoints(next, 50))
      } else {
        setOutput(`❌ Not quite!\nYour output: ${actual}\nExpected:    ${expected}`)
        setOutputError(true)
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`); setOutputError(true)
    } finally {
      setIsRunning(false)
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
            onClick={() => setActivePanel(p => p === 'rewards' ? 'output' : 'rewards')}
            style={{
              background: activePanel === 'rewards' ? '#f59e0b' : 'linear-gradient(135deg,#f59e0b,#d97706)',
              color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '700', marginLeft: '12px',
              boxShadow: activePanel === 'rewards' ? 'none' : '0 2px 8px rgba(245,158,11,0.4)',
            }}
          >
            🏆 {gami.points || 0} pts
          </button>

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
            <UsageCounter userId={userId} toolName="codekids" refreshKey={usageRefresh} />
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
            <button
              className={`side-tab ${activePanel === 'rewards' ? 'side-tab--active' : ''}`}
              onClick={() => setActivePanel('rewards')}
            >
              🏆 Rewards
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
          {/* Rewards Panel */}
          {activePanel === 'rewards' && (
            <div className="side-content" style={{ padding:0, overflow:'hidden', display:'flex', flexDirection:'column', height:'100%' }}>
              <RewardsPanel gami={gami} />
              <div style={{ padding:'10px 12px', borderTop:'1.5px solid var(--border)', flexShrink:0 }}>
                <button
                  onClick={handleSubmitChallenge}
                  disabled={isRunning || gami.lastChallenge === new Date().toLocaleDateString()}
                  style={{
                    width:'100%', padding:'10px', borderRadius:10, border:'none',
                    background: gami.lastChallenge === new Date().toLocaleDateString() ? 'var(--bg-hover)' : 'linear-gradient(135deg,#f59e0b,#d97706)',
                    color: gami.lastChallenge === new Date().toLocaleDateString() ? 'var(--text-muted,#888)' : 'white',
                    fontWeight:700, fontSize:13, cursor: gami.lastChallenge === new Date().toLocaleDateString() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {gami.lastChallenge === new Date().toLocaleDateString() ? '✓ Challenge Done Today' : '🎯 Submit Challenge (+50 pts)'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatHistory userId={userId} toolName="codekids" isOpen={showHistory} onClose={() => setShowHistory(false)} />
      {newBadges.length > 0 && <BadgeToast badges={newBadges} onDone={() => setNewBadges([])} />}
    </div>
  )
}
