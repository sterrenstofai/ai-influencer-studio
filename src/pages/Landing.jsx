import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WORDS = ['Influencer', 'Creator', 'Avatar', 'Persona']
const TYPE_SPEED = 70
const DELETE_SPEED = 40
const PAUSE_MS = 2000

function useTypewriter() {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const word = WORDS[wordIdx]
    if (phase === 'typing') {
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_SPEED)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('deleting'), PAUSE_MS)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED)
        return () => clearTimeout(t)
      } else {
        setWordIdx(i => (i + 1) % WORDS.length)
        setPhase('typing')
      }
    }
  }, [text, phase, wordIdx])

  return text
}

const STATS = [
  { label: 'TIJD',        value: '< 60 SEC' },
  { label: 'GENERATIES',  value: 'ONBEPERKT' },
  { label: 'API',         value: 'HIGGSFIELD' },
  { label: 'DATA',        value: 'PRIVÉ' },
]

export default function Landing() {
  const navigate = useNavigate()
  const animatedWord = useTypewriter()

  return (
    <div style={{ minHeight: '100vh', background: '#EDE8DF', paddingTop: 'var(--nav-h)' }}>

      {/* ── Hero ── */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.12)', padding: '72px 40px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8152A', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666' }}>
              AI Influencer Studio — door Sterrenstof
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end' }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(60px,9vw,116px)',
                fontWeight: 900,
                letterSpacing: '-3px',
                lineHeight: 0.95,
                color: '#111',
                marginBottom: 0,
              }}>
                Maak je eigen<br />
                <span style={{ color: '#E8152A' }}>
                  AI {animatedWord}
                </span>
                <span style={{
                  display: 'inline-block', width: 6, height: '0.72em',
                  background: '#E8152A', marginLeft: 4,
                  verticalAlign: 'middle',
                  animation: 'blink 1s step-end infinite',
                }} />
              </h1>
            </div>

            <div style={{ maxWidth: 320, paddingBottom: 8 }}>
              <p style={{ fontSize: 16, color: '#555', lineHeight: 1.65, marginBottom: 28 }}>
                Bouw, beheer en laat groeien. Genereer foto's en video's van je AI influencers via Higgsfield — jouw data blijft privé.
              </p>
              <button
                onClick={() => navigate('/register')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px',
                  background: '#E8152A',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#C4101F'}
                onMouseLeave={e => e.currentTarget.style.background = '#E8152A'}
              >
                Gratis starten
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.12)', background: '#111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: '20px 32px',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                {s.label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', color: '#fff' }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { num: '01', title: 'Influencers bouwen', desc: 'Definieer je AI persona — uiterlijk, niche, stijl en backstory. Genereer foto\'s en character sheets.' },
            { num: '02', title: 'Content genereren', desc: 'Foto\'s, video\'s en brand deal campagnes in seconden. Powered by Higgsfield AI.' },
            { num: '03', title: 'Groeien & monetizen', desc: 'Beheer brand deals, inspiration boards en campagnes vanuit één dashboard.' },
          ].map((f, i) => (
            <div key={f.num} style={{
              padding: '40px 32px',
              borderRight: i < 2 ? '1px solid rgba(0,0,0,0.12)' : 'none',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#E8152A', marginBottom: 16 }}>
                {f.num}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px', color: '#111', marginBottom: 10 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.65 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '64px 40px', background: '#EDE8DF', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8152A', marginBottom: 12 }}>
              Klaar om te beginnen
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', color: '#111', lineHeight: 1.1 }}>
              Je eerste AI influencer<br />staat in 60 seconden live.
            </div>
          </div>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 36px',
              background: '#111',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E8152A'}
            onMouseLeave={e => e.currentTarget.style.background = '#111'}
          >
            Account aanmaken →
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#999', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          AI Influencer Studio® · Door Sterrenstof · ©26
        </span>
        <span style={{ fontSize: 11, color: '#999', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Eigen data. Eigen credits.
        </span>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}
