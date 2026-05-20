import React, { useState, useEffect } from 'react'
import './LoadingScreen.css'

/* ── 3 LOADING STEPS ── */
const STEPS = [
  { id: 'connect',   icon: '⚡', label: 'Initialising' },
  { id: 'builders',  icon: '🚀', label: 'Loading Platform' },
  { id: 'launch',    icon: '✦',  label: 'Almost Ready' },
]

/* timing (ms) when each step becomes active */
const STEP_TIMINGS = [0, 900, 1800]
/* total duration before exit */
const TOTAL_MS = 2900
/* progress % at each milestone */
const PROGRESS_AT = [8, 48, 88, 100]

export default function LoadingScreen({ onDone }) {
  const [activeStep, setActiveStep] = useState(0)   // 0‑based index of active step
  const [doneSteps,  setDoneSteps]  = useState([])  // indices of completed steps
  const [progress,   setProgress]   = useState(0)
  const [exiting,    setExiting]    = useState(false)
  const [statusText, setStatusText] = useState('Connecting...')

  /* ── STATUS MESSAGES ── */
  const STATUS_MSGS = [
    'Connecting...',
    'Loading platform...',
    'Almost ready...',
    'Welcome to Nexora 🚀',
  ]

  useEffect(() => {
    const timers = []

    // Step transitions
    STEP_TIMINGS.forEach((ms, i) => {
      timers.push(setTimeout(() => {
        setActiveStep(i)
        setDoneSteps(prev => (i > 0 ? [...prev, i - 1] : prev))
        setProgress(PROGRESS_AT[i])
        setStatusText(STATUS_MSGS[i])
      }, ms))
    })

    // Final state — mark all done, 100%
    timers.push(setTimeout(() => {
      setDoneSteps([0, 1, 2])
      setProgress(100)
      setStatusText(STATUS_MSGS[3])
    }, TOTAL_MS))

    // Begin exit animation
    timers.push(setTimeout(() => {
      setExiting(true)
    }, TOTAL_MS + 300))

    // Call onDone after exit animation completes
    timers.push(setTimeout(() => {
      if (onDone) onDone()
    }, TOTAL_MS + 1000))

    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`loader-overlay${exiting ? ' loader-exit' : ''}`}>

      {/* Decor */}
      <div className="loader-grid" />
      <div className="loader-orb loader-orb-1" />
      <div className="loader-orb loader-orb-2" />
      <div className="loader-orb loader-orb-3" />

      {/* ── SECTION 1: LOGO ── */}
      <div className="loader-section-top">
        <div className="loader-logo-wrap">
          <div className="loader-logo-ring" />
          <div className="loader-logo-ring" />
          <div className="loader-logo-ring" />
          <div className="loader-logo-icon">
            <span className="loader-logo-letter">N</span>
          </div>
        </div>
        <span className="loader-brand-name">NEXORA</span>
        <span className="loader-tagline">Build · Connect · Launch</span>
      </div>

      {/* ── SECTION 2: 3 STEPS ── */}
      <div className="loader-section-mid">
        {STEPS.map((step, idx) => {
          const isActive = activeStep === idx && !doneSteps.includes(idx)
          const isDone   = doneSteps.includes(idx)
          const isConn   = idx < STEPS.length - 1

          return (
            <React.Fragment key={step.id}>
              <div className={`loader-step${isActive ? ' step-active' : ''}${isDone ? ' step-done' : ''}`}>
                <div className="loader-step-icon-wrap">
                  <div className="loader-step-ring" />
                  <span className="loader-step-icon">{step.icon}</span>
                  <div className="loader-step-check">✓</div>
                </div>
                <span className="loader-step-label">{step.label}</span>
              </div>
              {isConn && (
                <div className={`loader-step-connector${isDone ? ' conn-active' : ''}`} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* ── SECTION 3: PROGRESS BAR ── */}
      <div className="loader-section-bot">
        <div className="loader-progress-track">
          <div
            className="loader-progress-fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="loader-progress-glow"
            style={{ left: `calc(${progress}% - 20px)` }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="loader-status-text">{statusText}</span>
          <span className="loader-percent">{progress}%</span>
        </div>
      </div>

    </div>
  )
}
