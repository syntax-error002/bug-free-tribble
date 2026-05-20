import React, { useState } from 'react'
import './App.css'

// In dev, Vite proxies /api → localhost:3001. In prod, set VITE_API_URL to your server.
const API_URL = import.meta.env.VITE_API_URL ?? ''

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MARQUEE                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
function Marquee({ items, speed = 40, reverse = false }) {
  const doubled = [...items, ...items]
  return (
    <div className="marquee-track">
      <div className={`marquee-inner${reverse ? ' marquee-reverse' : ''}`}
        style={{ '--speed': `${speed}s` }}>
        {doubled.map((t, i) => (
          <span key={i} className="marquee-item">
            {t} <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TEAM SECTION                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const TEAM = [
  { name: 'Shaswat', role: 'Founder & CEO', tag: 'Product & Dev', img: 'https://i.pravatar.cc/800?img=11', social: '𝕏 / GitHub' },
  { name: 'Sohan', role: 'Co-Founder', tag: 'Design & UI', img: 'https://i.pravatar.cc/800?img=60', social: '𝕏 / Dribbble' },
]

function TeamSection() {
  return (
    <section className="team-section" id="team">
      <div className="team-inner">
        <div className="team-header">
          <p className="section-eyebrow">The Core Team</p>
          <h2 className="team-headline">
            MEET THE BUILDERS<br />
            BEHIND <span className="team-accent">NEXORA</span>.
          </h2>
          <p className="team-desc">
            We are a duo of developers and designers building the platform we always wished we had.
          </p>
        </div>
        <div className="team-grid">
          {TEAM.map(member => (
            <div key={member.name} className="team-card">
              <img src={member.img} alt={member.name} className="team-img" />
              <div className="team-overlay"></div>
              <span className="team-tag">{member.tag}</span>
              <div className="team-info">
                <div className="team-info-left">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
                <a href="#" className="team-social-btn">{member.social} ↗</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FEATURES ACCORDION                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    id: 'match',
    title: 'AI-Powered Founder Matching',
    color: '#FF4E20',
    highlight: 'SMART MATCHING',
    desc: 'Our AI engine analyzes your skills, goals, and working style to recommend the most compatible co-founders, teammates, and collaborators — so every connection counts.',
    tags: ['AI Matching', 'Co-Founder Finder', 'Compatibility Score', 'Smart Filters'],
  },
  {
    id: 'hackathon',
    title: 'Join Live Hackathons',
    color: '#F3C930',
    highlight: 'LIVE HACKATHONS',
    desc: 'Browse and join active hackathons near you or globally. Form teams in minutes, track submissions in real time, and compete in coding battles and innovation challenges.',
    tags: ['Hackathon Teams', 'Live Events', 'Coding Battles', 'Innovation Challenges'],
  },
  {
    id: 'collab',
    title: 'Real-Time Collaboration Rooms',
    color: '#6EE7B7',
    highlight: 'COLLABORATION',
    desc: 'Spin up a live project workspace with shared tasks, discussions, voice rooms, and real-time chat. Your entire team in one powerful space — no extra tools needed.',
    tags: ['Project Rooms', 'Voice Rooms', 'Live Chat', 'Shared Tasks'],
  },
  {
    id: 'radar',
    title: 'Nearby Startup Radar',
    color: '#818CF8',
    highlight: 'STARTUP RADAR',
    desc: 'Discover developers, founders, and AI engineers building things right around you. Geo-powered discovery so you can meet and collaborate in person, not just online.',
    tags: ['Geo Discovery', 'Nearby Builders', 'Local Events', 'Meetups'],
  },
]

function FeaturesSection() {
  const [open, setOpen] = useState('match')

  return (
    <section className="services-section" id="features">
      <div className="services-inner">
        <div className="services-left">
          <p className="section-eyebrow">Platform Features</p>
          <h2 className="services-headline">
            {FEATURES.map(f => (
              <span key={f.id}
                className={`services-hl-word${open === f.id ? ' services-hl-active' : ''}`}
                style={{ '--hl-color': f.color }}
                onClick={() => setOpen(f.id)}>
                {f.highlight}
              </span>
            )).reduce((acc, el, i) => {
              if (i === 0) return [el]
              const joins = [', ', ', ', ' AND ']
              return [...acc, <span key={`j${i}`} className="services-hl-join">{joins[i - 1] || ', '}</span>, el]
            }, [])}
          </h2>
        </div>

        <div className="services-right">
          {FEATURES.map(f => (
            <div key={f.id}
              className={`accordion-item${open === f.id ? ' accordion-open' : ''}`}
              style={{ '--acc-color': f.color }}
              onClick={() => setOpen(open === f.id ? null : f.id)}>
              <div className="accordion-header">
                <span className="accordion-title">{f.title}</span>
                <span className="accordion-icon">{open === f.id ? '—' : '+'}</span>
              </div>
              {open === f.id && (
                <div className="accordion-body">
                  <p>{f.desc}</p>
                  <div className="accordion-tags">
                    {f.tags.map(t => <span key={t} className="accordion-tag">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  BUILDERS BENTO GRID SECTION (replaces "Work" / hover showcase)            */
/* ─────────────────────────────────────────────────────────────────────────── */
const BENTO_MOCK_FEED = [
  "Rohan K. (AI Engineer) joined the waitlist 2m ago",
  "Sneha P. (Product Designer) reserved their spot 8m ago",
  "Meera P. (Founder) listed 'SaaSFlow' concept 15m ago",
  "Tanya S. (Design) joined the waitlist in Mumbai 22m ago",
  "Aarav S. (Dev) registered for early access 30m ago"
]

function BuildersSection() {
  const [feedIndex, setFeedIndex] = useState(0)
  const [matchingState, setMatchingState] = useState('idle') // idle | matching | matched
  const [matchCount, setMatchCount] = useState(1248)
  
  // Rotate feed events
  React.useEffect(() => {
    const timer = setInterval(() => {
      setFeedIndex(prev => (prev + 1) % BENTO_MOCK_FEED.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])
  
  const handleMatchTrigger = () => {
    if (matchingState !== 'idle') return
    setMatchingState('matching')
    setTimeout(() => {
      setMatchingState('matched')
      setMatchCount(prev => prev + 1)
    }, 1800)
  }

  return (
    <section className="bento10-outer-section" id="builders">
      <div className="bento10-outer-container">
        
        {/* Slanted bold labels above the panel (like "BENTO GRID Layout-10" in the reference) */}
        <div className="bento10-top-badge-row">
          <span className="bento10-badge-txt">WAITLIST PREVIEW</span>
          <span className="bento10-layout-txt">Ecosystem Radar</span>
        </div>

        <div className="bento10-card-panel">
          <h2 className="bento10-title">
            Preview the ecosystem. Meet early builders reserving their spot on Nexora.
          </h2>
          
          <div className="bento10-grid">
            
            {/* TILE 1: FEATURED BUILDER SPOTLIGHT (Orange background) - Spans 8 cols, Row 1 */}
            <div className="bento10-tile tile-orange">
              <div className="tile-orange-left">
                <span className="tile-orange-stat">99%</span>
                <span className="tile-orange-stat-lbl">Compatibility Potential</span>
              </div>
              <div className="tile-orange-divider"></div>
              <div className="tile-orange-right">
                <span className="tile-orange-badge">WAITLIST SPOTLIGHT ✦</span>
                <div className="tile-orange-profile">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80" alt="Aarav Sharma" className="tile-orange-avatar" />
                  <div className="tile-orange-profile-meta">
                    <h3 className="tile-orange-name">Aarav Sharma</h3>
                    <p className="tile-orange-role">Full Stack Product Engineer</p>
                  </div>
                </div>
                <p className="tile-orange-desc">
                  "Building Nexora's core real-time WebRTC channels & P2P spatial connection engine."
                </p>
              </div>
            </div>

            {/* TILE 2: STARTUP SPOTLIGHT (Green background, Spans 4 cols, Double height) */}
            <div className="bento10-tile tile-green">
              <div className="tile-green-header">
                <span className="tile-green-badge">PROJECT CONCEPT 🚀</span>
                <h3 className="tile-green-title">Join Meera Patel using SaaSFlow</h3>
                <p className="tile-green-desc">"Automating outreach copy and scheduling sequences using localized deep LLM adapters."</p>
              </div>
              
              <div className="tile-green-cards">
                <div className="tile-green-inner-card">
                  <p className="tile-green-inner-text">Hiring: <strong className="white-strong">AI Engineer</strong></p>
                  <div className="tile-green-inner-icon">
                    <span className="arrow-circle">↗</span>
                  </div>
                </div>
                <div className="tile-green-inner-card">
                  <p className="tile-green-inner-text">Concept: <strong className="white-strong">85% Defined</strong></p>
                  <div className="tile-green-inner-icon">
                    <span className="check-circle">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TILE 3: TECH HOTSPOTS (White background, Spans 4 cols, Row 2) */}
            <div className="bento10-tile tile-white-left">
              <span className="tile-white-stat">5+</span>
              <p className="tile-white-desc">Trending tech stacks among waitlisted builders.</p>
              <div className="bento-tech-grid dark-pills">
                <span className="bento-tech-pill tech-react" style={{ '--hover-color': '#61dafb' }}>React</span>
                <span className="bento-tech-pill tech-pytorch" style={{ '--hover-color': '#ee4c2c' }}>PyTorch</span>
                <span className="bento-tech-pill tech-figma" style={{ '--hover-color': '#a259ff' }}>Figma</span>
                <span className="bento-tech-pill tech-fastapi" style={{ '--hover-color': '#009688' }}>FastAPI</span>
                <span className="bento-tech-pill tech-webrtc" style={{ '--hover-color': '#ff6b6b' }}>WebRTC</span>
              </div>
            </div>

            {/* TILE 4: LIVE COMMUNITY ACTIVITY FEED (Pink background, Spans 4 cols, Row 2) */}
            <div className="bento10-tile tile-pink">
              <span className="tile-pink-stat">+{matchCount}</span>
              <p className="tile-pink-desc">Builders queued for the upcoming pre-launch cohort.</p>
              <div className="live-feed-ticker-container dark-ticker">
                <div className="live-feed-ticker-wrapper">
                  {BENTO_MOCK_FEED.map((eventText, idx) => (
                    <div key={idx} className={`live-feed-event-row dark-event ${idx === feedIndex ? 'active-event' : 'inactive-event'}`}>
                      <span className="event-star">✦</span>
                      <p className="event-text">{eventText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TILE 5: LIVE COMPATIBILITY MATCHER (Purple background, Spans 8 cols, Row 3) */}
            <div className="bento10-tile tile-purple">
              <div className="tile-purple-content">
                <div className="tile-purple-top">
                  {matchingState === 'idle' && (
                    <div className="purple-pill-inner" onClick={handleMatchTrigger}>
                      <span className="purple-pill-spark">⚡</span>
                      <span className="purple-pill-text">Calculate Compatibility Index</span>
                      <span className="purple-pill-btn">⚡</span>
                    </div>
                  )}
                  {matchingState === 'matching' && (
                    <div className="purple-pill-inner loading">
                      <span className="purple-pill-spark loading-spin">↻</span>
                      <span className="purple-pill-text">Analyzing compatibility...</span>
                      <span className="purple-pill-btn spin">↻</span>
                    </div>
                  )}
                  {matchingState === 'matched' && (
                    <div className="purple-pill-inner success" onClick={() => setMatchingState('idle')}>
                      <span className="purple-pill-spark">🎉</span>
                      <span className="purple-pill-text">98% COMPATIBILITY DETECTED</span>
                      <span className="purple-pill-btn check">✓</span>
                    </div>
                  )}
                  
                  <div className="tile-purple-avatars">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="Aarav" className="purple-avatar avatar-1" />
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80" alt="Tanya" className="purple-avatar avatar-2" />
                  </div>
                </div>
                
                <p className="tile-purple-desc">
                  {matchingState === 'idle' && "Run a semantic compatibility test against early waitlist profiles."}
                  {matchingState === 'matching' && "Analyzing mock skill sets, timezone overlaps, and development values..."}
                  {matchingState === 'matched' && "Simulated match! Complementary skills & values found with Aarav."}
                </p>
              </div>
            </div>

            {/* TILE 6: NEARBY RADAR (White background, bottom right, Spans 4 cols, Row 3) */}
            <div className="bento10-tile tile-white-right">
              <div className="tile-white-right-content">
                <h4 className="tile-white-title">🛰️ Nearby Waitlist Radar</h4>
                <div className="radar-widget-container small-radar">
                  <div className="radar-circle-outer">
                    <div className="radar-circle-mid">
                      <div className="radar-circle-inner">
                        <div className="radar-center-dot"></div>
                      </div>
                    </div>
                    <div className="radar-sweep-line"></div>
                    <div className="radar-floating-avatar-wrap">
                      <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80" alt="Tanya" className="radar-found-avatar" />
                      <span className="radar-pulse-dot"></span>
                    </div>
                  </div>
                </div>
                <div className="radar-info dark-radar-info">
                  <strong>Tanya Sen (Designer)</strong>
                  <p>Waitlist member 1.2 km away · UI/UX Lead</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TESTIMONIALS                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    text: '"Nexora is the missing layer between LinkedIn and GitHub. Found my co-founder in 3 days. We shipped our MVP at the next hackathon."',
    name: 'Arjun Mehta',
    role: 'Founder, DevLaunch · Hackathon Winner',
    bg: '#FF4E20',
  },
  {
    text: '"The AI matching is scary good. It recommended a designer whose style was exactly what I needed. We\'ve been collaborating for 3 months now."',
    name: 'Priya Nair',
    role: 'Full Stack Developer · Indie Builder',
    bg: '#F3C930',
    dark: true,
  },
  {
    text: '"I joined a hackathon team through Nexora on a Friday. By Sunday we had a working product. The collaboration rooms are insanely good."',
    name: 'Karan Sinha',
    role: 'AI Engineer · Student Innovator',
    bg: '#818CF8',
  },
  {
    text: '"Finally a platform that gets builders. Not recruiters, not job boards — actual people who want to make things together."',
    name: 'Sneha Patel',
    role: 'Product Designer · Startup Founder',
    bg: '#1a1a1a',
  },
]

function TestimonialsSection() {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setIdx(i => (i + 1) % TESTIMONIALS.length)
  const t = TESTIMONIALS[idx]

  return (
    <section className="testimonials-section">
      <div className="testimonials-inner"
        style={{ background: t.bg, color: t.dark ? '#111' : '#fff' }}>
        <p className="testimonials-quote">{t.text}</p>
        <div className="testimonials-footer">
          <div>
            <strong className="testimonials-name">{t.name}</strong>
            <span className="testimonials-role" style={{ opacity: t.dark ? 0.6 : 0.7 }}>{t.role}</span>
          </div>
          <div className="testimonials-nav">
            <button onClick={prev} style={{ color: t.dark ? '#111' : '#fff' }}>←</button>
            <span className="testimonials-counter" style={{ opacity: 0.5 }}>{idx + 1} / {TESTIMONIALS.length}</span>
            <button onClick={next} style={{ color: t.dark ? '#111' : '#fff' }}>→</button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  STATS STRIP                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const STATS = [
  { number: '12K+',  label: 'Active Builders' },
  { number: '3.4K+', label: 'Teams Formed' },
  { number: '890+',  label: 'Hackathons Joined' },
  { number: '2.1K+', label: 'Projects Launched' },
]

function StatsStrip() {
  return (
    <div className="stats-strip">
      {STATS.map(s => (
        <div key={s.label} className="stat-item">
          <span className="stat-number">{s.number}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PREMIUM FEATURES GRID                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const PREMIUM = [
  { icon: '⚡', title: 'AI-Powered Founder Matching',   desc: 'Smart compatibility scoring across skills, goals & working styles.' },
  { icon: '🛰️', title: 'Nearby Startup Radar',          desc: 'Geo-powered discovery of builders, events & hackathons near you.' },
  { icon: '🎙️', title: 'Voice Intro Profiles',          desc: 'Record a 30-second intro. Let your voice do the networking.' },
  { icon: '🏆', title: 'Founder Reputation System',     desc: 'XP, levels, badges & founder rankings to showcase your journey.' },
  { icon: '🔴', title: 'Live Project Tracking',         desc: 'Real-time tasks, milestones, and sprint boards for your team.' },
  { icon: '✅', title: 'Elite Builder Verification',    desc: 'Verified badges for top contributors, hackathon winners & founders.' },
  { icon: '🤝', title: 'Smart Team Recommendations',   desc: 'Get suggested teammates based on your active project needs.' },
  { icon: '🌐', title: 'Real-Time Collaboration Rooms', desc: 'Voice, chat, tasks and docs — all inside your project workspace.' },
]

function PremiumGrid() {
  return (
    <section className="premium-section" id="platform">
      <div className="premium-inner">
        <p className="section-eyebrow">Premium Features</p>
        <h2 className="premium-heading">Everything you need to<br /><span className="premium-accent">build together</span></h2>
        <div className="premium-grid">
          {PREMIUM.map(p => (
            <div key={p.title} className="premium-card">
              <span className="premium-icon">{p.icon}</span>
              <h3 className="premium-title">{p.title}</h3>
              <p className="premium-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  NAVBAR                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function Navbar({ userSession, onOpenLogin, onOpenDashboard, onLogout }) {
  const [open, setOpen] = useState(false)
  return (
    <nav className="vsk-nav">
      <a href="#" className="vsk-logo">NEXORA</a>
      <ul className="vsk-nav-links">
        {['Features', 'Builders', 'Platform', 'Community', 'Contact'].map(l => (
          <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
        ))}
      </ul>
      <div className="vsk-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {userSession ? (
          <>
            <button className="vsk-nav-cta secondary" onClick={onOpenDashboard}>
              My Dashboard 📊
            </button>
            <button className="vsk-nav-logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="vsk-nav-cta" onClick={onOpenLogin}>
            Sign In 🔑
          </button>
        )}
      </div>
      <button className="vsk-hamburger" onClick={() => setOpen(o => !o)}>{open ? '✕' : '☰'}</button>
      {open && (
        <div className="vsk-mobile-menu">
          {['Features', 'Builders', 'Platform', 'Community', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>{l}</a>
          ))}
          {userSession ? (
            <>
              <a href="#dashboard" onClick={() => { setOpen(false); onOpenDashboard(); }}>My Dashboard 📊</a>
              <a href="#" onClick={() => { setOpen(false); onLogout(); }} style={{ color: '#ff6b6b' }}>Logout</a>
            </>
          ) : (
            <a href="#" onClick={() => { setOpen(false); onOpenLogin(); }}>Sign In 🔑</a>
          )}
        </div>
      )}
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  WAITLIST FORM                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function WaitlistForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [myRefLink, setMyRefLink] = useState('')
  const [copied, setCopied] = useState(false)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const refCode = params.get('ref')
    if (refCode) {
      setReferredBy(refCode)
      localStorage.setItem('nexora_ref', refCode)
    } else {
      const savedRef = localStorage.getItem('nexora_ref')
      if (savedRef) {
        setReferredBy(savedRef)
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          referredBy: referredBy || undefined 
        }),
      })
      const data = await res.json()
      if (res.ok || res.status === 409) {
        setStatus('success')
        setMyRefLink(data.referralLink)
        setEmail('')
        
        // Save session locally and automatically log in
        if (data.token) {
          localStorage.setItem('nexora_user_email', data.email || email.trim().toLowerCase())
          localStorage.setItem('nexora_session_token', data.token)
          if (onRegisterSuccess) {
            onRegisterSuccess(data.email || email.trim().toLowerCase(), data.token)
          }
        }
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Cannot reach server. Please try again.')
      setStatus('error')
    }
  }

  const handleCopy = () => {
    if (!myRefLink) return
    navigator.clipboard.writeText(myRefLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (status === 'success') {
    return (
      <div className="waitlist-ref-card">
        <div className="waitlist-success">
          <span className="waitlist-success-icon">✔</span>
          <span>You're on the list! Let's launch together.</span>
        </div>
        <div className="waitlist-promo-box">
          <div className="waitlist-promo-header">
            <span>🎁</span>
            <strong>UNLOCKED MILESTONE: FREE PREMIUM</strong>
          </div>
          <p>Get <strong>5 of your developer or designer friends</strong> to join using your referral link, and unlock <strong>1 Month of Nexora Premium completely free</strong> ($29 value)!</p>
          <div className="waitlist-share-group">
            <input 
              type="text" 
              readOnly 
              value={myRefLink} 
              className="waitlist-share-input" 
              onClick={(e) => e.target.select()}
            />
            <button onClick={handleCopy} className="waitlist-share-btn">
              {copied ? 'Copied! ✓' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="hero-waitlist-form" onSubmit={handleSubmit} noValidate>
      <div className="hero-waitlist">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email address..."
          className="hero-waitlist-input"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className={`hero-waitlist-btn${status === 'loading' ? ' loading' : ''}`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Joining...' : 'Join Waitlist ↗'}
        </button>
      </div>
      {status === 'error' && <p className="waitlist-error">{errorMsg}</p>}
      {referredBy && (
        <p className="waitlist-referred-tag">
          ✦ You were referred by code <strong>{referredBy}</strong> (Premium reward active!)
        </p>
      )}
    </form>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LOGIN MODAL (Passwordless 6-digit OTP verification)                        */
/* ─────────────────────────────────────────────────────────────────────────── */
function WaitlistLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1 = request otp, 2 = verify otp
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/auth/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message || 'Verification code sent!')
        setStep(2)
      } else {
        setError(data.error || 'Failed to send verification code.')
      }
    } catch {
      setError('Cannot reach server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        onLoginSuccess(data.user.email, data.token, data.user)
        setEmail('')
        setOtp('')
        setStep(1)
        onClose()
      } else {
        setError(data.error || 'Incorrect verification code.')
      }
    } catch {
      setError('Cannot reach server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep(1)
    setError('')
    setMessage('')
    setOtp('')
  }

  return (
    <div className="vsk-modal-overlay" onClick={onClose}>
      <div className="vsk-modal-card" onClick={e => e.stopPropagation()}>
        <button className="vsk-modal-close" onClick={onClose}>✕</button>
        
        {step === 1 ? (
          <>
            <div className="vsk-modal-header">
              <span className="vsk-modal-title-gradient">🔑 Builder Sign In</span>
              <p className="vsk-modal-subtitle">Enter your registered email to receive a 6-digit login code</p>
            </div>
            <form onSubmit={handleRequestOtp} noValidate>
              <div className="vsk-modal-field">
                <label className="vsk-modal-label">Waitlist Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your registered email..." 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  className="vsk-modal-input"
                  required
                />
              </div>
              {error && <p className="vsk-modal-error">{error}</p>}
              <button type="submit" className="vsk-modal-btn" disabled={loading}>
                {loading ? 'Sending Code...' : 'Request Verification Code →'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="vsk-modal-header">
              <span className="vsk-modal-title-gradient">✔ Verification Sent</span>
              <p className="vsk-modal-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>
            </div>
            <form onSubmit={handleVerifyOtp} noValidate>
              <div className="vsk-modal-field">
                <label className="vsk-modal-label">Verification Code</label>
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="••••••" 
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  className="vsk-modal-input"
                  style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}
                  required
                />
              </div>
              {error && <p className="vsk-modal-error">{error}</p>}
              {message && <p style={{ color: '#6EE7B7', fontSize: '0.82rem', marginBottom: '20px', textAlign: 'center' }}>{message}</p>}
              <button type="submit" className="vsk-modal-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Sign In 🚀'}
              </button>
              <button 
                type="button" 
                onClick={handleBackToEmail} 
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.8rem',
                  marginTop: '16px',
                  width: '100%',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'underline'
                }}
              >
                ← Back to enter email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  USER DASHBOARD MODAL                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
function UserDashboardModal({ isOpen, onClose, user, onRefresh, onLogout }) {
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  if (!isOpen || !user) return null

  const myRefLink = `${window.location.origin}?ref=${user.referralCode}`
  const progress = Math.min((user.referralCount / 5) * 100, 100)
  const isUnlocked = user.referralCount >= 5

  const handleCopy = () => {
    navigator.clipboard.writeText(myRefLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  return (
    <div className="vsk-modal-overlay" onClick={onClose}>
      <div className="vsk-modal-card dashboard-card" onClick={e => e.stopPropagation()}>
        <button className="vsk-modal-close" onClick={onClose}>✕</button>
        
        <div className="vsk-modal-header">
          <div className="dashboard-status-indicator">
            <span className="live-dot"></span> Active Builder waitlist
          </div>
          <h2 className="vsk-modal-title-gradient">✦ Builder Dashboard</h2>
          <p className="vsk-modal-subtitle">{user.email}</p>
        </div>

        {/* ── PROGRESS CARD ── */}
        <div className="dashboard-promo-section">
          <div className="promo-meta">
            <span className="promo-gift-icon">🎁</span>
            <div className="promo-text-wrap">
              <h3>1 Month Free Premium Reward</h3>
              <p>Invite 5 builders to unlock Nexora Premium ($29 value) completely free.</p>
            </div>
          </div>
          
          <div className="promo-progress-wrap">
            <div className="promo-progress-bar-bg">
              <div className="promo-progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="promo-progress-meta">
              <span>{user.referralCount} / 5 invited</span>
              {isUnlocked ? (
                <span className="milestone-badge unlocked">👑 UNLOCKED</span>
              ) : (
                <span className="milestone-badge locked">Locked</span>
              )}
            </div>
          </div>
        </div>

        {/* ── REFERRAL INVITE LINK ── */}
        <div className="dashboard-link-section">
          <label className="section-label">Your Unique Invite Link</label>
          <div className="waitlist-share-group">
            <input 
              type="text" 
              readOnly 
              value={myRefLink} 
              className="waitlist-share-input" 
              onClick={(e) => e.target.select()}
            />
            <button onClick={handleCopy} className="waitlist-share-btn">
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── INVITES LIST ── */}
        <div className="dashboard-referrals-section">
          <div className="section-header-row">
            <label className="section-label">Invited Friends ({user.referralCount})</label>
            <button className="refresh-stats-btn" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Syncing...' : '↻ Sync Data'}
            </button>
          </div>
          <div className="referrals-scrollable-list">
            {user.referrals && user.referrals.length > 0 ? (
              user.referrals.map((ref, idx) => (
                <div className="referral-row-item" key={idx}>
                  <span className="ref-item-email">{ref.email}</span>
                  <span className="ref-item-date">{new Date(ref.joinedAt || ref.joined_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>
              ))
            ) : (
              <div className="referrals-empty-state">
                <p>No referrals yet. Share your invite link to climb the leaderboard! 🚀</p>
              </div>
            )}
          </div>
        </div>

        {/* ── SIGN OUT ACTIONS ── */}
        <div className="dashboard-footer-actions">
          <button className="dashboard-logout-link" onClick={onLogout}>Sign Out</button>
        </div>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  APP                                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [userSession, setUserSession] = useState(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)

  // Re-check and sync session on page load
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('nexora_user_email')
    const savedToken = localStorage.getItem('nexora_session_token')
    if (savedEmail && savedToken) {
      fetch(`${API_URL}/api/waitlist/user/${savedEmail}`, {
        headers: { 'x-session-token': savedToken }
      })
        .then(res => {
          if (res.ok) return res.json()
          throw new Error()
        })
        .then(data => {
          setUserSession(data)
        })
        .catch(() => {
          localStorage.removeItem('nexora_user_email')
          localStorage.removeItem('nexora_session_token')
        })
    }
  }, [])

  const handleLoginSuccess = async (email, token, user) => {
    localStorage.setItem('nexora_user_email', email)
    localStorage.setItem('nexora_session_token', token)
    if (user) {
      setUserSession(user)
      setIsDashboardOpen(true)
    } else {
      try {
        const res = await fetch(`${API_URL}/api/waitlist/user/${email}`, {
          headers: { 'x-session-token': token }
        })
        if (res.ok) {
          const data = await res.json()
          setUserSession(data)
          setIsDashboardOpen(true)
        }
      } catch (err) {
        console.error('Failed to fetch user session details:', err)
      }
    }
  }

  const handleLogout = () => {
    setUserSession(null)
    localStorage.removeItem('nexora_user_email')
    localStorage.removeItem('nexora_session_token')
    setIsDashboardOpen(false)
  }

  const handleRefreshSession = async () => {
    const savedEmail = localStorage.getItem('nexora_user_email')
    const savedToken = localStorage.getItem('nexora_session_token')
    if (!savedEmail || !savedToken) return
    try {
      const res = await fetch(`${API_URL}/api/waitlist/user/${savedEmail}`, {
        headers: { 'x-session-token': savedToken }
      })
      if (res.ok) {
        const data = await res.json()
        setUserSession(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="vsk-root">

      {/* ── NAVBAR ── */}
      <Navbar 
        userSession={userSession}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onLogout={handleLogout}
      />

      {/* ── HERO ── */}
      <section className="vsk-hero" id="home">
        <div className="hero-bg-orbs">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
        </div>
        <div className="hero-content-wrap">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span> Launching Soon — Join the Waitlist
          </div>
          <h1 className="vsk-hero-h1">
            BUILD THE FUTURE<br />
            WITH <span className="hero-text-gradient">PEOPLE</span><br />
            AROUND YOU.
          </h1>
          <p className="vsk-hero-sub">
            We are building the ultimate network for founders, developers, and designers.<br />
            Get early access before we launch.
          </p>
          <WaitlistForm onRegisterSuccess={handleLoginSuccess} />
          
          <div className="hero-avatars">
            <img src="https://i.pravatar.cc/100?img=1" alt="Builder" />
            <img src="https://i.pravatar.cc/100?img=2" alt="Builder" />
            <img src="https://i.pravatar.cc/100?img=3" alt="Builder" />
            <img src="https://i.pravatar.cc/100?img=4" alt="Builder" />
            <div className="hero-avatars-more">1,248</div>
            <span className="hero-avatars-text">builders in the queue</span>
          </div>
        </div>

        <div className="hero-ticker-wrap">
          <div className="hero-ticker-slant">
            <Marquee items={['FIND BUILDERS NEARBY', 'JOIN HACKATHONS', 'MATCH CO-FOUNDERS', 'LAUNCH STARTUPS', 'COLLABORATE IN REAL TIME', 'DISCOVER AI TALENT']} speed={28} />
          </div>
        </div>
      </section>

      {/* ── STATS REMOVED FOR PRE-LAUNCH CLEANLINESS ── */}

      {/* ── TEAM ── */}
      <TeamSection />

      {/* ── FEATURES ACCORDION ── */}
      <FeaturesSection />

      {/* ── BUILDERS LIST ── */}
      <BuildersSection />

      {/* ── PREMIUM FEATURES GRID ── */}
      <PremiumGrid />

      {/* ── VALUES MARQUEE ── */}
      <section className="values-section">
        <Marquee items={['CONNECT', 'COLLABORATE', 'LAUNCH', 'FIND YOUR TEAM', 'BUILD SOMETHING BIG', 'MEET PEOPLE WHO ACTUALLY BUILD']} speed={35} />
        <Marquee items={['HACKATHON READY', 'AI-POWERED', 'REAL TIME', 'STARTUP ECOSYSTEM', 'TURN IDEAS INTO REALITY']} speed={35} reverse />
      </section>

      {/* ── TESTIMONIALS REMOVED FOR PRE-LAUNCH CLEANLINESS ── */}

      {/* ── FOOTER ── */}
      <footer className="vsk-footer" id="contact">
        <div className="footer-cta-section">
          <p className="footer-cta-label">Ready to build?</p>
          <h2 className="footer-cta-heading">
            GET ON THE LIST.<br />
            <span className="footer-cta-accent">LAUNCHING SOON. ↗</span>
          </h2>
        </div>

        <div className="footer-bottom">
          <div className="footer-name-block">NEXORA</div>
          <div className="footer-cols">
            <div className="footer-col">
              <p className="footer-col-head">Platform</p>
              {['Features', 'Builders', 'Platform'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
              ))}
            </div>
            <div className="footer-col">
              <p className="footer-col-head">Coming Soon</p>
              {['Mobile App', 'API Access', 'Builder Marketplace'].map(l => (
                <a key={l} href="#">{l} <span className="coming-pill">Soon</span></a>
              ))}
            </div>
          </div>
          <div className="footer-right-col">
            <a href="mailto:hello@nexora.dev" className="footer-cta-btn">JOIN WAITLIST ↗</a>
            <div className="footer-awards">
              {['Builders', 'Founders', 'Hackers'].map(a => (
                <span key={a} className="footer-award-badge">{a}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-legal">
          <span>© 2026 Nexora · Built by Shaswat. All rights reserved.</span>
          <div className="footer-socials">
            {['LinkedIn', 'Twitter / X', 'GitHub', 'Discord'].map(s => (
              <a key={s} href="#">{s}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      <WaitlistLoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <UserDashboardModal 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={userSession}
        onRefresh={handleRefreshSession}
        onLogout={handleLogout}
      />

    </div>
  )
}
