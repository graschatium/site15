// ── SCP FOUNDATION — INTRANET SHARED JS ──
// Shared utilities, storage, and base functions

const SCPIntranet = (() => {

  // ── STORAGE ──
  const store = {
    get: (key, fallback=[]) => {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  };

  // ── HISTORY LOG ──
  function addHistory(msg, containerId='historyList') {
    const c = document.getElementById(containerId);
    if (!c) return;
    const now = new Date();
    const ts = `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}]`;
    const div = document.createElement('div');
    div.className = 'hlog-item';
    div.innerHTML = `<span>${ts}</span>${_esc(msg)}`;
    c.prepend(div);
    while (c.children.length > 40) c.removeChild(c.lastChild);
  }

  // ── TABS / VIEW SWITCHING ──
  function initTabs(navSelector='.nav-tab', viewPrefix='view-') {
    const tabs = document.querySelectorAll(navSelector);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const v = tab.dataset.view;
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(viewPrefix + v);
        if (target) target.classList.add('active');
      });
    });
  }

  // ── COPY TO CLIPBOARD ──
  async function copyText(text, btn, label='Copié !') {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
      }
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ ' + label;
        btn.style.color = 'var(--safe)';
        btn.style.borderColor = 'var(--safe)';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 1500);
      }
      return true;
    } catch { return false; }
  }

  // ── MODAL ──
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    setTimeout(() => {
      const inp = el.querySelector('input:not([type=hidden]), textarea, select');
      if (inp) inp.focus();
    }, 80);
  }
  function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
  function initModalClose() {
    document.addEventListener('click', e => {
      if (e.target.dataset.closeModal) closeModal(e.target.dataset.closeModal);
      if (e.target.classList.contains('modal-ov')) closeModal(e.target.id);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape')
        document.querySelectorAll('.modal-ov.open').forEach(m => m.classList.remove('open'));
    });
  }

  // ── GENERATE ID ──
  function genId(prefix='ID') {
    return prefix + '-' + Date.now().toString(36).toUpperCase();
  }

  // ── DATE HELPERS ──
  function today() { return new Date().toISOString().split('T')[0]; }
  function fmtDate(d) {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('fr-FR'); }
    catch { return d; }
  }

  // ── ESCAPE HTML ──
  function _esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── UPDATE STAT BOX ──
  function updateStat(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // ── EVAL ──
  const EVAL_CRITERIA = ['Disc','Proto','React','Comm','Hier','Comp'];
  const EVAL_LABELS = {
    Disc:'Discipline', Proto:'Connaissance protocoles',
    React:'Réactivité', Comm:'Communication',
    Hier:'Respect hiérarchie', Comp:'Comportement'
  };
  function getEvalMention(score, max=60) {
    const p = score / max;
    if (p >= 0.9) return { text:'EXCELLENT',   color:'var(--safe)'   };
    if (p >= 0.75)return { text:'TRÈS BON',     color:'var(--accent)' };
    if (p >= 0.6) return { text:'SATISFAISANT', color:'var(--accent2)'};
    if (p >= 0.45)return { text:'INSUFFISANT',  color:'var(--warn)'   };
    return           { text:'RECALÉ',        color:'var(--danger)' };
  }
  function computeEvalTotal() {
    return EVAL_CRITERIA.reduce((s,k) => {
      const el = document.getElementById('score'+k);
      return s + (el ? parseInt(el.value)||0 : 0);
    }, 0);
  }
  function updateEvalUI() {
    const total = computeEvalTotal();
    const scoreEl   = document.getElementById('evalTotalScore');
    const mentionEl = document.getElementById('evalTotalMention');
    if (scoreEl) scoreEl.textContent = total + ' / 60';
    if (mentionEl) {
      const m = getEvalMention(total);
      mentionEl.textContent = '— ' + m.text;
      mentionEl.style.color = m.color;
    }
  }
  function initEvalSliders() {
    EVAL_CRITERIA.forEach(k => {
      const slider = document.getElementById('score'+k);
      const val    = document.getElementById('val'+k);
      if (!slider || !val) return;
      slider.addEventListener('input', () => { val.textContent = slider.value; updateEvalUI(); });
    });
  }

  // ── RAPPORT ──
  const RAPPORT_TYPES = [
    { value:'incident',     label:'⚠ Incident'      },
    { value:'breach',       label:'🔴 Brèche'        },
    { value:'personnel',    label:'👤 Personnel'     },
    { value:'patrol',       label:'🔒 Patrouille'    },
    { value:'test',         label:'🧪 Test'          },
    { value:'disciplinary', label:'📋 Disciplinaire' },
  ];
  const RAPPORT_SEV = [
    { value:'low',      label:'FAIBLE',   color:'var(--safe)'   },
    { value:'moderate', label:'MODÉRÉE',  color:'var(--warn)'   },
    { value:'high',     label:'ÉLEVÉE',   color:'#e67e22'       },
    { value:'critical', label:'CRITIQUE', color:'var(--danger)' },
  ];
  function getSevStyle(val)  { return RAPPORT_SEV.find(s=>s.value===val)   || RAPPORT_SEV[0]; }
  function getTypeLabel(val) { return (RAPPORT_TYPES.find(t=>t.value===val)||{}).label || val; }
  function exportRapport(r) {
    const sev = getSevStyle(r.severity);
    const text = [
      '══════════════════════════════════════════',
      'SCP FOUNDATION — SITE-15', getTypeLabel(r.type).toUpperCase(),
      '══════════════════════════════════════════',
      `ID           : ${r.id}`,   `DATE         : ${r.date}`,
      `AUTEUR       : ${r.author}${r.username?' (@'+r.username+')':''}`,
      `DÉPARTEMENT  : ${r.dept}`, `SÉVÉRITÉ     : ${sev.label}`,
      '══════════════════════════════════════════',
      `TITRE : ${r.title}`,       '══════════════════════════════════════════',
      '', 'DESCRIPTION :', r.description, '', 'CONCLUSION :', r.conclusion||'—',
      '', `TÉMOINS : ${r.witnesses?.join(', ')||'—'}`,
      '══════════════════════════════════════════',
      `[Généré le ${new Date().toLocaleString('fr-FR')}]`,
    ].join('\n');
    const a = Object.assign(document.createElement('a'),{
      href: URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),
      download: r.id+'_'+r.title.replace(/[^a-z0-9]/gi,'_')+'.txt',
    });
    a.click();
  }

  function fillSelect(id, options) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = options.map(o=>`<option value="${o.value}">${o.label}</option>`).join('');
  }

  return {
    store, addHistory, initTabs, copyText,
    openModal, closeModal, initModalClose, genId,
    today, fmtDate, _esc, updateStat,
    EVAL_CRITERIA, EVAL_LABELS, getEvalMention,
    computeEvalTotal, updateEvalUI, initEvalSliders,
    RAPPORT_TYPES, RAPPORT_SEV, getSevStyle, getTypeLabel,
    exportRapport, fillSelect,
  };
})();


// ══════════════════════════════════════════════════════
// GESTION JOUEURS & PERSONNAGES — Firebase
// Ces fonctions sont appelées depuis mod.html
// Elles s'appuient sur `db` (Firestore) exposé via window
// ══════════════════════════════════════════════════════

// Référence locale au cache joueurs (partagé avec le module Firebase)
// La variable `playersData` est déclarée dans le module Firebase de mod.html.
// On utilise window.playersData comme pont.

// ── Dept label helpers ──
const DEPT_LABELS = {
  scientific:     '🔬 Scientifique',
  security:       '🛡 Sécurité',
  medical:        '💉 Médical',
  administration: '📋 Administration',
  moderator:      '⚖ Modérateur',
};

function _deptClass(role) {
  return ['scientific','security','medical','administration','moderator'].includes(role) ? role : 'scientific';
}

// ── Render player card ──
function _renderPlayerCard(player, characters) {
  const pid      = player._id;
  const name     = SCPIntranet._esc(player.robloxName || player.displayName || player._id);
  const pin      = player.pin ? `PIN: ${player.pin}` : 'Aucun PIN';
  const charCount = (characters || []).length;

  const charsHtml = charCount === 0
    ? `<div class="no-chars">◈ Aucun personnage — cliquez sur + pour en ajouter un</div>`
    : (characters || []).map(c => {
        const cid    = c._id;
        const cname  = SCPIntranet._esc(c.name || '—');
        const cdisp  = SCPIntranet._esc(c.displayName || c.name || '—');
        const crank  = SCPIntranet._esc(c.rank || '—');
        const crole  = c.role || 'scientific';
        const cdept  = SCPIntranet._esc(DEPT_LABELS[crole] || crole);
        const cpin   = c.pin ? `PIN: ${c.pin}` : '';
        return `
          <div class="char-row">
            <div class="char-row-info">
              <div class="char-row-name">${cname}</div>
              <div class="char-row-meta">${crank}${cpin ? ' · ' + cpin : ''}</div>
            </div>
            <span class="char-row-dept ${_deptClass(crole)}">${cdept}</span>
            <div class="char-row-actions">
              <button class="btn btn-ghost btn-xs" onclick="editCharacter('${pid}','${cid}')">✏</button>
              <button class="btn btn-danger btn-xs" onclick="deleteCharacter('${pid}','${cid}')">🗑</button>
            </div>
          </div>`;
      }).join('');

  return `
    <div class="player-card" id="pcard-${pid}">
      <div class="player-card-hdr" onclick="_togglePlayerCard('${pid}')">
        <div>
          <div class="player-card-name">${name}</div>
          <div class="player-card-meta">${charCount} personnage${charCount>1?'s':''} · ${SCPIntranet._esc(pin)}</div>
        </div>
        <div class="player-card-actions" onclick="event.stopPropagation()">
          <button class="btn btn-ghost btn-xs" onclick="editPlayer('${pid}')">✏ Éditer</button>
          <button class="btn btn-primary btn-xs" onclick="addCharacterTo('${pid}')">+ Perso</button>
          <button class="btn btn-danger btn-xs" onclick="deletePlayer('${pid}')">🗑</button>
        </div>
      </div>
      <div class="player-card-body" id="pbody-${pid}">
        <div class="chars-grid">${charsHtml}</div>
      </div>
    </div>`;
}

window._togglePlayerCard = function(pid) {
  const body = document.getElementById('pbody-' + pid);
  if (body) body.classList.toggle('open');
};

// ── refreshPlayers ──
window.refreshPlayers = async function() {
  const container = document.getElementById('playersListContainer');
  if (!container) return;

  // Attendre que db soit disponible (initialisé dans le module Firebase inline)
  const db = window._firebaseDb;
  if (!db) {
    container.innerHTML = '<div class="no-player"><span class="np-icon">⏳</span>Firebase non prêt…</div>';
    return;
  }

  container.innerHTML = '<div class="no-player"><span class="np-icon">⏳</span>Chargement des joueurs…</div>';

  try {
    const { getDocs, collection } = await _fbImport();
    const playersSnap = await getDocs(collection(db, 'players'));

    window.playersData = [];
    for (const pd of playersSnap.docs) {
      const player = { _id: pd.id, ...pd.data() };
      // Charger les personnages de ce joueur
      const charsSnap = await getDocs(collection(db, 'players', pd.id, 'characters'));
      player._characters = charsSnap.docs.map(cd => ({ _id: cd.id, ...cd.data() }));
      window.playersData.push(player);
    }

    _renderPlayersList(window.playersData);
    // Mettre à jour le compteur sidebar
    const sbEl = document.getElementById('sbPlayers');
    if (sbEl) sbEl.textContent = window.playersData.length;

  } catch(e) {
    container.innerHTML = `<div class="no-player" style="color:var(--danger)"><span class="np-icon">⚠</span>Erreur : ${SCPIntranet._esc(e.message)}</div>`;
  }
};

function _renderPlayersList(players) {
  const container = document.getElementById('playersListContainer');
  if (!container) return;
  if (!players || !players.length) {
    container.innerHTML = '<div class="no-player"><span class="np-icon">🎮</span>Aucun joueur enregistré</div>';
    return;
  }
  container.innerHTML = players.map(p => _renderPlayerCard(p, p._characters)).join('');
}

// ── filterPlayersList ──
window.filterPlayersList = function() {
  const q = (document.getElementById('playerFilterInput')?.value || '').trim().toLowerCase();
  const infoEl = document.getElementById('playerFilterInfo');
  const players = window.playersData || [];

  if (!q) {
    _renderPlayersList(players);
    if (infoEl) infoEl.textContent = '';
    return;
  }

  const filtered = players.filter(p => {
    const nameMatch = (p.robloxName||'').toLowerCase().includes(q)
      || (p.displayName||'').toLowerCase().includes(q);
    const charMatch = (p._characters||[]).some(c =>
      (c.name||'').toLowerCase().includes(q) || (c.rank||'').toLowerCase().includes(q)
    );
    return nameMatch || charMatch;
  });

  _renderPlayersList(filtered);
  if (infoEl) {
    infoEl.textContent = filtered.length === 0
      ? '⚠ Aucun joueur trouvé'
      : `${filtered.length} joueur${filtered.length>1?'s':''} trouvé${filtered.length>1?'s':''}`;
    infoEl.style.color = filtered.length === 0 ? 'var(--danger)' : 'var(--safe)';
  }
};

// ── createPlayer ──
window.createPlayer = async function() {
  const robloxName  = document.getElementById('npRobloxName')?.value.trim();
  const displayName = document.getElementById('npDisplayName')?.value.trim();
  const pin         = document.getElementById('npPin')?.value.trim();
  const msgEl       = document.getElementById('newPlayerMsg');

  if (msgEl) { msgEl.textContent = ''; msgEl.style.color = ''; }
  if (!robloxName) {
    if (msgEl) { msgEl.style.color='var(--danger)'; msgEl.textContent='⚠ Le pseudo Roblox est obligatoire.'; }
    return;
  }

  const db = window._firebaseDb;
  if (!db) return;

  try {
    const { getDocs, addDoc, collection, query, where } = await _fbImport();

    // Vérifier doublon
    const existing = await getDocs(query(collection(db,'players'), where('robloxName','==',robloxName)));
    if (!existing.empty) {
      if (msgEl) { msgEl.style.color='var(--danger)'; msgEl.textContent='⚠ Ce pseudo Roblox existe déjà.'; }
      return;
    }

    const docData = {
      robloxName,
      displayName: displayName || robloxName,
      pin:   pin || '',
      createdAt: new Date().toISOString(),
      createdBy: window.currentUser?.displayName || window.currentUser?.username || '—',
    };

    await addDoc(collection(db,'players'), docData);
    if (msgEl) { msgEl.style.color='var(--safe)'; msgEl.textContent='✓ Joueur créé : ' + robloxName; }
    SCPIntranet.addHistory('Joueur créé : ' + robloxName);

    // Vider les champs
    ['npRobloxName','npDisplayName','npPin'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });

    setTimeout(() => {
      SCPIntranet.closeModal('modalNewPlayer');
      if (msgEl) msgEl.textContent = '';
      window.refreshPlayers();
    }, 800);

  } catch(e) {
    if (msgEl) { msgEl.style.color='var(--danger)'; msgEl.textContent='⚠ '+e.message; }
  }
};

// ── editPlayer — ouvre le modal de création pré-rempli pour modification ──
window.editPlayer = async function(pid) {
  const player = (window.playersData||[]).find(p=>p._id===pid);
  if (!player) return;

  const db = window._firebaseDb;
  if (!db) return;

  // Réutilisation du modal modalNewPlayer avec un flag d'édition
  document.getElementById('npRobloxName').value  = player.robloxName  || '';
  document.getElementById('npDisplayName').value = player.displayName || '';
  document.getElementById('npPin').value         = player.pin         || '';

  const msgEl = document.getElementById('newPlayerMsg');
  if (msgEl) msgEl.textContent = '';

  // Changer le bouton pour "Sauvegarder"
  const footer = document.querySelector('#modalNewPlayer .modal-footer');
  if (footer) {
    footer.innerHTML = `
      <button class="btn btn-ghost" data-close-modal="modalNewPlayer">Annuler</button>
      <button class="btn btn-primary" onclick="updatePlayer('${pid}')">✓ Sauvegarder</button>`;
  }

  SCPIntranet.openModal('modalNewPlayer');
};

window.updatePlayer = async function(pid) {
  const robloxName  = document.getElementById('npRobloxName')?.value.trim();
  const displayName = document.getElementById('npDisplayName')?.value.trim();
  const pin         = document.getElementById('npPin')?.value.trim();
  const msgEl       = document.getElementById('newPlayerMsg');

  if (!robloxName) {
    if (msgEl) { msgEl.style.color='var(--danger)'; msgEl.textContent='⚠ Pseudo Roblox requis.'; }
    return;
  }

  const db = window._firebaseDb;
  if (!db) return;

  try {
    const { doc, setDoc } = await _fbImport();
    await setDoc(doc(db,'players',pid), {
      robloxName, displayName: displayName||robloxName, pin: pin||'',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    if (msgEl) { msgEl.style.color='var(--safe)'; msgEl.textContent='✓ Joueur mis à jour.'; }
    SCPIntranet.addHistory('Joueur modifié : ' + robloxName);

    // Restaurer le footer normal
    const footer = document.querySelector('#modalNewPlayer .modal-footer');
    if (footer) {
      footer.innerHTML = `
        <button class="btn btn-ghost" data-close-modal="modalNewPlayer">Annuler</button>
        <button class="btn btn-primary" onclick="createPlayer()">✓ Créer le joueur</button>`;
    }

    setTimeout(() => {
      SCPIntranet.closeModal('modalNewPlayer');
      if (msgEl) msgEl.textContent = '';
      window.refreshPlayers();
    }, 700);

  } catch(e) {
    if (msgEl) { msgEl.style.color='var(--danger)'; msgEl.textContent='⚠ '+e.message; }
  }
};

// ── deletePlayer ──
window.deletePlayer = async function(pid) {
  const player = (window.playersData||[]).find(p=>p._id===pid);
  const name   = player?.robloxName || pid;
  if (!confirm(`Supprimer le joueur "${name}" et tous ses personnages ?`)) return;

  const db = window._firebaseDb;
  if (!db) return;

  try {
    const { doc, deleteDoc, getDocs, collection } = await _fbImport();

    // Supprimer les personnages d'abord (sous-collection)
    const charsSnap = await getDocs(collection(db,'players',pid,'characters'));
    await Promise.all(charsSnap.docs.map(cd => deleteDoc(doc(db,'players',pid,'characters',cd.id))));

    // Supprimer le joueur
    await deleteDoc(doc(db,'players',pid));
    SCPIntranet.addHistory('Joueur supprimé : ' + name);
    window.refreshPlayers();
  } catch(e) {
    alert('Erreur : ' + e.message);
  }
};

// ── addCharacterTo — ouvre le modal personnage pour un joueur donné ──
window.addCharacterTo = function(pid) {
  const player = (window.playersData||[]).find(p=>p._id===pid);
  if (!player) return;

  document.getElementById('charEditPlayerId').value = pid;
  document.getElementById('charEditCharId').value   = '';
  document.getElementById('charModalTitle').textContent = '👤 Nouveau personnage';
  document.getElementById('charSaveBtn').textContent = '✓ Créer';
  ['charName','charDisplayName','charRank','charPin','charDesc'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const roleEl = document.getElementById('charRole');
  if (roleEl) roleEl.value = 'scientific';
  const msgEl = document.getElementById('charMsg');
  if (msgEl) msgEl.textContent = '';
  SCPIntranet.openModal('modalCharacter');
};

// ── editCharacter ──
window.editCharacter = function(pid, cid) {
  const player = (window.playersData||[]).find(p=>p._id===pid);
  const char   = (player?._characters||[]).find(c=>c._id===cid);
  if (!char) return;

  document.getElementById('charEditPlayerId').value = pid;
  document.getElementById('charEditCharId').value   = cid;
  document.getElementById('charModalTitle').textContent = '✏ Modifier personnage';
  document.getElementById('charSaveBtn').textContent = '✓ Sauvegarder';

  const g = (id, val) => { const el=document.getElementById(id); if(el) el.value=val||''; };
  g('charName',        char.name);
  g('charDisplayName', char.displayName);
  g('charRank',        char.rank);
  g('charPin',         char.pin);
  g('charDesc',        char.desc);
  const roleEl = document.getElementById('charRole');
  if (roleEl) roleEl.value = char.role || 'scientific';
  const msgEl = document.getElementById('charMsg');
  if (msgEl) msgEl.textContent = '';
  SCPIntranet.openModal('modalCharacter');
};

// ── saveCharacter (create ou update) ──
window.saveCharacter = async function() {
  const pid  = document.getElementById('charEditPlayerId')?.value;
  const cid  = document.getElementById('charEditCharId')?.value;
  const name = document.getElementById('charName')?.value.trim();
  const msgEl = document.getElementById('charMsg');

  if (msgEl) { msgEl.textContent=''; msgEl.style.color=''; }
  if (!pid || !name) {
    if (msgEl) { msgEl.style.color='var(--danger)'; msgEl.textContent='⚠ Nom du personnage obligatoire.'; }
    return;
  }

  const db = window._firebaseDb;
  if (!db) return;

  const data = {
    name,
    displayName: document.getElementById('charDisplayName')?.value.trim() || name,
    role:        document.getElementById('charRole')?.value || 'scientific',
    rank:        document.getElementById('charRank')?.value.trim() || '',
    pin:         document.getElementById('charPin')?.value.trim()  || '',
    desc:        document.getElementById('charDesc')?.value.trim() || '',
    updatedAt:   new Date().toISOString(),
  };

  try {
    const { doc, setDoc, addDoc, collection } = await _fbImport();

    if (cid) {
      // Mise à jour
      await setDoc(doc(db,'players',pid,'characters',cid), data, { merge: true });
      SCPIntranet.addHistory('Personnage modifié : ' + name);
      if (msgEl) { msgEl.style.color='var(--safe)'; msgEl.textContent='✓ Personnage mis à jour.'; }
    } else {
      // Création
      data.createdAt = new Date().toISOString();
      await addDoc(collection(db,'players',pid,'characters'), data);
      SCPIntranet.addHistory('Personnage créé : ' + name);
      if (msgEl) { msgEl.style.color='var(--safe)'; msgEl.textContent='✓ Personnage créé.'; }
    }

    setTimeout(() => {
      SCPIntranet.closeModal('modalCharacter');
      if (msgEl) msgEl.textContent = '';
      window.refreshPlayers();
    }, 700);

  } catch(e) {
    if (msgEl) { msgEl.style.color='var(--danger)'; msgEl.textContent='⚠ '+e.message; }
  }
};

// ── deleteCharacter ──
window.deleteCharacter = async function(pid, cid) {
  const player = (window.playersData||[]).find(p=>p._id===pid);
  const char   = (player?._characters||[]).find(c=>c._id===cid);
  const name   = char?.name || cid;
  if (!confirm(`Supprimer le personnage "${name}" ?`)) return;

  const db = window._firebaseDb;
  if (!db) return;

  try {
    const { doc, deleteDoc } = await _fbImport();
    await deleteDoc(doc(db,'players',pid,'characters',cid));
    SCPIntranet.addHistory('Personnage supprimé : ' + name);
    window.refreshPlayers();
  } catch(e) {
    alert('Erreur : ' + e.message);
  }
};

// ── _fbImport : lazy import Firebase pour éviter les conflits de modules ──
// On réutilise les fonctions déjà importées dans le module Firebase du HTML
// via le namespace window._fbFunctions exposé depuis le <script type="module">
async function _fbImport() {
  if (window._fbFunctions) return window._fbFunctions;
  // Fallback : import direct (fonctionne si le CDN est accessible)
  const fb = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  return fb;
}