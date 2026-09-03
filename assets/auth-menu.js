(function () {
  // ---------------------------------------------------------------------
  // Widget de connexion pour le header — bouton "Connexion" quand
  // déconnecté, avatar + menu déroulant (Mon compte / Déconnexion)
  // quand connecté. Utilisé par index.html ET account.html.
  // ---------------------------------------------------------------------
  const API_BASE = 'https://site15-bot.onrender.com';
  const TOKEN_KEY = 'vs_token';

  const container = document.getElementById('auth-menu');
  if (!container) return;

  // ---------------------------------------------------------------------
  // Gestion du token (remplace le cookie de session cross-site, bloqué par
  // les bloqueurs de traqueurs de certains navigateurs — Opera GX, Brave,
  // Safari ITP — même avec SameSite=None correctement configuré).
  // Après le callback OAuth Discord, le serveur redirige vers
  // account.html?token=... : on le récupère ici, on le stocke en
  // localStorage, puis on nettoie l'URL.
  // ---------------------------------------------------------------------
  function captureTokenFromUrl() {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    }
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  captureTokenFromUrl();

  function icon(name) {
    const icons = {
      discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.9A18 18 0 0 0 15.9 3.5c-.2.4-.5.9-.6 1.3a16.7 16.7 0 0 0-5 0c-.2-.4-.4-.9-.6-1.3a18 18 0 0 0-4.4 1.4C2.8 8.6 2.1 12.2 2.4 15.8a18.1 18.1 0 0 0 5.5 2.8c.4-.6.8-1.3 1.1-2a11.6 11.6 0 0 1-1.8-.9l.4-.3a12.9 12.9 0 0 0 10.8 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.7 1.3 1.1 2a18 18 0 0 0 5.5-2.8c.4-4.2-.6-7.7-2.3-10.9ZM9.7 13.6c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm4.6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20c1.6-3.6 4.6-5.5 7.5-5.5s5.9 1.9 7.5 5.5"/></svg>',
      department: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V6.5L12 3l8 3.5V21"/><path d="M9 21v-6h6v6"/></svg>',
      admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15.5" r="3.5"/><path d="M10.5 13l8-8M15 8l2 2M18 5l2 2"/></svg>',
      logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
      caret: '<svg class="auth-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    };
    return icons[name] || '';
  }

  function escapeHtml(s) {
    return (s ?? '').toString().replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function closeMenu() {
    container.classList.remove('open');
    const toggle = document.getElementById('auth-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function renderLoggedOut() {
    container.innerHTML = `
      <a class="auth-login-btn" href="${API_BASE}/auth/discord/login">
        ${icon('discord')} Connexion
      </a>
    `;
  }

  function renderLoggedIn(discord) {
    const avatarInner = discord.avatar
      ? `<img src="${escapeHtml(discord.avatar)}" alt="">`
      : escapeHtml((discord.username || '?')[0].toUpperCase());

    container.innerHTML = `
      <button class="auth-btn" id="auth-toggle" type="button" aria-haspopup="true" aria-expanded="false">
        <span class="auth-avatar">${avatarInner}</span>
        <span class="auth-name">${escapeHtml(discord.username)}</span>
        ${icon('caret')}
      </button>
      <div class="auth-dropdown" role="menu">
        <a href="/account/" role="menuitem">${icon('user')} Mon compte</a>
        <a href="/rp/" role="menuitem">${icon('department')} Département</a>
        <div id="auth-admin-slot"></div>
        <hr>
        <button class="danger" id="auth-logout" type="button" role="menuitem">${icon('logout')} Se déconnecter</button>
      </div>
    `;

    const toggle = document.getElementById('auth-toggle');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.getElementById('auth-logout').addEventListener('click', async (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      btn.disabled = true;
      clearToken();
      try {
        // Best-effort, non bloquant : le token étant stateless, la
        // déconnexion réelle se fait côté client en le supprimant.
        await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
      } catch (err) {
        console.error('Erreur logout:', err);
      }
      window.location.reload();
    });
  }

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  async function init() {
    const token = getToken();
    if (!token) {
      renderLoggedOut();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/account/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        clearToken();
        renderLoggedOut();
        return;
      }
      if (!res.ok) {
        renderLoggedOut();
        return;
      }
      const data = await res.json();
      renderLoggedIn(data.discord);
      revealAdminLinkIfAllowed(token);
    } catch (err) {
      console.error('Erreur vérification connexion:', err);
      renderLoggedOut();
    }
  }

  // Le lien "Admin" n'est ajouté au menu déroulant que si l'utilisateur a
  // réellement un accès au panel (déterminé par ses rôles Discord côté
  // serveur, cf adminAuth.js) — jamais en se fiant à un état côté client.
  async function revealAdminLinkIfAllowed(token) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/context`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const context = await res.json();
      const slot = document.getElementById('auth-admin-slot');
      if (context.isAdminAnywhere && slot) {
        slot.innerHTML = `<a href="/admin/" role="menuitem">${icon('admin')} Admin</a>`;
      }
    } catch (err) {
      console.error('Erreur vérification accès admin:', err);
    }
  }

  init();
})();