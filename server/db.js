import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'nexora.db')

// Auto-create directory of database if it does not exist (crucial for cloud persistent volumes)
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(DB_PATH)

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL')

// Check if table needs upgrade or recreation (if old schema exists without referral_code)
try {
  db.prepare('SELECT referral_code FROM waitlist LIMIT 1').get()
} catch (e) {
  console.log('🔄 Upgrading waitlist table schema to support referrals...')
  db.exec('DROP TABLE IF EXISTS waitlist;')
}

// Create tables on startup
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    email             TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    normalized_email  TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    referral_code     TEXT    NOT NULL UNIQUE,
    referred_by       TEXT,
    ip                TEXT,
    joined_at         TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
  CREATE INDEX IF NOT EXISTS idx_waitlist_ref ON waitlist(referral_code);

  CREATE TABLE IF NOT EXISTS otps (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL COLLATE NOCASE,
    otp           TEXT    NOT NULL,
    expires_at    INTEGER NOT NULL,
    verified      INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
`)

// Schema migration checking if normalized_email exists in an old database
try {
  db.prepare('SELECT normalized_email FROM waitlist LIMIT 1').get()
} catch (e) {
  console.log('🔄 Schema upgrade: Adding normalized_email column to existing waitlist table...')
  db.transaction(() => {
    // 1. Add column
    db.prepare('ALTER TABLE waitlist ADD COLUMN normalized_email TEXT').run()
    
    // 2. Populate normalized email for existing records
    const inlineNormalize = (email) => {
      let [local, domain] = email.trim().toLowerCase().split('@')
      if (!local || !domain) return email.toLowerCase().trim()
      if (domain === 'gmail.com' || domain === 'googlemail.com') {
        local = local.replace(/\./g, '')
        const plusIdx = local.indexOf('+')
        if (plusIdx !== -1) local = local.substring(0, plusIdx)
        domain = 'gmail.com'
      } else {
        const plusIdx = local.indexOf('+')
        if (plusIdx !== -1) local = local.substring(0, plusIdx)
      }
      return `${local}@${domain}`
    }

    const rows = db.prepare('SELECT id, email FROM waitlist').all()
    const updateStmt = db.prepare('UPDATE waitlist SET normalized_email = ? WHERE id = ?')
    for (const r of rows) {
      updateStmt.run(inlineNormalize(r.email), r.id)
    }

    // 3. Create unique index
    db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_norm ON waitlist(normalized_email)').run()
  })()
  console.log('✅ Waitlist table schema successfully upgraded.')
}

// Create unique index for normalized_email after schema has been verified/migrated
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_norm ON waitlist(normalized_email);')

export default db
