import React, { useState, useEffect } from 'react'
import './LoadingScreen.css'

const STEPS = [
  { num: '01', text: 'Initialising' },
  { num: '02', text: 'Loading modules' },
  { num: '03', text: 'Ready' },
]

/* ms when each step becomes active */
const TIMINGS    = [0, 850, 1750]
const TOTAL_MS   = 2600
const PCT_AT     = [12, 52, 88, 100]

export default function LoadingScreen({ onDone }) {
  const [phase,    setPhase]    = useState(0)   // which step is active
  const [done,     setDone]     = useState([])  // completed step indices
  const [visible,  setVisible]  = useState([])  // rows that have slid in
  const [progress, setProgress] = useState(0)
  const [exiting,  setExiting]  = useState(false)

  useEffect(() => {
    const ts = []

    /* stagger row appearance */
    STEPS.forEach((_, i) => {
      ts.push(setTimeout(() => setVisible(v => [...v, i]), i * 120))
    })

    /* step transitions */
    TIMINGS.forEach((ms, i) => {
      ts.push(setTimeout(() => {
        setPhase(i)
        if (i > 0) setDone(d => [...d, i - 1])
        setProgress(PCT_AT[i])
      }, ms))
    })

    /* finish */
    ts.push(setTimeout(() => {
      setDone([0, 1, 2])
      setProgress(100)
    }, TOTAL_MS))

    ts.push(setTimeout(() => setExiting(true), TOTAL_MS + 350))
    ts.push(setTimeout(() => { if (onDone) onDone() }, TOTAL_MS + 950))

    return () => ts.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDone = done.includes
  const allDone = done.length === STEPS.length

  return (
    <div className={`loader-overlay${exiting ? ' loader-exit' : ''}`}>

      {/* ── SECTION 1: 3 ROWS ── */}
      <div className="loader-lines">
        {STEPS.map((step, i) => {
          const isActive  = phase === i && !done.includes(i)
          const isDoneRow = done.includes(i)
          const isVisible = visible.includes(i)

          return (
            <div
              key={step.num}
              className={[
                'loader-line-row',
                isVisible  ? 'line-visible' : '',
                isActive   ? 'line-active'  : '',
                isDoneRow  ? 'line-done'    : '',
              ].join(' ')}
            >
              <span className="loader-line-num">{step.num}</span>
              <span className="loader-line-dot" />
              <span className="loader-line-text">{step.text}</span>
              <span className="loader-line-status">
                {isDoneRow ? 'done' : isActive ? '···' : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── SECTION 2: PROGRESS TRACK ── */}
      <div className="loader-track-wrap">
        <div className="loader-track">
          <div className="loader-track-fill" style={{ width: `${progress}%` }} />
          <div className="loader-track-tip"  style={{ left: `${progress}%` }} />
        </div>

        {/* ── SECTION 3: META ── */}
        <div className="loader-meta">
          <span className="loader-meta-label">
            {allDone ? 'Complete' : 'Loading'}
          </span>
          <span className={`loader-meta-pct${allDone ? ' pct-done' : ''}`}>
            {progress}%
          </span>
        </div>
      </div>

    </div>
  )
}
