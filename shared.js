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
    div.className = 'hline';
    div.innerHTML = `<span class="hts">${ts}</span><span>${msg}</span>`;
    c.prepend(div);
    while (c.children.length > 30) c.removeChild(c.lastChild);
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
        addHistory('Vue: ' + tab.textContent.trim());
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
  function openModal(id) { document.getElementById(id)?.classList.add('open'); }
  function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
  function initModalClose() {
    document.addEventListener('click', e => {
      if (e.target.dataset.closeModal) closeModal(e.target.dataset.closeModal);
      if (e.target.classList.contains('modal-ov')) closeModal(e.target.id);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-ov.open').forEach(m => m.classList.remove('open'));
      }
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
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString('fr-FR');
    } catch { return d; }
  }

  // ── UPDATE STAT BOX ──
  function updateStat(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // ── EVAL SCORING ──
  const EVAL_CRITERIA = ['Disc','Proto','React','Comm','Hier','Comp'];
  const EVAL_LABELS = {
    Disc: 'Discipline', Proto: 'Connaissance protocoles',
    React: 'Réactivité', Comm: 'Communication',
    Hier: 'Respect hiérarchie', Comp: 'Comportement'
  };

  function getEvalMention(score, max=60) {
    const p = score / max;
    if (p >= 0.9) return { text: 'EXCELLENT', color: 'var(--safe)' };
    if (p >= 0.75) return { text: 'TRÈS BON', color: 'var(--accent)' };
    if (p >= 0.6) return { text: 'SATISFAISANT', color: 'var(--accent2)' };
    if (p >= 0.45) return { text: 'INSUFFISANT', color: 'var(--warn)' };
    return { text: 'RECALÉ', color: 'var(--danger)' };
  }

  function computeEvalTotal() {
    return EVAL_CRITERIA.reduce((s, k) => {
      const el = document.getElementById('score' + k);
      return s + (el ? parseInt(el.value) : 0);
    }, 0);
  }

  function updateEvalUI() {
    const total = computeEvalTotal();
    const scoreEl = document.getElementById('evalTotalScore');
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
      const slider = document.getElementById('score' + k);
      const val = document.getElementById('val' + k);
      if (!slider || !val) return;
      slider.addEventListener('input', () => {
        val.textContent = slider.value;
        updateEvalUI();
      });
    });
  }

  // ── RAPPORT TYPES & SEVERITIES ──
  const RAPPORT_TYPES = [
    { value: 'incident', label: '⚠ Incident' },
    { value: 'breach', label: '🔴 Brèche' },
    { value: 'personnel', label: '👤 Personnel' },
    { value: 'patrol', label: '🔒 Patrouille' },
    { value: 'test', label: '🧪 Test' },
    { value: 'disciplinary', label: '📋 Disciplinaire' },
  ];

  const RAPPORT_SEV = [
    { value: 'low', label: 'FAIBLE', color: 'var(--safe)' },
    { value: 'moderate', label: 'MODÉRÉE', color: 'var(--warn)' },
    { value: 'high', label: 'ÉLEVÉE', color: '#e67e22' },
    { value: 'critical', label: 'CRITIQUE', color: 'var(--danger)' },
  ];

  function getSevStyle(val) { return RAPPORT_SEV.find(s => s.value === val) || RAPPORT_SEV[0]; }
  function getTypeLabel(val) { return (RAPPORT_TYPES.find(t => t.value === val) || {}).label || val; }

  // ── EXPORT RAPPORT ──
  function exportRapport(r) {
    const sev = getSevStyle(r.severity);
    const typeLabel = getTypeLabel(r.type);
    const text = [
      '══════════════════════════════════════════',
      'SCP FOUNDATION — SITE-19',
      typeLabel.toUpperCase(),
      '══════════════════════════════════════════',
      `ID              : ${r.id}`,
      `DATE            : ${r.date}`,
      `AUTEUR          : ${r.author}${r.username ? ' (@' + r.username + ')' : ''}`,
      `DÉPARTEMENT     : ${r.dept}`,
      `SÉVÉRITÉ        : ${sev.label}`,
      '══════════════════════════════════════════',
      `TITRE : ${r.title}`,
      '══════════════════════════════════════════',
      '',
      'DESCRIPTION :',
      r.description,
      '',
      'CONCLUSION :',
      r.conclusion || '—',
      '',
      `TÉMOINS : ${r.witnesses?.join(', ') || '—'}`,
      '══════════════════════════════════════════',
      `[Généré le ${new Date().toLocaleString('fr-FR')}]`,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = r.id + '_' + r.title.replace(/[^a-z0-9]/gi, '_') + '.txt';
    a.click();
  }

  // ── FILL SELECT OPTIONS ──
  function fillSelect(id, options) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  }

  return {
    store, addHistory, initTabs, copyText,
    openModal, closeModal, initModalClose, genId,
    today, fmtDate, updateStat,
    EVAL_CRITERIA, EVAL_LABELS, getEvalMention,
    computeEvalTotal, updateEvalUI, initEvalSliders,
    RAPPORT_TYPES, RAPPORT_SEV, getSevStyle, getTypeLabel,
    exportRapport, fillSelect,
  };
})();