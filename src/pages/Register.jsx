import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/auth'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Wachtwoorden komen niet overeen'); return }
    if (password.length < 8)  { setError('Minimaal 8 tekens vereist'); return }
    setLoading(true)
    try {
      await signUp(email, password)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Aanmelden mislukt')
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
          Account aanmaken
        </span>
      </div>

      <div style={{ flex:1, display:'flex' }}>
        {/* Left — form */}
        <div style={{ flex:'0 0 480px', padding:'72px 64px', borderRight:'1px solid rgba(0,0,0,0.12)', display:'flex', flexDirection:'column', justifyContent:'center' }}>

          {done ? (
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E8152A', marginBottom:20 }}>
                Bevestig je account
              </div>
              <h1 style={{ fontSize:44, fontWeight:900, letterSpacing:'-1.5px', color:'#111', marginBottom:20, lineHeight:1.05 }}>
                Check je<br />inbox.
              </h1>
              <p style={{ fontSize:15, color:'#666', lineHeight:1.65, marginBottom:32 }}>
                We stuurden een bevestigingslink naar <strong style={{ color:'#111' }}>{email}</strong>.<br />
                Klik op de link om je account te activeren.
              </p>
              <Link to="/login" style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:13, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', color:'#E8152A', textDecoration:'none' }}>
                Naar inloggen →
              </Link>
            </div>
          ) : (
            <>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E8152A', marginBottom:20 }}>
                01 — Aanmelden
              </div>
              <h1 style={{ fontSize:44, fontWeight:900, letterSpacing:'-1.5px', color:'#111', marginBottom:48, lineHeight:1.05 }}>
                Start<br />gratis.
              </h1>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {[
                  { label:'E-mailadres', type:'email', value:email, set:setEmail, placeholder:'jouw@email.nl' },
                  { label:'Wachtwoord (min. 8 tekens)', type:'password', value:password, set:setPassword, placeholder:'••••••••' },
                  { label:'Bevestig wachtwoord', type:'password', value:confirm, set:setConfirm, placeholder:'••••••••' },
                ].map((field, i) => (
                  <div key={field.label} style={{ borderTop:'1px solid rgba(0,0,0,0.12)', paddingTop:20, paddingBottom:4 }}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#999', display:'block', marginBottom:8 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={e => field.set(e.target.value)}
                      required
                      placeholder={field.placeholder}
                      style={{ width:'100%', fontSize:18, fontWeight:500, color:'#111', background:'transparent', border:'none', outline:'none', paddingBottom:16, borderBottom:'1px solid rgba(0,0,0,0.12)' }}
                    />
                  </div>
                ))}

                {error && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 0', color:'#E8152A', fontSize:13, fontWeight:600 }}>
                    <span>↳</span> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ marginTop:32, padding:'15px 0', background: loading?'#999':'#E8152A', color:'#fff', fontSize:13, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', border:'none', cursor: loading?'not-allowed':'pointer', transition:'background 0.12s' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background='#111' }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background='#E8152A' }}
                >
                  {loading ? 'Bezig…' : 'Account aanmaken →'}
                </button>
              </form>

              <p style={{ marginTop:28, fontSize:13, color:'#888' }}>
                Al een account?{' '}
                <Link to="/login" style={{ color:'#E8152A', fontWeight:700, textDecoration:'underline' }}>Inloggen</Link>
              </p>
            </>
          )}
        </div>

        {/* Right — dark panel */}
        <div style={{ flex:1, background:'#111', padding:'72px 64px', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:20 }}>
              Inbegrepen
            </div>
            {[
              { label:'TIJD',       value:'Gratis te starten' },
              { label:'INFLUENCERS', value:'Onbeperkt' },
              { label:'DATA',       value:'Blijft bij jou' },
              { label:'PLATFORM',   value:'Higgsfield AI' },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>{row.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
