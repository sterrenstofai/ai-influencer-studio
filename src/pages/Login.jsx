import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/auth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/influencers')
    } catch (err) {
      setError(err.message || 'Inloggen mislukt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#EDE8DF', display:'flex', flexDirection:'column' }}>
      {/* Top bar */}
      <div style={{ height:'var(--nav-h)', borderBottom:'1px solid rgba(0,0,0,0.12)', display:'flex', alignItems:'center', padding:'0 40px', gap:8 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'#E8152A' }} />
        <Link to="/" style={{ fontSize:11, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#111', textDecoration:'none' }}>
          AI Influencer Studio
        </Link>
        <span style={{ marginLeft:'auto', fontSize:11, color:'#999', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Inloggen
        </span>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex' }}>
        {/* Left — form */}
        <div style={{ flex:'0 0 480px', padding:'72px 64px', borderRight:'1px solid rgba(0,0,0,0.12)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E8152A', marginBottom:20 }}>
            01 — Toegang
          </div>
          <h1 style={{ fontSize:44, fontWeight:900, letterSpacing:'-1.5px', color:'#111', marginBottom:48, lineHeight:1.05 }}>
            Welkom<br />terug.
          </h1>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:0 }}>
            <div style={{ borderTop:'1px solid rgba(0,0,0,0.12)', paddingTop:20, paddingBottom:4, marginBottom:0 }}>
              <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#999', display:'block', marginBottom:8 }}>
                E-mailadres
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="jouw@email.nl"
                style={{ width:'100%', fontSize:18, fontWeight:500, color:'#111', background:'transparent', border:'none', outline:'none', paddingBottom:16, borderBottom:'1px solid rgba(0,0,0,0.12)' }}
              />
            </div>

            <div style={{ paddingTop:20, paddingBottom:4 }}>
              <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#999', display:'block', marginBottom:8 }}>
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width:'100%', fontSize:18, fontWeight:500, color:'#111', background:'transparent', border:'none', outline:'none', paddingBottom:16, borderBottom:'1px solid rgba(0,0,0,0.12)' }}
              />
            </div>

            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 0', color:'#E8152A', fontSize:13, fontWeight:600 }}>
                <span>↳</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop:32,
                padding:'15px 0',
                background: loading ? '#999' : '#E8152A',
                color:'#fff',
                fontSize:13,
                fontWeight:800,
                letterSpacing:'0.1em',
                textTransform:'uppercase',
                border:'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition:'background 0.12s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background='#111' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background='#E8152A' }}
            >
              {loading ? 'Bezig…' : 'Inloggen →'}
            </button>
          </form>

          <p style={{ marginTop:28, fontSize:13, color:'#888' }}>
            Nog geen account?{' '}
            <Link to="/register" style={{ color:'#E8152A', fontWeight:700, textDecoration:'underline' }}>Aanmelden</Link>
          </p>
        </div>

        {/* Right — info panel */}
        <div style={{ flex:1, background:'#111', padding:'72px 64px', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
          <div style={{ marginTop:'auto' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:20 }}>
              Wat je krijgt
            </div>
            {[
              'AI influencers bouwen & beheren',
              'Foto\'s en video\'s genereren met Higgsfield',
              'Brand deals tracken',
              'Inspiratieborden aanleggen',
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 0', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color:'#E8152A', fontSize:13, fontWeight:700 }}>✓</span>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.7)', fontWeight:500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
