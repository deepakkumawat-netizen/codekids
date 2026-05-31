import React, { useContext, useState, useEffect } from 'react'
import { ThemeContext } from './context/ThemeContext'

const FEATURES = [
  { icon: '💻', color: '#5ea1ff', title: 'Code Lab', desc: 'Write, run and learn code in Python, JavaScript, Java, C++ and Go — right in the browser.' },
  { icon: '📚', color: '#51cf8a', title: 'Knowledge Base', desc: 'Search any CS concept and get a clear, kid-friendly explanation in seconds.' },
  { icon: '🏗️', color: '#f6c177', title: 'Project Builder', desc: 'Get guided through full coding projects step-by-step with help and hints.' },
  { icon: '🎯', color: '#ff6b7a', title: 'Grade-Aware', desc: 'Explanations and challenges automatically match your grade level.' },
]

function pwStrength(p) {
  if (!p) return { s: 0, label: '', color: 'var(--text-3)' }
  let s = 0
  if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++; if (p.length >= 12) s++
  if (s <= 1) return { s, label: 'Weak', color: '#ff6b7a' }
  if (s <= 3) return { s, label: 'Fair', color: '#f6c177' }
  return { s, label: 'Strong', color: '#51cf8a' }
}

const ip = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'var(--font)', boxSizing: 'border-box' }
const lab = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 5 }

function AuthModal({ mode, onClose, onSwitch, onEnter }) {
  const isSignup = mode === 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const st = pwStrength(form.password)
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault(); setErr('')
    if (isSignup) {
      if (!form.name.trim() || !form.email.trim()) return setErr('Name and email are required.')
      if (form.password.length < 8) return setErr('Password must be at least 8 characters.')
      localStorage.setItem('codekids_user', JSON.stringify({ name: form.name, email: form.email, password: btoa(form.password) }))
      onEnter()
    } else {
      const u = JSON.parse(localStorage.getItem('codekids_user') || 'null')
      if (!u) return setErr('No account found. Please sign up first.')
      const id = form.email.trim().toLowerCase()
      if (id !== (u.email || '').toLowerCase() && id !== (u.name || '').toLowerCase()) return setErr('Account not found.')
      if (u.password && atob(u.password) !== form.password) return setErr('Wrong password.')
      onEnter()
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, background: 'var(--bg-elevated)', borderRadius: 18, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{ background: 'var(--accent-blue)', padding: '20px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.9 }}>{isSignup ? 'Start coding & learning' : 'Log in to continue'}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {err && <div style={{ background: '#ff6b7a22', border: '1px solid #ff6b7a55', color: '#ff6b7a', padding: '9px 12px', borderRadius: 9, fontSize: 13 }}>{err}</div>}
          {isSignup && <div><label style={lab}>Full Name</label><input style={ip} value={form.name} onChange={set('name')} placeholder="Your name" /></div>}
          <div><label style={lab}>{isSignup ? 'Email' : 'Email or Name'}</label><input style={ip} value={form.email} onChange={set('email')} placeholder={isSignup ? 'you@email.com' : 'email or name'} /></div>
          <div>
            <label style={lab}>Password</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...ip, paddingRight: 44 }} type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder={isSignup ? 'At least 8 characters' : 'Your password'} />
              <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--text-2)' }}>{showPw ? '🙈' : '👁️'}</button>
            </div>
            {isSignup && form.password && (
              <div style={{ marginTop: 7 }}>
                <div style={{ display: 'flex', gap: 4 }}>{[1,2,3,4,5].map((b) => <div key={b} style={{ flex: 1, height: 4, borderRadius: 4, background: b <= st.s ? st.color : 'var(--border)' }} />)}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: st.color }}>{st.label}</span>
              </div>
            )}
          </div>
          <button type="submit" style={{ marginTop: 4, padding: '12px', borderRadius: 10, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{isSignup ? 'Create Account' : 'Log In'}</button>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{isSignup ? 'Log In' : 'Sign Up'}</button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function Landing({ onEnter }) {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [auth, setAuth] = useState(null)
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark-mode')
  // Rotate the hero image's Pollinations seed every 5s for fresh variations.
  const [heroSeed, setHeroSeed] = useState(55)
  useEffect(() => {
    const t = setInterval(() => setHeroSeed(s => s + 1), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 6vw', borderBottom: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20 }}>{'</>'}</div>
          <span style={{ fontSize: 20, fontWeight: 800 }}>Code<span style={{ color: 'var(--accent-blue)' }}>Kids</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toggleTheme} title="Toggle theme" style={{ width: 40, height: 40, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', cursor: 'pointer', fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => setAuth('login')} style={{ padding: '10px 18px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Log In</button>
          <button onClick={() => setAuth('signup')} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Sign Up Free</button>
        </div>
      </header>

      <section style={{ padding: '64px 6vw 40px', maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 380px', minWidth: 280 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(94,161,255,0.12)', color: 'var(--accent-blue)', fontWeight: 700, fontSize: 13, marginBottom: 22 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)' }} /> Code · Learn · Build
          </div>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 18px' }}>Learn to code,<br /><span style={{ color: 'var(--accent-blue)' }}>the fun way.</span></h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-2)', maxWidth: 520, margin: '0 0 30px', lineHeight: 1.6 }}>
            A coding playground for kids: write &amp; run Python, JS, Java, C++ and Go in your browser, search any CS concept, and build full projects with AI guidance.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={() => setAuth('signup')} style={{ padding: '14px 30px', borderRadius: 12, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: 'var(--shadow)' }}>Get Started Free →</button>
            <button onClick={onEnter} style={{ padding: '14px 30px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Try it now</button>
          </div>
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 260, display: 'flex', justifyContent: 'center' }}>
          <img
            src={`https://image.pollinations.ai/prompt/3D%20Pixar%20cartoon%20of%20a%20happy%20kid%20coding%20on%20a%20colorful%20laptop%20with%20floating%20code%20blocks%20and%20coding%20symbols%20around%2C%20Python%20JavaScript%20snippets%2C%20bright%20vibrant%20colors%2C%20clean%20white%20background%2C%20fun%20educational?width=768&height=768&seed=${heroSeed}&nologo=true`}
            alt="Kid learning to code"
            loading="lazy"
            key={heroSeed}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ width: '100%', maxWidth: 420, height: 'auto', borderRadius: 20, boxShadow: 'var(--shadow)', transition: 'opacity .4s' }}
          />
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 6vw 56px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, margin: '0 0 32px' }}>Everything to start coding</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: 'var(--bg-elevated)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: f.color + '22', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1.5px solid var(--border)', padding: '24px 6vw', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#51cf8a' }} /> Powered by Codevidhya</div>
        <div style={{ marginTop: 6 }}>© 2025 CodeKids</div>
      </footer>

      {auth && <AuthModal mode={auth} onClose={() => setAuth(null)} onSwitch={() => setAuth((m) => (m === 'signup' ? 'login' : 'signup'))} onEnter={onEnter} />}
    </div>
  )
}
