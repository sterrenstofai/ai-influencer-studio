import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { supabase } from '../utils/supabase'

const PLANS = [
  {
    id:       'starter',
    num:      '01',
    name:     'Starter',
    price:    '€19',
    period:   '/maand',
    priceId:  import.meta.env.VITE_STRIPE_PRICE_STARTER,
    features: ['50 beelden per maand', '5 video\'s per maand', 'Influencers beheren', 'Brand deals tracker', 'E-mail support'],
    highlight: false,
  },
  {
    id:       'pro',
    num:      '02',
    name:     'Pro',
    price:    '€49',
    period:   '/maand',
    priceId:  import.meta.env.VITE_STRIPE_PRICE_PRO,
    features: ['200 beelden per maand', '30 video\'s per maand', 'Onbeperkte influencers', 'Photo Studio', 'Wardrobe AI', 'Prioriteit support'],
    highlight: true,
  },
  {
    id:       'agency',
    num:      '03',
    name:     'Agency',
    price:    '€129',
    period:   '/maand',
    priceId:  import.meta.env.VITE_STRIPE_PRICE_AGENCY,
    features: ['Onbeperkte beelden & video\'s', '5 gebruikers (seats)', 'Eigen of platform Higgsfield', 'White-label opties', 'Dedicated support'],
    highlight: false,
  },
]

export default function Pricing() {
  const { session, isSubscribed } = useAuth()
  const navigate  = useNavigate()
  const [loadingId, setLoadingId] = useState(null)

  async function startCheckout(plan) {
    if (!session) { navigate('/login'); return }
    if (!plan.priceId) {
      alert('Stripe Price ID nog niet geconfigureerd. Voeg VITE_STRIPE_PRICE_' + plan.id.toUpperCase() + ' toe aan .env')
      return
    }
    setLoadingId(plan.id)
    try {
      const { data: { session: s } } = await supabase.auth.getSession()
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}` },
        body: JSON.stringify({
          priceId:    plan.priceId,
          successUrl: `${window.location.origin}/settings?subscribed=1`,
          cancelUrl:  `${window.location.origin}/pricing`,
        }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e) {
      alert('Betaling starten mislukt: ' + e.message)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#EDE8DF', paddingTop:'var(--nav-h)' }}>

      {/* Header */}
      <div style={{ borderBottom:'1px solid rgba(0,0,0,0.12)', padding:'56px 40px 48px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#E8152A' }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#666' }}>
              Abonnementen
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:32, flexWrap:'wrap' }}>
            <h1 style={{ fontSize:'clamp(44px,6vw,80px)', fontWeight:900, letterSpacing:'-2px', color:'#111', lineHeight:0.95 }}>
              Kies je plan.
            </h1>
            <p style={{ fontSize:15, color:'#666', maxWidth:360, lineHeight:1.65, paddingBottom:4 }}>
              Platform Higgsfield credits inbegrepen — geen eigen account nodig. Of koppel je eigen account.
            </p>
          </div>
        </div>
      </div>

      {/* Plans grid */}
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderRight:'1px solid rgba(0,0,0,0.12)' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              style={{
                borderLeft: '1px solid rgba(0,0,0,0.12)',
                borderBottom: '1px solid rgba(0,0,0,0.12)',
                background: plan.highlight ? '#111' : 'transparent',
                padding:'40px 36px',
                display:'flex', flexDirection:'column',
                position:'relative',
              }}
            >
              {plan.highlight && (
                <div style={{ position:'absolute', top:0, left:36, fontSize:10, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E8152A', background:'#E8152A', color:'#fff', padding:'4px 10px' }}>
                  Meest gekozen
                </div>
              )}

              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', color: plan.highlight ? 'rgba(255,255,255,0.35)' : '#999', marginBottom:24, marginTop: plan.highlight ? 20 : 0 }}>
                {plan.num}
              </div>

              <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.3px', color: plan.highlight ? '#fff' : '#111', marginBottom:8 }}>
                {plan.name}
              </div>

              <div style={{ marginBottom:32 }}>
                <span style={{ fontSize:52, fontWeight:900, letterSpacing:'-2px', color: plan.highlight ? '#fff' : '#111' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize:14, color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#999', marginLeft:4 }}>
                  {plan.period}
                </span>
              </div>

              <div style={{ flex:1, borderTop:`1px solid ${plan.highlight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, paddingTop:24, marginBottom:32 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:12, padding:'8px 0', borderBottom:`1px solid ${plan.highlight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <span style={{ color:'#E8152A', fontWeight:700, fontSize:12, flexShrink:0, marginTop:1 }}>✓</span>
                    <span style={{ fontSize:13, color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#444', lineHeight:1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => startCheckout(plan)}
                disabled={!!loadingId || isSubscribed}
                style={{
                  padding:'14px 0',
                  background: plan.highlight ? '#E8152A' : '#111',
                  color:'#fff',
                  fontSize:12,
                  fontWeight:800,
                  letterSpacing:'0.1em',
                  textTransform:'uppercase',
                  border:'none',
                  cursor:(loadingId || isSubscribed) ? 'not-allowed' : 'pointer',
                  opacity: loadingId && loadingId !== plan.id ? 0.4 : 1,
                  transition:'background 0.12s',
                }}
                onMouseEnter={e => { if (!loadingId && !isSubscribed) e.currentTarget.style.background = plan.highlight ? '#C4101F' : '#E8152A' }}
                onMouseLeave={e => { if (!loadingId && !isSubscribed) e.currentTarget.style.background = plan.highlight ? '#E8152A' : '#111' }}
              >
                {loadingId === plan.id ? 'Laden…' : isSubscribed ? 'Huidig plan' : 'Kiezen →'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ padding:'24px 0', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:'rgba(0,0,0,0.2)' }} />
          <span style={{ fontSize:12, color:'#888', letterSpacing:'0.04em' }}>
            Maandelijks gefactureerd · Op elk moment opzegbaar · Alle prijzen excl. btw
          </span>
        </div>
      </div>
    </div>
  )
}
