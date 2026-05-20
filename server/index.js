import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './db.js'
import { adminPanel } from './admin.js'
import { fileURLToPath } from 'url'
import path from 'path'
import crypto from 'crypto'
import { sendWelcomeEmail, sendOTPEmail } from './mailer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const app = express()
const PORT = process.env.PORT || 3001

// Configure Express to trust proxies (essential for accurate rate limiting on services like Heroku, Nginx, Cloudflare)
app.set('trust proxy', 1)

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))
app.use(express.json())

// ── Simple rate-limit store (in-memory, per IP, 5 req/min, bypassed on localhost) ───
const rateMap = new Map()
function rateLimit(req, res, next) {
  const ip = req.ip
  // Bypass rate limiting on localhost for easy local testing
  if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
    return next()
  }
  const now = Date.now()
  const entry = rateMap.get(ip) || { count: 0, start: now }
  if (now - entry.start > 60_000) { 
    entry.count = 0 
    entry.start = now 
  }
  entry.count++
  rateMap.set(ip, entry)
  if (entry.count > 5) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' })
  }
  next()
}

// ── Email Validator ──
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// ── Email Normalization Helper (Gmail dots/aliases bypass prevention) ──
function normalizeEmail(email) {
  if (typeof email !== 'string') return ''
  let [localPart, domain] = email.trim().toLowerCase().split('@')
  if (!localPart || !domain) return email.trim().toLowerCase()
  
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Remove dots
    localPart = localPart.replace(/\./g, '')
    // Remove everything after plus '+'
    const plusIndex = localPart.indexOf('+')
    if (plusIndex !== -1) {
      localPart = localPart.substring(0, plusIndex)
    }
    domain = 'gmail.com'
  } else {
    // For other domains, standard plus suffix removal
    const plusIndex = localPart.indexOf('+')
    if (plusIndex !== -1) {
      localPart = localPart.substring(0, plusIndex)
    }
  }
  
  return `${localPart}@${domain}`
}

// ── Cryptographic User Session Token Generator ──
function generateUserSessionToken(email) {
  const secret = process.env.ADMIN_SECRET || 'nexora_fallback_dashboard_secret_2026'
  return crypto.createHmac('sha256', secret).update(email.toLowerCase().trim()).digest('hex')
}

// ── Session Authorization Middleware ──
function verifyUserSession(req, res, next) {
  const { email } = req.params
  const token = req.headers['x-session-token']
  
  if (!email || !token) {
    return res.status(401).json({ error: 'Unauthorized: Missing session verification' })
  }
  
  const expectedToken = generateUserSessionToken(email)
  
  try {
    const tokenBuffer = Buffer.from(token)
    const expectedBuffer = Buffer.from(expectedToken)
    if (tokenBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {
      return next()
    }
  } catch (err) {
    // Buffers length mismatch or other error
  }
  
  return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' })
}

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/waitlist — join the waitlist
app.post('/api/waitlist', rateLimit, async (req, res) => {
  const { email, referredBy } = req.body

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const cleanEmail = email.trim().toLowerCase()
  const normEmail = normalizeEmail(cleanEmail)
  const ip = req.ip

  try {
    // 1. Check if the user is already on the waitlist (using UNIQUE normalized_email)
    const existingUser = db.prepare('SELECT email, referral_code FROM waitlist WHERE normalized_email = ?').get(normEmail)
    const clientUrl = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
    
    if (existingUser) {
      const refCode = existingUser.referral_code
      return res.status(409).json({
        error: "You're already on the list! We'll notify you at launch.",
        email: existingUser.email,
        referralCode: refCode,
        referralLink: `${clientUrl}?ref=${refCode}`,
        token: generateUserSessionToken(existingUser.email)
      })
    }

    // 2. Anti-Spam: Check if this IP has already registered more than 5 times (bypassed on localhost for development testing)
    if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
      const ipCheck = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE ip = ?').get(ip)
      if (ipCheck && ipCheck.count >= 5) {
        return res.status(400).json({ error: 'Too many registrations from this IP address. Please contact support.' })
      }
    }

    // 3. Generate a unique referral code
    let referralCode = ''
    let isUnique = false
    let attempts = 0
    while (!isUnique && attempts < 10) {
      referralCode = 'NEX-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      const exists = db.prepare('SELECT id FROM waitlist WHERE referral_code = ?').get(referralCode)
      if (!exists) isUnique = true
      attempts++
    }

    // 4. Validate referredBy code exists
    let activeReferrer = null
    if (referredBy && typeof referredBy === 'string') {
      const referrerRow = db.prepare('SELECT email, normalized_email, referral_code, ip FROM waitlist WHERE referral_code = ?').get(referredBy.trim())
      if (referrerRow) {
        // Prevent Self-Referral: base normalized email matches referrer
        if (referrerRow.normalized_email === normEmail) {
          return res.status(400).json({ error: 'Nice try! You cannot refer yourself.' })
        }
        
        // Prevent Self-Referral: referee has the same IP as the referrer (no referral credit)
        if (referrerRow.ip === ip && ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
          console.warn(`[waitlist] Self-referral ignored: Referee ${cleanEmail} shares IP (${ip}) with Referrer ${referrerRow.email}`)
        } else {
          activeReferrer = referrerRow.referral_code
        }
      }
    }

    // 5. Insert to DB
    const stmt = db.prepare('INSERT INTO waitlist (email, normalized_email, referral_code, referred_by, ip) VALUES (?, ?, ?, ?, ?)')
    stmt.run(cleanEmail, normEmail, referralCode, activeReferrer, ip)

    // 6. Trigger welcoming email asynchronously
    sendWelcomeEmail(cleanEmail, referralCode, clientUrl).catch(err => {
      console.error('[waitlist] Async welcome email error:', err.message)
    })

    // 7. Check if the referrer has hit a milestone (every 5 referrals, e.g. 5, 10, 15)
    if (activeReferrer) {
      const referrals = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE referred_by = ?').get(activeReferrer)
      const count = referrals.count
      if (count > 0 && count % 5 === 0) {
        const referrerInfo = db.prepare('SELECT email FROM waitlist WHERE referral_code = ?').get(activeReferrer)
        console.log('\n🏆 [MILESTONE HIT] ──────────────────────────────────────────')
        console.log(`│ User ${referrerInfo.email} (${activeReferrer}) has successfully referred ${count} users!`)
        console.log(`│ Reward Unlocked: 1 Month of Nexora Premium completely free!`)
        console.log('└────────────────────────────────────────────────────────────\n')
      }
    }

    return res.status(201).json({
      message: "You're on the list! We'll notify you at launch.",
      email: cleanEmail,
      referralCode: referralCode,
      referralLink: `${clientUrl}?ref=${referralCode}`,
      token: generateUserSessionToken(cleanEmail)
    })
  } catch (err) {
    console.error('[waitlist] Error during signup:', err.message)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

// POST /api/auth/otp — Request a 6-digit passwordless verification code
app.post('/api/auth/otp', rateLimit, async (req, res) => {
  const { email } = req.body
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }
  
  const cleanEmail = email.trim().toLowerCase()
  const normEmail = normalizeEmail(cleanEmail)
  
  // Verify email exists on waitlist
  const user = db.prepare('SELECT email FROM waitlist WHERE normalized_email = ?').get(normEmail)
  if (!user) {
    return res.status(404).json({ error: 'This email is not on our waitlist. Join us first!' })
  }
  
  try {
    // Generate secure 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    
    // Clear pending OTPs for this user
    db.prepare('DELETE FROM otps WHERE email = ?').run(user.email)
    
    // Insert new OTP
    const stmt = db.prepare('INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)')
    stmt.run(user.email, otp, expiresAt)
    
    // Send email asynchronously
    const clientUrl = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
    sendOTPEmail(user.email, otp, clientUrl).catch(err => {
      console.error('[auth] Async OTP email error:', err.message)
    })
    
    return res.json({ message: 'Verification code sent to your email address!' })
  } catch (err) {
    console.error('[auth] OTP error:', err.message)
    return res.status(500).json({ error: 'Failed to generate code. Please try again.' })
  }
})

// POST /api/auth/verify — Verify the 6-digit OTP code and authenticate
app.post('/api/auth/verify', rateLimit, async (req, res) => {
  const { email, otp } = req.body
  if (!isValidEmail(email) || !otp) {
    return res.status(400).json({ error: 'Missing email or verification code.' })
  }
  
  const cleanEmail = email.trim().toLowerCase()
  const normEmail = normalizeEmail(cleanEmail)
  
  try {
    const user = db.prepare('SELECT email FROM waitlist WHERE normalized_email = ?').get(normEmail)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    
    const record = db.prepare('SELECT otp, expires_at, verified FROM otps WHERE email = ?').get(user.email)
    if (!record) {
      return res.status(400).json({ error: 'No code found. Please request a new one.' })
    }
    
    if (record.verified === 1) {
      return res.status(400).json({ error: 'Code already verified. Please request a new one.' })
    }
    
    if (Date.now() > record.expires_at) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' })
    }
    
    // Timing-safe verification of the OTP code
    const inputBuf = Buffer.from(otp.trim())
    const dbBuf = Buffer.from(record.otp)
    if (inputBuf.length !== dbBuf.length || !crypto.timingSafeEqual(inputBuf, dbBuf)) {
      return res.status(400).json({ error: 'Incorrect verification code. Please try again.' })
    }
    
    // Mark OTP as verified/used
    db.prepare('UPDATE otps SET verified = 1 WHERE email = ?').run(user.email)
    
    // Generate user session token
    const token = generateUserSessionToken(user.email)
    
    // Fetch full user session data
    const userData = db.prepare('SELECT email, referral_code, referred_by, joined_at FROM waitlist WHERE email = ?').get(user.email)
    const referralsCount = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE referred_by = ?').get(userData.referral_code)
    const referrals = db.prepare('SELECT email, joined_at FROM waitlist WHERE referred_by = ? ORDER BY joined_at DESC').all(userData.referral_code)
    
    const obfuscatedReferrals = referrals.map(r => {
      const parts = r.email.split('@')
      const name = parts[0]
      const domain = parts[1]
      const maskedName = name.length > 2 
        ? name.substring(0, 2) + '*'.repeat(name.length - 2)
        : name.substring(0, 1) + '*'
      return {
        email: `${maskedName}@${domain}`,
        joined_at: r.joined_at
      }
    })
    
    return res.json({
      message: 'Successfully verified!',
      token: token,
      user: {
        email: userData.email,
        referralCode: userData.referral_code,
        referredBy: userData.referred_by,
        joinedAt: userData.joined_at,
        referralCount: referralsCount.count,
        referrals: obfuscatedReferrals
      }
    })
  } catch (err) {
    console.error('[auth] OTP verification error:', err.message)
    return res.status(500).json({ error: 'Verification failed. Please try again.' })
  }
})

// GET /api/waitlist/count — how many people signed up (public)
app.get('/api/waitlist/count', (req, res) => {
  const row = db.prepare('SELECT COUNT(*) as count FROM waitlist').get()
  res.json({ count: row.count })
})

// GET /api/waitlist/user/:email — fetch individual user referral dashboard data (requires verification)
app.get('/api/waitlist/user/:email', verifyUserSession, (req, res) => {
  const email = req.params.email.trim().toLowerCase()
  const normEmail = normalizeEmail(email)

  const user = db.prepare('SELECT email, referral_code, referred_by, joined_at FROM waitlist WHERE normalized_email = ?').get(normEmail)
  if (!user) {
    return res.status(404).json({ error: 'This email is not on our waitlist yet. Join us first!' })
  }

  // Get total count of referrals
  const referralsCount = db.prepare('SELECT COUNT(*) as count FROM waitlist WHERE referred_by = ?').get(user.referral_code)
  
  // Get list of referred users (obfuscated emails for privacy)
  const referrals = db.prepare('SELECT email, joined_at FROM waitlist WHERE referred_by = ? ORDER BY joined_at DESC').all(user.referral_code)
  
  const obfuscatedReferrals = referrals.map(r => {
    const parts = r.email.split('@')
    const name = parts[0]
    const domain = parts[1]
    const maskedName = name.length > 2 
      ? name.substring(0, 2) + '*'.repeat(name.length - 2)
      : name.substring(0, 1) + '*'
    return {
      email: `${maskedName}@${domain}`,
      joined_at: r.joined_at
    }
  })

  res.json({
    email: user.email,
    referralCode: user.referral_code,
    referredBy: user.referred_by,
    joinedAt: user.joined_at,
    referralCount: referralsCount.count,
    referrals: obfuscatedReferrals
  })
})

// GET /api/waitlist — list all signups (admin only, timing-safe secured)
app.get('/api/waitlist', (req, res) => {
  const secret = req.headers['x-admin-secret']
  const configuredSecret = process.env.ADMIN_SECRET || ''

  if (!configuredSecret || configuredSecret.length < 8) {
    console.error('🚨 WARNING: process.env.ADMIN_SECRET is not configured properly or is too weak.')
    return res.status(500).json({ error: 'Server security configuration error.' })
  }

  if (!secret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const inputBuf = Buffer.from(secret)
    const configBuf = Buffer.from(configuredSecret)
    if (inputBuf.length !== configBuf.length || !crypto.timingSafeEqual(inputBuf, configBuf)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const rows = db.prepare(`
    SELECT 
      w1.id, 
      w1.email, 
      w1.referral_code, 
      w1.referred_by, 
      w1.ip, 
      w1.joined_at,
      (SELECT COUNT(*) FROM waitlist w2 WHERE w2.referred_by = w1.referral_code) as referral_count
    FROM waitlist w1 
    ORDER BY w1.joined_at DESC
  `).all()
  res.json({ total: rows.length, entries: rows })
})

// GET /admin — admin panel UI
app.get('/admin', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(adminPanel())
})

// GET / — health check / API info page
app.get('/', (req, res) => {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM waitlist').get()
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Nexora API</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #f5f0eb; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
        .card { background: #141414; border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 48px; max-width: 520px; width: 100%; }
        .dot { width: 10px; height: 10px; background: #6EE7B7; border-radius: 50%; display: inline-block; margin-right: 8px; box-shadow: 0 0 8px #6EE7B7; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        h1 { font-size: 2rem; letter-spacing: 0.08em; margin: 20px 0 8px; background: linear-gradient(90deg,#FF4E20,#F3C930); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .sub { color: rgba(255,255,255,0.45); font-size: 0.9rem; margin-bottom: 32px; }
        .stat { font-size: 3rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .stat-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin-bottom: 32px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        td { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); }
        td:first-child { color: rgba(255,255,255,0.3); width: 40px; }
        td code { background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px; color: #6EE7B7; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <div><span class="dot"></span><span style="font-size:0.8rem;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase">Server Running</span></div>
        <h1>NEXORA API</h1>
        <p class="sub">Built with Express + SQLite &mdash; zero third-party services.</p>
        <div class="stat">${count}</div>
        <div class="stat-label">waitlist signups</div>
        <table>
          <tr><td>POST</td><td><code>/api/waitlist</code> &nbsp;&mdash; Join waitlist</td></tr>
          <tr><td>GET</td><td><code>/api/waitlist/count</code> &nbsp;&mdash; Total count</td></tr>
          <tr><td>POST</td><td><code>/api/auth/otp</code> &nbsp;&mdash; Request OTP Login</td></tr>
          <tr><td>POST</td><td><code>/api/auth/verify</code> &nbsp;&mdash; Verify OTP Login</td></tr>
          <tr><td>GET</td><td><code>/api/waitlist</code> &nbsp;&mdash; Admin list (requires header)</td></tr>
        </table>
      </div>
    </body>
    </html>
  `)
})

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Nexora API running at http://localhost:${PORT}`)
})
