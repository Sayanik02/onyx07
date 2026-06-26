/* ────────────────────────────────────────────────────────────
   Onyx Dashboard — shared JS  v3  (Discord OAuth)
   Requires assets/config.js loaded before this file.
──────────────────────────────────────────────────────────── */

const GUILD_KEY      = 'onyx_guild_id';
const GUILD_NAME_KEY = 'onyx_guild_name';
const TOKEN_KEY      = 'onyx_token';

function getApiBase() {
  return (window.ONYX_API_BASE || '').replace(/\/$/, '');
}

function getToken()     { return sessionStorage.getItem(TOKEN_KEY); }
function getGuildId()   { return sessionStorage.getItem(GUILD_KEY); }
function getGuildName() { return sessionStorage.getItem(GUILD_NAME_KEY) || 'Your Server'; }

function clearSession() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

async function api(path, options = {}) {
  const token   = getToken();
  const guildId = getGuildId();
  if (!token)   { window.location.href = 'index.html'; return null; }
  if (!guildId) { window.location.href = 'guilds.html'; return null; }

  const url = `${getApiBase()}/api/guild/${guildId}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type':    'application/json',
      'X-Session-Token': token,
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) { clearSession(); return null; }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

/* Toast notification */
function toast(msg, type = 'success') {
  const colors = { success: '#3DD68C', error: '#FF6B6B', info: '#5B8DFF' };
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
    background: '#0E1422', border: `1px solid ${colors[type] || colors.info}`,
    color: colors[type] || colors.info, padding: '12px 18px', borderRadius: '10px',
    fontSize: '13px', fontWeight: '600', boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
    transition: 'opacity .3s', fontFamily: 'Inter, sans-serif', maxWidth: '320px',
  });
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

/* Toggle helpers */
function initToggle(el, onFn) {
  el.addEventListener('click', () => {
    el.classList.toggle('on');
    if (onFn) onFn(el.classList.contains('on'));
  });
}

/* Fill server info in sidebar */
function fillSidebarGuild() {
  const name   = getGuildName();
  const nameEl = document.querySelector('.server-name');
  const iconEl = document.querySelector('.server-icon');
  if (nameEl) nameEl.textContent = name;
  if (iconEl) iconEl.textContent = name.slice(0, 2).toUpperCase();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', clearGuild);
}

/* Guard — redirect to landing if no guild set */
function requireGuild() {
  if (!getGuildId()) { window.location.href = 'index.html'; return false; }
  fillSidebarGuild();
  return true;
}

/* Relative time */
function relTime(epochSec) {
  const diff = Math.floor(Date.now() / 1000) - epochSec;
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* Escape HTML */
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
