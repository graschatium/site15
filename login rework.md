Voici ce que je vois : tu as un écran de login (index.html) qui authentifie les joueurs via Firebase, et un intranet Sécurité (security/index.html) qui a son propre système d'auth séparé.
Le problème : les deux systèmes ne se parlent pas. Laisse-moi regarder comment les brancher.Voici ce que j'ai compris du problème :

index.html (login) authentifie via Firebase players collection et stocke les données dans localStorage (site15_authed, site15_profile, site15_role)
security/index.html a son propre système d'auth qui cherche dans la collection users (différente !) avec username/mot de passe

Il faut que l'intranet Sécurité lise la session du login au lieu de redemander un mot de passe. Voici le fix :Check skills directoryCheck skills directoryJe vais créer directement le fichier corrigé. Le principe du fix :
Le login (index.html) stocke dans localStorage :

site15_authed = '1'
site15_profile = données du personnage (avec role, id, etc.)
site15_role = 'security'

L'intranet Sécurité doit lire ça dans initApp() au lieu de demander un re-login. La fonction initApp() cherche déjà site15_authed et site15_profile — mais elle essaie de matcher par username dans la collection users, alors que le profil vient de la collection players.
Il faut adapter initApp() pour utiliser directement les données du profil player.
Voici le bloc initApp() remplacé (et quelques ajustements mineurs) :Extract the initApp function to understand its exact contentExtract the initApp function to understand its exact contentVoici le fix précis. Copie ce nouveau bloc initApp() dans ton fichier security/index.html, en remplaçant l'ancienne version :
javascriptasync function initApp() {
  // ── 1. Auto-login depuis la page de connexion (session site15) ──
  const authed  = localStorage.getItem('site15_authed') === '1';
  const raw     = localStorage.getItem('site15_profile');

  if (authed && raw) {
    try {
      const profile = JSON.parse(raw);

      // Vérifier que c'est bien un personnage du département Sécurité
      const role = profile.role || localStorage.getItem('site15_role') || '';
      if (role !== 'security') {
        // Mauvais département — on laisse passer en lecture seule
        onAuthChange(null, null);
        return;
      }

      // Chercher dans la collection Firestore 'users' par username ou displayName
      const displayName = profile.displayName || profile.name || '';
      const robloxName  = profile.robloxName  || profile.id   || '';

      const snap = await getDocs(collection(db, 'users'));
      let found = null;
      snap.forEach(d => {
        const u = d.data();
        const uname = (u.username || u.name || '').toLowerCase();
        if (
          (displayName && uname === displayName.toLowerCase()) ||
          (robloxName  && uname === robloxName.toLowerCase())
        ) {
          found = { _id: d.id, ...u };
        }
      });

      if (found) {
        // Trouvé dans la table users — connexion complète avec son rôle admin/modérateur
        currentUser = found;
        currentRole = found.role || 'moderateur';
        isAuthenticated = true;
        saveSession({ username: found.username, password: found.password });
        onAuthChange(found.displayName || found.username || found.name, currentRole);
        return;
      }

      // Pas dans la collection 'users' mais session site15 valide → modérateur par défaut
      currentUser = {
        _id: profile.id || 'player-session',
        username: robloxName || displayName,
        displayName: displayName || robloxName,
        role: 'moderateur',
      };
      currentRole = 'moderateur';
      isAuthenticated = true;
      saveSession({ username: currentUser.username, password: '__site15_session__' });
      onAuthChange(currentUser.displayName, currentRole);
      return;

    } catch(e) {
      console.warn('Auto-login session échoué:', e);
    }
  }

  // ── 2. Fallback : session localStorage classique (username + mot de passe) ──
  const savedSession = loadSession();
  if (savedSession?.username && savedSession?.password && savedSession.password !== '__site15_session__') {
    try {
      const snap = await getDocs(collection(db, 'users'));
      let found = null;
      snap.forEach(d => {
        const u = d.data();
        const id = u.username || u.name || '';
        if (id.toLowerCase() === savedSession.username.toLowerCase()) found = { _id: d.id, ...u };
      });
      if (found && found.password === savedSession.password) {
        currentUser = found;
        currentRole = found.role || 'moderateur';
        isAuthenticated = true;
        onAuthChange(found.displayName || found.username || found.name, currentRole);
        return;
      }
    } catch(e) { console.warn('Session restore failed:', e); }
    clearSession();
  }

  onAuthChange(null, null);
}

Ce que ça change :
Avant — initApp() cherchait profile.id ou profile.name dans la collection users. Si le joueur n'avait pas de compte users séparé, il était bloqué en lecture seule même après le login.
Après — trois chemins :

Joueur avec compte users (admin ou modérateur nommé) → trouve sa fiche dans users, récupère son vrai rôle (admin ou moderateur)
Joueur sans compte users mais session site15 valide → connecté automatiquement comme modérateur (accès en écriture, pas dossiers admin)
Pas de session → lecture seule, flyout de connexion manuel disponible

Un joueur d'un autre département (role !== 'security') reste en lecture seule — il peut voir l'intranet mais pas modifier.Vous avez dit : tu dois afficher le role RP et pas "modérateur" pour une session site15tu dois afficher le role RP et pas "modérateur" pour une session site1520:58Claude a répondu : Bonne remarque.Bonne remarque. Le profil site15_profile contient rank (le grade RP comme [D.SE-DIR.] Directeur de la Sécurité). Il faut l'afficher à la place de "Modérateur" dans l'UI.
Voici les deux endroits à modifier :
1. Dans initApp() — stocker le rank RP dans currentUser :
javascript// Pas dans la collection 'users' mais session site15 valide → modérateur par défaut
currentUser = {
  _id: profile.id || 'player-session',
  username: robloxName || displayName,
  displayName: displayName || robloxName,
  role: 'moderateur',
  rpRank: profile.rank || '',   // ← AJOUT
};
2. Dans showAuthUserPanel() — afficher le grade RP :
Remplace la fonction existante par :
javascriptfunction showAuthUserPanel(name, role) {
  document.getElementById('afLoginPanel').style.display   = 'none';
  document.getElementById('afLoadingPanel').style.display = 'none';
  document.getElementById('afUserPanel').style.display    = 'block';
  document.getElementById('afUserName').textContent = name;
  const roleEl = document.getElementById('afUserRole');

  // Priorité : grade RP > rôle système
  const rpRank = currentUser?.rpRank || '';
  if (rpRank) {
    roleEl.textContent = rpRank;
    roleEl.className = 'auth-user-role moderateur';
  } else {
    roleEl.textContent = role === 'admin' ? '🔐 Administrateur' : '🛡 Modérateur';
    roleEl.className = 'auth-user-role ' + (role || 'moderateur');
  }
}
3. Dans updateSidebarAuth() — même chose dans la sidebar :
Dans la branche if (name), remplace la ligne du rôle :
javascriptif (roleEl) {
  // Priorité : grade RP > rôle système
  const rpRank = currentUser?.rpRank || '';
  if (rpRank) {
    roleEl.textContent = rpRank;
    roleEl.style.color = 'var(--dept-color)';
  } else {
    roleEl.textContent = role?.toUpperCase() || 'MODÉRATEUR';
    roleEl.style.color = role === 'admin' ? 'var(--danger)' : 'var(--accent)';
  }
}

Résultat : un joueur connecté via le login verra son vrai grade RP (ex : [D.SE-DIR.] Directeur de la Sécurité) dans le flyout et la sidebar, tandis qu'un compte users Firestore affichera toujours son rôle système (🔐 Administrateur ou 🛡 Modérateur).Vous avez dit : refais chaque morceaux pour du copier collerrefais chaque morceaux pour du copier coller20:59Claude a répondu : Voici chaque bloc complet, prêt à copier-coller en remplacement dans security/index.Voici chaque bloc complet, prêt à copier-coller en remplacement dans security/index.html.

BLOC 1 — initApp()
javascriptasync function initApp() {
  const authed = localStorage.getItem('site15_authed') === '1';
  const raw    = localStorage.getItem('site15_profile');

  if (authed && raw) {
    try {
      const profile     = JSON.parse(raw);
      const role        = profile.role || localStorage.getItem('site15_role') || '';
      const displayName = profile.displayName || profile.name || '';
      const robloxName  = profile.robloxName  || profile.id  || '';

      if (role === 'security') {
        const snap = await getDocs(collection(db, 'users'));
        let found = null;
        snap.forEach(d => {
          const u     = d.data();
          const uname = (u.username || u.name || '').toLowerCase();
          if (
            (displayName && uname === displayName.toLowerCase()) ||
            (robloxName  && uname === robloxName.toLowerCase())
          ) found = { _id: d.id, ...u };
        });

        if (found) {
          currentUser     = { ...found, rpRank: profile.rank || '' };
          currentRole     = found.role || 'moderateur';
          isAuthenticated = true;
          saveSession({ username: found.username, password: found.password });
          onAuthChange(found.displayName || found.username || found.name, currentRole);
          return;
        }

        currentUser = {
          _id:         profile.id || 'player-session',
          username:    robloxName || displayName,
          displayName: displayName || robloxName,
          role:        'moderateur',
          rpRank:      profile.rank || '',
        };
        currentRole     = 'moderateur';
        isAuthenticated = true;
        saveSession({ username: currentUser.username, password: '__site15_session__' });
        onAuthChange(currentUser.displayName, currentRole);
        return;
      }
    } catch(e) { console.warn('Auto-login session échoué:', e); }
  }

  const savedSession = loadSession();
  if (savedSession?.username && savedSession?.password && savedSession.password !== '__site15_session__') {
    try {
      const snap = await getDocs(collection(db, 'users'));
      let found = null;
      snap.forEach(d => {
        const u  = d.data();
        const id = u.username || u.name || '';
        if (id.toLowerCase() === savedSession.username.toLowerCase()) found = { _id: d.id, ...u };
      });
      if (found && found.password === savedSession.password) {
        currentUser     = found;
        currentRole     = found.role || 'moderateur';
        isAuthenticated = true;
        onAuthChange(found.displayName || found.username || found.name, currentRole);
        return;
      }
    } catch(e) { console.warn('Session restore failed:', e); }
    clearSession();
  }

  onAuthChange(null, null);
}

BLOC 2 — showAuthUserPanel()
javascriptfunction showAuthUserPanel(name, role) {
  document.getElementById('afLoginPanel').style.display   = 'none';
  document.getElementById('afLoadingPanel').style.display = 'none';
  document.getElementById('afUserPanel').style.display    = 'block';
  document.getElementById('afUserName').textContent = name;
  const roleEl = document.getElementById('afUserRole');
  const rpRank = currentUser?.rpRank || '';
  if (rpRank) {
    roleEl.textContent = rpRank;
    roleEl.className   = 'auth-user-role moderateur';
  } else {
    roleEl.textContent = role === 'admin' ? '🔐 Administrateur' : '🛡 Modérateur';
    roleEl.className   = 'auth-user-role ' + (role || 'moderateur');
  }
}

BLOC 3 — updateSidebarAuth()
javascriptfunction updateSidebarAuth(name, role) {
  const statusEl = document.getElementById('sidebarAuthStatus');
  const nameEl   = document.getElementById('sidebarAuthName');
  const roleEl   = document.getElementById('sidebarAuthRole');
  const levelEl  = document.getElementById('sidebarAuthLevel');
  const btn      = document.getElementById('sidebarAuthBtn');
  if (name) {
    if (statusEl) { statusEl.textContent = 'CONNECTÉ'; statusEl.style.color = 'var(--safe)'; }
    if (nameEl)   nameEl.textContent = name;
    if (roleEl) {
      const rpRank = currentUser?.rpRank || '';
      if (rpRank) {
        roleEl.textContent  = rpRank;
        roleEl.style.color  = 'var(--dept-color)';
      } else {
        roleEl.textContent  = role?.toUpperCase() || 'MODÉRATEUR';
        roleEl.style.color  = role === 'admin' ? 'var(--danger)' : 'var(--accent)';
      }
    }
    if (levelEl) { levelEl.textContent = role === 'admin' ? 'ADMIN COMPLET' : 'ÉCRITURE'; levelEl.style.color = 'var(--safe)'; }
    if (btn)     { btn.textContent = '↩ Déconnexion'; btn.className = 'auth-btn connected'; btn.style.width='100%'; btn.style.marginTop='10px'; btn.style.textAlign='center'; btn.onclick = doAuthLogout; }
  } else {
    if (statusEl) { statusEl.textContent = 'NON CONNECTÉ'; statusEl.style.color = 'var(--text-dim)'; }
    if (nameEl)   nameEl.textContent = '—';
    if (roleEl)   { roleEl.textContent = 'LECTURE'; roleEl.style.color = 'var(--text-dim)'; }
    if (levelEl)  { levelEl.textContent = 'PUBLIC'; levelEl.style.color = 'var(--text-dim)'; }
    if (btn)      { btn.textContent = '🔑 Se connecter'; btn.className = 'auth-btn'; btn.style.width='100%'; btn.style.marginTop='10px'; btn.style.textAlign='center'; btn.onclick = toggleAuthFlyout; }
  }
}Vous avez dit : les personnes en dessous de lieutenant ne peuvent modifier aucune infosles personnes en dessous de lieutenant ne peuvent modifier aucune infos21:14Claude a répondu : Il faut définir la hiérarchie des grades et bloquer les actions d'écriture si le grade est insuffisant.Il faut définir la hiérarchie des grades et bloquer les actions d'écriture si le grade est insuffisant.

BLOC 1 — fonction utilitaire à ajouter (juste après la déclaration de currentUser, currentRole, isAuthenticated) :
javascriptconst RANK_ORDER = [
  'cadet', 'stagiaire', 'recrue',
  'agent', 'agent de 2ème classe', 'agent de 2e classe', 'agent de 1ère classe', 'agent de 1ere classe', 'agent de 1er classe',
  'caporal', 'caporal-chef',
  'sergent', 'sergent-chef',
  'lieutenant',
  'capitaine',
  'commandant',
  'directeur', 'directeur de la sécurité',
  'admin', 'administrateur',
];

function getRankLevel(rpRank) {
  if (!rpRank) return -1;
  const lower = rpRank.toLowerCase();
  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    if (lower.includes(RANK_ORDER[i])) return i;
  }
  return -1;
}

function canWrite() {
  if (!isAuthenticated) return false;
  if (currentRole === 'admin') return true;
  const rpRank = currentUser?.rpRank || '';
  const level  = getRankLevel(rpRank);
  const ltLevel = RANK_ORDER.indexOf('lieutenant');
  return level >= ltLevel;
}

BLOC 2 — applyPermissions() (remplace l'existante) :
javascriptfunction applyPermissions(name, role) {
  const write = canWrite();
  document.querySelectorAll('.action-write').forEach(el => el.classList.toggle('action-locked', !write));
  ['roProto','roEval','roRapport','roAppel'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!name) {
      el.querySelector('span:last-child').innerHTML =
        'Lecture seule — <span class="ro-lock-link" onclick="openAuthFlyout()">Connectez-vous</span> pour créer ou modifier';
    } else if (!write) {
      el.querySelector('span:last-child').innerHTML =
        'Grade insuffisant — Lieutenant minimum requis pour modifier';
    }
    el.classList.toggle('visible', !write);
  });
}

BLOC 3 — requireAuth() (remplace l'existante) :
javascriptfunction requireAuth(action) {
  if (!isAuthenticated) {
    openAuthFlyout();
    SCPIntranet.addHistory('⚠ Connexion requise pour: ' + action);
    return false;
  }
  if (!canWrite()) {
    SCPIntranet.addHistory('⛔ Grade insuffisant pour: ' + action);
    alert('⛔ Grade insuffisant — Lieutenant minimum requis pour effectuer cette action.');
    return false;
  }
  return true;
}

Ce que ça fait :

Cadet, Agent (toutes classes), Caporal, Caporal-Chef, Sergent, Sergent-Chef → lecture seule
Lieutenant et au-dessus → écriture complète
Admin Firestore → toujours accès complet
Le bandeau de verrouillage change de message selon la raison (non connecté vs grade insuffisant)