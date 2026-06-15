import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { startHiggsfieldOAuthPopup, disconnectHF, isHFConnected } from '../utils/higgsfieldAuth'
import { useTheme } from '../context/theme'
import { useAuth } from '../context/auth'
import { supabase } from '../utils/supabase'

const HF_MODE_KEY = 'hf_mode'  // 'own' | 'platform'
const CLAUDE_KEY  = 'claude_api_key'

function Section({ title, children, badge }) {
  return (
    <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border-subtle)', overflow:'hidden', marginBottom:16 }}>
      <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{title}</div>
        {badge && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'rgba(52,199,89,0.15)', color:'#34C759', border:'1px solid rgba(52,199,89,0.25)' }}>{badge}</span>}
      </div>
      <div style={{ padding:'20px 24px' }}>{children}</div>
    </div>
  )
}

function Dot({ active }) {
  return <div style={{ width:7, height:7, borderRadius:'50%', background: active ? '#34C759' : 'rgba(255,255,255,0.2)', flexShrink:0 }} />
}

export default function Settings() {
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const { session, profile, isSubscribed, plan, signOut, loadProfile } = useAuth()

  const [hfConnected, setHfConnected] = useState(isHFConnected)
  const [hfLoading, setHfLoading]     = useState(false)
  const [hfMode, setHfMode]           = useState(() => localStorage.getItem(HF_MODE_KEY) || 'own')
  const [claudeKey, setClaudeKey]     = useState(() => localStorage.getItem(CLAUDE_KEY) || '')
  const [claudeInput, setClaudeInput] = useState('')
  const [showClaudeInput, setShowClaudeInput] = useState(false)
  const [portalLoading, setPortalLoading]     = useState(false)

  const sub = profile?.subscriptions?.[0]

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('connected') === '1') setHfConnected(true)
    if (params.get('subscribed') === '1' && session) loadProfile(session.user.id)
  }, [location.search])

  function switchHfMode(mode) {
    setHfMode(mode)
    localStorage.setItem(HF_MODE_KEY, mode)
  }

  async function connectHiggsfield() {
    setHfLoading(true)
    try { await startHiggsfieldOAuthPopup(); setHfConnected(true) }
    catch (e) { if (e.message !== 'cancelled') alert('Failed: ' + e.message) }
    finally { setHfLoading(false) }
  }

  function disconnectHighgsfield() {
    if (!confirm('Disconnect je Higgsfield account?')) return
    disconnectHF(); setHfConnected(false)
  }

  async function openBillingPortal() {
    setPortalLoading(true)
    try {
      const { data: { session: s } } = await supabase.auth.getSession()
      const res = await fetch('/api/stripe-portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${s.access_token}` },
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e) { alert('Kon portal niet openen: ' + e.message) }
    finally { setPortalLoading(false) }
  }

  const planNames = {
    [import.meta.env.VITE_STRIPE_PRICE_STARTER]: 'Starter',
    [import.meta.env.VITE_STRIPE_PRICE_PRO]:     'Pro',
    [import.meta.env.VITE_STRIPE_PRICE_AGENCY]:  'Agency',
  }
  const planLabel = planNames[sub?.plan_id] || 'Onbekend'

  return (
    <div style={{ paddingTop:'var(--nav-h)', minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ maxWidth:640, margin:'0 auto', padding:'32px 24px' }}>
        <h1 style={{ fontSize:26, fontWeight:700, letterSpacing:'-0.5px', marginBottom:28 }}>Instellingen</h1>

        <Section title="Account">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{session?.user?.email}</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>Ingelogd</div>
            </div>
            <button onClick={signOut} style={{ padding:'7px 14px', borderRadius:8, fontSize:13, color:'#FF3B30', background:'rgba(255,59,48,0.08)', border:'1px solid rgba(255,59,48,0.18)', fontWeight:500, cursor:'pointer' }}>
              Uitloggen
            </button>
          </div>
        </Section>

        <Section title="Abonnement" badge={isSubscribed ? 'Actief' : undefined}>
          {isSubscribed ? (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <Dot active />
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{planLabel} plan</div>
                  {sub?.current_period_end && (
                    <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>
                      {sub.cancel_at_period_end
                        ? `Loopt af op ${new Date(sub.current_period_end).toLocaleDateString('nl-NL')}`
                        : `Verlengd op ${new Date(sub.current_period_end).toLocaleDateString('nl-NL')}`}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={openBillingPortal} disabled={portalLoading} style={{ padding:'10px 18px', borderRadius:8, fontSize:14, fontWeight:600, background:'var(--bg)', color:'var(--text-primary)', border:'1.5px solid var(--border)', cursor:'pointer', opacity: portalLoading ? 0.6 : 1 }}>
                {portalLoading ? 'Laden…' : 'Facturering beheren →'}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:16, lineHeight:1.6 }}>
                Upgrade voor platform Higgsfield credits — geen eigen account nodig.
              </p>
              <Link to="/pricing" style={{ display:'inline-block', padding:'10px 22px', borderRadius:8, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#EC4899,#8B5CF6)', color:'#fff', textDecoration:'none' }}>
                Plannen bekijken →
              </Link>
            </div>
          )}
        </Section>

        <Section title="Higgsfield modus">
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:16, lineHeight:1.6 }}>
            Kies: je eigen Higgsfield account, of platform credits (inbegrepen in abonnement).
          </p>
          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
            {[
              { id:'own',      label:'Eigen account',     desc:'Jouw Higgsfield credits' },
              { id:'platform', label:'Platform credits',  desc:'Inbegrepen in abonnement', disabled:!isSubscribed },
            ].map(opt => {
              const on = hfMode === opt.id
              return (
                <button key={opt.id} disabled={opt.disabled} onClick={() => !opt.disabled && switchHfMode(opt.id)}
                  style={{ flex:1, padding:'14px 12px', borderRadius:12, border:`1.5px solid ${on?'#8B5CF6':'var(--border)'}`, background: on?'rgba(139,92,246,0.09)':'var(--bg)', color: on?'#8B5CF6':'var(--text-secondary)', cursor: opt.disabled?'not-allowed': on?'default':'pointer', opacity: opt.disabled?0.4:1, textAlign:'left', transition:'all 0.15s', boxShadow: on?'0 0 0 1px #8B5CF655':'none' }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{opt.label}</div>
                  <div style={{ fontSize:12, opacity:0.7, marginTop:3 }}>{opt.desc}</div>
                </button>
              )
            })}
          </div>

          {hfMode === 'own' && (
            hfConnected ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Dot active /><span style={{ fontSize:13, fontWeight:600, color:'#34C759' }}>Higgsfield verbonden</span>
                </div>
                <button onClick={disconnectHighgsfield} style={{ padding:'7px 14px', borderRadius:8, fontSize:13, color:'#FF3B30', background:'rgba(255,59,48,0.08)', border:'1px solid rgba(255,59,48,0.18)', fontWeight:500, cursor:'pointer' }}>Ontkoppelen</button>
              </div>
            ) : (
              <button onClick={connectHiggsfield} disabled={hfLoading} style={{ padding:'10px 20px', borderRadius:8, fontSize:14, fontWeight:600, background:'#1D1D1F', color:'#fff', display:'flex', alignItems:'center', gap:8, opacity: hfLoading?0.6:1, border:'none', cursor:'pointer' }}>
                {hfLoading ? <><div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite' }} />Verbinden…</> : 'Higgsfield verbinden'}
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </button>
            )
          )}
          {hfMode === 'platform' && isSubscribed && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Dot active /><span style={{ fontSize:13, fontWeight:600, color:'#34C759' }}>Platform credits actief</span>
            </div>
          )}
        </Section>

        <Section title="Uiterlijk">
          <div style={{ display:'flex', gap:10 }}>
            {['light','dark'].map(val => {
              const on = theme === val
              return (
                <button key={val} onClick={e => { if (!on) toggle(e.clientX, e.clientY) }}
                  style={{ flex:1, padding:'14px 12px', borderRadius:12, cursor: on?'default':'pointer', border:`1.5px solid ${on?'#8B5CF6':'var(--border)'}`, background: on?'rgba(139,92,246,0.09)':'var(--bg)', color: on?'#8B5CF6':'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center', gap:9, fontWeight:600, fontSize:14, fontFamily:'inherit', transition:'all 0.15s', boxShadow: on?'0 0 0 1px #8B5CF655':'none' }}>
                  {val === 'light'
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  }
                  {val === 'light' ? 'Licht' : 'Donker'}
                </button>
              )
            })}
          </div>
        </Section>

        <Section title="Claude AI">
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:16, lineHeight:1.6 }}>
            Anthropic API-sleutel voor character sheet analyse.
          </p>
          {claudeKey ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Dot active /><span style={{ fontSize:13, fontWeight:600, color:'#34C759' }}>Claude verbonden</span>
                <span style={{ fontSize:12, color:'var(--text-secondary)' }}>···{claudeKey.slice(-4)}</span>
              </div>
              <button onClick={() => { localStorage.removeItem(CLAUDE_KEY); setClaudeKey(''); setClaudeInput(''); setShowClaudeInput(false) }} style={{ padding:'7px 14px', borderRadius:8, fontSize:13, color:'#FF3B30', background:'rgba(255,59,48,0.08)', border:'1px solid rgba(255,59,48,0.18)', fontWeight:500, cursor:'pointer' }}>Verwijderen</button>
            </div>
          ) : showClaudeInput ? (
            <div style={{ display:'flex', gap:8 }}>
              <input autoFocus type="password" value={claudeInput} onChange={e => setClaudeInput(e.target.value)} placeholder="sk-ant-..." onKeyDown={e => { if (e.key==='Enter' && claudeInput.trim()) { const k=claudeInput.trim(); localStorage.setItem(CLAUDE_KEY,k); setClaudeKey(k); setClaudeInput(''); setShowClaudeInput(false) } }} style={{ flex:1, padding:'10px 14px', borderRadius:8, border:'1.5px solid var(--border)', background:'var(--bg)', fontSize:14, color:'var(--text-primary)', fontFamily:'monospace' }} />
              <button onClick={() => { const k=claudeInput.trim(); if(!k)return; localStorage.setItem(CLAUDE_KEY,k); setClaudeKey(k); setClaudeInput(''); setShowClaudeInput(false) }} style={{ padding:'10px 18px', borderRadius:8, fontSize:14, fontWeight:600, background:'#1D1D1F', color:'#fff', border:'none', cursor:'pointer' }}>Opslaan</button>
            </div>
          ) : (
            <button onClick={() => setShowClaudeInput(true)} style={{ padding:'10px 20px', borderRadius:8, fontSize:14, fontWeight:600, background:'#1D1D1F', color:'#fff', border:'none', cursor:'pointer' }}>API-sleutel toevoegen</button>
          )}
        </Section>
      </div>
    </div>
  )
}
