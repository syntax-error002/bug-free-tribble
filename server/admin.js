export const adminPanel = (secret) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexora Admin</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #080808; --bg2: #101010; --surface: #171717;
      --border: rgba(255,255,255,0.07);
      --text: #f5f0eb; --muted: rgba(245,240,235,0.42);
      --orange: #FF4E20; --teal: #6EE7B7; --red: #ff6b6b;
    }
    body { background: var(--bg); color: var(--text); font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; }

    /* ── LOGIN ── */
    #login-screen {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: 24px;
      background: radial-gradient(ellipse at 20% 30%, rgba(255,78,32,0.12) 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 70%, rgba(129,140,248,0.1) 0%, transparent 60%);
    }
    .login-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 24px; padding: 48px 40px; width: 100%; max-width: 420px;
      box-shadow: 0 32px 64px rgba(0,0,0,0.6);
    }
    .login-logo {
      font-size: 1.6rem; font-weight: 900; letter-spacing: 0.12em;
      background: linear-gradient(90deg, #FF4E20, #F3C930);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 8px;
    }
    .login-sub { font-size: 0.85rem; color: var(--muted); margin-bottom: 36px; }
    .login-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: block; }
    .login-input {
      width: 100%; background: rgba(255,255,255,0.04); border: 1px solid var(--border);
      border-radius: 12px; color: var(--text); font-size: 1rem; padding: 14px 18px; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 16px;
    }
    .login-input:focus { border-color: rgba(255,255,255,0.2); box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }
    .login-btn {
      width: 100%; background: var(--text); color: var(--bg); font-weight: 700;
      font-size: 0.95rem; padding: 15px; border: none; border-radius: 12px;
      cursor: pointer; transition: opacity 0.2s, transform 0.2s; margin-top: 4px;
    }
    .login-btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .login-error { color: var(--red); font-size: 0.83rem; margin-top: 12px; display: none; text-align: center; }

    /* ── DASHBOARD ── */
    #dashboard { display: none; }
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 32px; height: 64px;
      border-bottom: 1px solid var(--border); background: var(--bg2);
      position: sticky; top: 0; z-index: 10;
    }
    .topbar-logo { font-size: 1.2rem; font-weight: 900; letter-spacing: 0.1em;
      background: linear-gradient(90deg,#FF4E20,#F3C930);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .topbar-right { display: flex; align-items: center; gap: 16px; }
    .live-dot { width: 8px; height: 8px; background: var(--teal); border-radius: 50%;
      box-shadow: 0 0 8px var(--teal); animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .topbar-badge { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.05em; }
    .logout-btn {
      background: rgba(255,255,255,0.06); border: 1px solid var(--border);
      color: var(--muted); font-size: 0.8rem; padding: 8px 16px; border-radius: 8px;
      cursor: pointer; transition: background 0.2s;
    }
    .logout-btn:hover { background: rgba(255,255,255,0.1); color: var(--text); }

    .main { padding: 32px; max-width: 1200px; margin: 0 auto; }

    /* ── STATS ── */
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px 28px;
    }
    .stat-card-num { font-size: 2.4rem; font-weight: 700; color: var(--text); line-height: 1; margin-bottom: 6px; }
    .stat-card-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
    .stat-card-num.orange { color: var(--orange); }
    .stat-card-num.teal { color: var(--teal); }

    /* ── TABLE CARD ── */
    .table-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
    .table-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid var(--border);
    }
    .table-title { font-size: 0.9rem; font-weight: 600; letter-spacing: 0.02em; }
    .table-actions { display: flex; gap: 10px; align-items: center; }
    .search-input {
      background: rgba(255,255,255,0.04); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); font-size: 0.85rem;
      padding: 8px 14px; outline: none; width: 220px; transition: border-color 0.2s;
    }
    .search-input:focus { border-color: rgba(255,255,255,0.2); }
    .export-btn {
      background: rgba(110,231,183,0.1); border: 1px solid rgba(110,231,183,0.25);
      color: var(--teal); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em;
      padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: background 0.2s;
    }
    .export-btn:hover { background: rgba(110,231,183,0.18); }

    table { width: 100%; border-collapse: collapse; }
    thead th {
      text-align: left; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--muted); padding: 14px 24px;
      border-bottom: 1px solid var(--border); background: var(--bg2);
    }
    tbody tr { transition: background 0.15s; }
    tbody tr:hover { background: rgba(255,255,255,0.025); }
    tbody tr:not(:last-child) td { border-bottom: 1px solid var(--border); }
    tbody td { padding: 14px 24px; font-size: 0.88rem; color: var(--text); }
    .td-id { color: var(--muted); font-size: 0.78rem; font-family: monospace; }
    .td-email { font-weight: 500; }
    .td-date { color: var(--muted); font-size: 0.82rem; }
    .td-ip { color: var(--muted); font-size: 0.78rem; font-family: monospace; }
    .badge { display: inline-block; background: rgba(110,231,183,0.1); color: var(--teal);
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      padding: 3px 10px; border-radius: 100px; border: 1px solid rgba(110,231,183,0.2); }
    .badge.premium { background: rgba(243,201,48,0.1); color: #F3C930; border: 1px solid rgba(243,201,48,0.25); }

    .empty-state { text-align: center; padding: 60px 24px; color: var(--muted); font-size: 0.9rem; }
    .pagination { display: flex; align-items: center; justify-content: space-between;
      padding: 16px 24px; border-top: 1px solid var(--border); }
    .pg-info { font-size: 0.82rem; color: var(--muted); }
    .pg-btns { display: flex; gap: 8px; }
    .pg-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: var(--text);
      font-size: 0.8rem; padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .pg-btn:hover:not(:disabled) { background: rgba(255,255,255,0.12); }
    .pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  </style>
</head>
<body>

<!-- ── LOGIN ── -->
<div id="login-screen">
  <div class="login-card">
    <div class="login-logo">NEXORA</div>
    <p class="login-sub">Admin Panel — Enter your secret to continue</p>
    <label class="login-label">Admin Secret</label>
    <input id="secret-input" type="password" class="login-input" placeholder="••••••••••••" autocomplete="current-password" />
    <button class="login-btn" onclick="doLogin()">Unlock Dashboard →</button>
    <p class="login-error" id="login-error">Incorrect secret. Try again.</p>
  </div>
</div>

<!-- ── DASHBOARD ── -->
<div id="dashboard">
  <div class="topbar">
    <div class="topbar-logo">NEXORA ADMIN</div>
    <div class="topbar-right">
      <div class="live-dot"></div>
      <span class="topbar-badge">Live</span>
      <button class="logout-btn" onclick="logout()">Log out</button>
    </div>
  </div>

  <div class="main">
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-card-num orange" id="stat-total">—</div>
        <div class="stat-card-label">Total Signups</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-num teal" id="stat-today">—</div>
        <div class="stat-card-label">Joined Today</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-num" id="stat-latest">—</div>
        <div class="stat-card-label">Latest Signup</div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <span class="table-title">Waitlist Signups</span>
        <div class="table-actions">
          <input class="search-input" type="text" placeholder="Search email..." oninput="filterTable(this.value)" />
          <button class="export-btn" onclick="exportCSV()">↓ Export CSV</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Code</th>
            <th>Referrals</th>
            <th>Status</th>
            <th>Referred By</th>
            <th>Joined At</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody id="table-body">
          <tr><td colspan="8" class="empty-state">Loading...</td></tr>
        </tbody>
      </table>
      <div class="pagination">
        <span class="pg-info" id="pg-info">— entries</span>
        <div class="pg-btns">
          <button class="pg-btn" id="pg-prev" onclick="changePage(-1)" disabled>← Prev</button>
          <button class="pg-btn" id="pg-next" onclick="changePage(1)">Next →</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  const PAGE_SIZE = 20
  let secret = ''
  let allEntries = []
  let filtered = []
  let page = 0

  function doLogin() {
    secret = document.getElementById('secret-input').value.trim()
    if (!secret) return
    fetchData()
  }

  document.getElementById('secret-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin()
  })

  async function fetchData() {
    try {
      const res = await fetch('/api/waitlist', {
        headers: { 'x-admin-secret': secret }
      })
      if (res.status === 401) {
        document.getElementById('login-error').style.display = 'block'
        return
      }
      const data = await res.json()
      allEntries = data.entries || []
      filtered = allEntries
      page = 0

      // Stats
      const today = new Date().toISOString().slice(0, 10)
      const todayCount = allEntries.filter(e => e.joined_at.startsWith(today)).length
      document.getElementById('stat-total').textContent = allEntries.length
      document.getElementById('stat-today').textContent = todayCount
      document.getElementById('stat-latest').textContent =
        allEntries.length ? timeAgo(allEntries[0].joined_at) : '—'

      renderTable()

      document.getElementById('login-screen').style.display = 'none'
      document.getElementById('dashboard').style.display = 'block'
    } catch {
      document.getElementById('login-error').textContent = 'Server unreachable.'
      document.getElementById('login-error').style.display = 'block'
    }
  }

  function renderTable() {
    const tbody = document.getElementById('table-body')
    const start = page * PAGE_SIZE
    const slice = filtered.slice(start, start + PAGE_SIZE)

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No entries found.</td></tr>'
      document.getElementById('pg-info').textContent = '0 entries'
      document.getElementById('pg-prev').disabled = true
      document.getElementById('pg-next').disabled = true
      return
    }

    tbody.innerHTML = slice.map((e, i) => {
      const isWinner = e.referral_count >= 5;
      const statusBadge = isWinner 
        ? '<span class="badge premium">👑 Premium Win</span>'
        : '<span class="badge">Confirmed</span>';
      
      return \`
        <tr>
          <td class="td-id">\${start + i + 1}</td>
          <td class="td-email">\${escHtml(e.email)}</td>
          <td style="font-family:monospace; font-weight:600; color:rgba(255,255,255,0.85);">\${escHtml(e.referral_code)}</td>
          <td style="font-weight:700; color: \${isWinner ? '#F3C930' : 'rgba(255,255,255,0.7)'};">\${e.referral_count || 0}</td>
          <td>\${statusBadge}</td>
          <td style="font-family:monospace; color:rgba(255,255,255,0.4);">\${escHtml(e.referred_by || '—')}</td>
          <td class="td-date">\${formatDate(e.joined_at)}</td>
          <td class="td-ip">\${escHtml(e.ip || '—')}</td>
        </tr>
      \`;
    }).join('')

    const total = filtered.length
    const totalPages = Math.ceil(total / PAGE_SIZE)
    document.getElementById('pg-info').textContent =
      \`\${start + 1}–\${Math.min(start + PAGE_SIZE, total)} of \${total} entries\`
    document.getElementById('pg-prev').disabled = page === 0
    document.getElementById('pg-next').disabled = page >= totalPages - 1
  }

  function changePage(dir) {
    page += dir
    renderTable()
  }

  function filterTable(q) {
    const query = q.toLowerCase()
    filtered = query
      ? allEntries.filter(e => e.email.toLowerCase().includes(query))
      : allEntries
    page = 0
    renderTable()
  }

  function exportCSV() {
    const header = 'id,email,referral_code,referrals,referred_by,joined_at,ip'
    const rows = filtered.map(e =>
      \`\${e.id},"\${e.email.replace(/"/g, '""')}",\${e.referral_code},\${e.referral_count || 0},\${e.referred_by || ''},\${e.joined_at},\${e.ip || ''}\`
    )
    const blob = new Blob([header + '\\n' + rows.join('\\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`nexora-waitlist-\${new Date().toISOString().slice(0,10)}.csv\`
    a.click()
    URL.revokeObjectURL(url)
  }

  function logout() {
    secret = ''
    allEntries = []
    filtered = []
    document.getElementById('secret-input').value = ''
    document.getElementById('login-error').style.display = 'none'
    document.getElementById('dashboard').style.display = 'none'
    document.getElementById('login-screen').style.display = 'flex'
  }

  function formatDate(str) {
    if (!str) return '—'
    const d = new Date(str.includes('T') ? str : str + 'Z')
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  function timeAgo(str) {
    if (!str) return '—'
    const d = new Date(str.includes('T') ? str : str + 'Z')
    const diff = (Date.now() - d) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
    return Math.floor(diff / 86400) + 'd ago'
  }

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))
  }
</script>
</body>
</html>
`
