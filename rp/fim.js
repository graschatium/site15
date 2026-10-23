// Intranet FIM (Forces d'Intervention Mobiles) — onglets propres au
// département FIM de /rp/. Chargé avant le script principal de
// rp/index.html : utilise ses fonctions globales (apiFetch, escapeHtml,
// showToast, renderMarkdown, ICONS) uniquement au moment de l'appel.
// Contenu d'univers inspiré de la Fondation SCP (scp-wiki.wikidot.com,
// CC BY-SA 3.0), réécrit et adapté au Site-15.
(function () {
  const STYLE = `
  .fim-hero{ position:relative; overflow:hidden; border:1px solid var(--line); border-radius:3px; padding:22px 24px; margin-bottom:24px;
    background:linear-gradient(120deg, rgba(110,118,255,0.10), var(--panel) 60%); }
  .fim-hero::after{ content:''; position:absolute; inset:0; pointer-events:none; opacity:.5;
    background:repeating-linear-gradient(-45deg, transparent 0 14px, rgba(255,255,255,0.018) 14px 15px); }
  .fim-hero-eyebrow{ font-family:'JetBrains Mono', monospace; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent-2); }
  .fim-hero h2{ font-family:'Space Grotesk', sans-serif; font-size:21px; margin:6px 0 6px; }
  .fim-hero p{ color:var(--ink-dim); font-size:13px; line-height:1.65; max-width:640px; }
  .fim-grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:14px; }
  .fim-unit-card{ display:flex; flex-direction:column; gap:12px; text-align:left; cursor:pointer; color:inherit; font-family:'Inter', sans-serif;
    background:var(--panel); border:1px solid var(--line); border-top:3px solid var(--u); border-radius:3px; padding:18px;
    transition:transform .15s ease, border-color .2s ease, background .2s ease; }
  .fim-unit-card:hover{ transform:translateY(-2px); background:var(--panel-raised); border-color:var(--u); }
  .fim-unit-card.active{ background:var(--panel-raised); border-color:var(--u); box-shadow:0 0 0 1px var(--u) inset; }
  .fim-unit-top{ display:flex; align-items:center; gap:12px; }
  .fim-crest{ width:46px; height:52px; flex-shrink:0; color:var(--u); }
  .fim-unit-code{ font-family:'JetBrains Mono', monospace; font-size:15px; font-weight:700; letter-spacing:.04em; }
  .fim-unit-nick{ font-family:'Space Grotesk', sans-serif; font-size:13px; color:var(--u); margin-top:2px; }
  .fim-unit-role{ font-size:12.5px; color:var(--ink-dim); line-height:1.6; }
  .fim-unit-foot{ display:flex; justify-content:space-between; align-items:center; font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); }
  .fim-live{ display:inline-flex; align-items:center; gap:6px; }
  .fim-live i{ width:7px; height:7px; border-radius:50%; background:var(--ink-faint); display:inline-block; }
  .fim-live.on{ color:var(--good); } .fim-live.on i{ background:var(--good); box-shadow:0 0 8px var(--good); }
  .fim-dossier{ margin-top:22px; background:var(--panel); border:1px solid var(--line); border-left:3px solid var(--u); border-radius:3px; padding:24px 26px; }
  .fim-dossier-head{ display:flex; gap:18px; align-items:center; margin-bottom:18px; flex-wrap:wrap; }
  .fim-dossier-head .fim-crest{ width:64px; height:72px; }
  .fim-dossier h3{ font-family:'Space Grotesk', sans-serif; font-size:20px; }
  .fim-motto{ font-family:'JetBrains Mono', monospace; font-size:11.5px; color:var(--u); letter-spacing:.06em; margin-top:4px; }
  .fim-facts{ display:grid; grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); gap:10px; margin:0 0 18px; }
  .fim-fact{ background:var(--void-2); border-radius:3px; padding:10px 12px; }
  .fim-fact b{ display:block; font-family:'JetBrains Mono', monospace; font-size:9.5px; font-weight:500; text-transform:uppercase; letter-spacing:.08em; color:var(--ink-faint); margin-bottom:4px; }
  .fim-fact span{ font-size:12.5px; color:var(--ink); }
  .fim-roster{ display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  .fim-chip{ font-family:'JetBrains Mono', monospace; font-size:10.5px; padding:4px 9px; border-radius:2px; border:1px solid var(--line); color:var(--ink-dim); background:var(--void-2); }
  .fim-chip.u{ color:var(--u); border-color:color-mix(in srgb, var(--u) 40%, transparent); background:color-mix(in srgb, var(--u) 10%, transparent); }
  .fim-code{ display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono', monospace; font-weight:700; letter-spacing:.08em; font-size:12px;
    padding:5px 11px; border-radius:2px; color:var(--c); background:color-mix(in srgb, var(--c) 14%, transparent); border:1px solid color-mix(in srgb, var(--c) 45%, transparent); }
  .fim-code i{ width:8px; height:8px; border-radius:50%; background:var(--c); box-shadow:0 0 10px var(--c); display:inline-block; }
  .fim-server{ background:var(--panel); border:1px solid var(--line); border-radius:3px; padding:18px 20px; margin-bottom:14px; }
  .fim-server-head{ display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
  .fim-server-id{ font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--ink-faint); }
  .fim-sit-grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:10px; }
  .fim-sit-cell{ background:var(--void-2); border-radius:3px; padding:12px 14px; min-height:72px; }
  .fim-sit-cell h4{ font-family:'JetBrains Mono', monospace; font-size:9.5px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:8px; }
  .fim-sit-cell.bad{ box-shadow:inset 0 0 0 1px rgba(240,82,90,0.45); background:rgba(240,82,90,0.06); }
  .fim-sit-cell.warn{ box-shadow:inset 0 0 0 1px rgba(240,168,60,0.4); }
  .fim-posture{ margin-top:14px; padding:12px 14px; border-left:2px solid var(--c); background:color-mix(in srgb, var(--c) 6%, transparent); font-size:12.5px; color:var(--ink-dim); line-height:1.6; }
  .fim-posture b{ color:var(--ink); }
  .fim-subnav{ display:flex; gap:4px; margin-bottom:18px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
  .fim-subnav button{ padding:9px 14px; font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.04em; text-transform:uppercase;
    color:var(--ink-faint); background:none; border:none; cursor:pointer; border-bottom:2px solid transparent; }
  .fim-subnav button:hover{ color:var(--ink-dim); }
  .fim-subnav button.active{ color:var(--accent-2); border-bottom-color:var(--accent); }
  .fim-op{ background:var(--panel); border:1px solid var(--line); border-left:3px solid var(--u, var(--line)); border-radius:3px; padding:16px 18px; margin-bottom:12px; }
  .fim-op-top{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
  .fim-op-name{ font-family:'JetBrains Mono', monospace; font-weight:700; font-size:14px; letter-spacing:.05em; margin-right:auto; }
  .fim-pill{ font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.05em; text-transform:uppercase; padding:3px 9px; border-radius:2px;
    color:var(--c, var(--ink-dim)); background:color-mix(in srgb, var(--c, #9297A8) 13%, transparent); border:1px solid color-mix(in srgb, var(--c, #9297A8) 35%, transparent); }
  .fim-op-meta{ display:flex; gap:16px; flex-wrap:wrap; font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); margin-bottom:10px; }
  .fim-op-meta b{ color:var(--ink-dim); font-weight:500; }
  .fim-op-body{ font-size:13px; color:var(--ink-dim); line-height:1.7; white-space:pre-wrap; }
  .fim-op-log{ margin-top:10px; padding-top:10px; border-top:1px dashed var(--line); font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); line-height:1.8; }
  .fim-scp-card{ cursor:pointer; text-align:left; color:inherit; font-family:'Inter', sans-serif; background:var(--panel); border:1px solid var(--line); border-radius:3px; padding:14px 16px;
    display:flex; flex-direction:column; gap:8px; transition:border-color .2s ease, background .2s ease; }
  .fim-scp-card:hover, .fim-scp-card.active{ border-color:var(--accent); background:var(--panel-raised); }
  .fim-scp-card .id{ font-family:'JetBrains Mono', monospace; font-weight:700; font-size:14px; }
  .fim-scp-card .nm{ font-size:12px; color:var(--ink-dim); }
  .fim-threat{ display:flex; gap:3px; } .fim-threat i{ width:14px; height:4px; border-radius:1px; background:var(--line); display:inline-block; }
  .fim-threat i.on{ background:var(--c); }
  .fim-credit{ margin-top:28px; font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); line-height:1.6; }
  .fim-credit a{ text-decoration:underline; }
  .fim-table td, .fim-table th{ font-size:12.5px; }
  .fim-search{ width:100%; margin:0 0 14px; }
  .fim-op.mine{ box-shadow:inset 0 0 0 1px rgba(79,216,149,0.35); }
  .fim-op-team{ display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
  .fim-op-team .fim-chip i{ font-style:normal; color:var(--ink-faint); }
  .fim-op-team .fim-chip.me{ color:#4FD895; border-color:rgba(79,216,149,0.45); }
  .fim-op-foot{ margin-top:10px; font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); }
  .fim-journal{ margin-top:12px; background:var(--void-2); border-radius:3px; padding:10px 12px; }
  .fim-journal-head{ display:flex; justify-content:space-between; align-items:center; font-family:'JetBrains Mono', monospace; font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent-2); margin-bottom:6px; }
  .fim-journal-row{ display:flex; align-items:center; gap:8px; padding:6px 0; border-top:1px dashed var(--line); font-size:12.5px; }
  .fim-journal-row .t{ font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); }
  .fim-journal-row .x{ flex:1; color:var(--ink-dim); }
  .fim-journal-row .by{ font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); }
  .fim-journal-form{ display:flex; gap:8px; margin-top:8px; }
  .fim-journal-form select{ width:auto; }
  .fim-journal-form input{ flex:1; }
  .fim-link{ background:none; border:none; color:var(--accent-2); cursor:pointer; font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.06em; text-transform:uppercase; }
  .fim-x{ background:none; border:1px solid var(--line); color:var(--ink-faint); width:24px; height:24px; border-radius:2px; cursor:pointer; flex-shrink:0; }
  .fim-x:hover{ color:var(--bad); border-color:var(--bad); }
  .fim-picker{ display:flex; flex-wrap:wrap; gap:6px; max-height:170px; overflow:auto; padding:8px; background:var(--void-2); border-radius:3px; }
  .fim-picker .fim-chip{ cursor:pointer; opacity:.6; }
  .fim-picker .fim-chip.picked{ opacity:1; box-shadow:0 0 0 1px var(--u) inset; }
  .fim-team-list{ display:flex; flex-direction:column; gap:6px; }
  .fim-team-row{ display:grid; grid-template-columns:minmax(140px, 1fr) 1.4fr auto; gap:8px; align-items:center; }
  .fim-team-row .nm{ font-family:'JetBrains Mono', monospace; font-size:12px; }
  .fim-plan-day{ margin-bottom:18px; }
  .fim-plan-day h3{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent-2); margin-bottom:8px; }
  .fim-plan-row{ display:flex; align-items:center; gap:10px; padding:10px 12px; margin-bottom:6px; background:var(--panel); border:1px solid var(--line); border-left:3px solid var(--u); border-radius:3px; flex-wrap:wrap; }
  .fim-plan-row .time{ font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; width:48px; }
  .fim-plan-row .nm{ font-family:'JetBrains Mono', monospace; font-weight:700; font-size:12.5px; letter-spacing:.04em; }
  .fim-plan-row .meta{ font-size:12px; color:var(--ink-faint); margin-right:auto; }
  @media (max-width:640px){ .fim-team-row{ grid-template-columns:1fr auto; } .fim-team-row input{ grid-column:1 / -1; } .fim-journal-form{ flex-wrap:wrap; } }
  .fim-op.focus{ box-shadow:0 0 0 1px var(--accent); }
  .fim-hq-units{ display:flex; flex-wrap:wrap; gap:6px; margin-top:14px; }
  .fim-hq-units .fim-chip.off{ opacity:.5; }
  .fim-hq-grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:14px; }
  .fim-hq-card{ background:var(--panel); border:1px solid var(--line); border-radius:3px; padding:16px 18px; display:flex; flex-direction:column; gap:10px; }
  .fim-hq-card-head{ display:flex; justify-content:space-between; align-items:center; }
  .fim-hq-card-head h3{ font-family:'JetBrains Mono', monospace; font-size:10.5px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:var(--accent-2); }
  .fim-hq-card-head .count{ font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--ink-faint); }
  .fim-hq-card-body{ display:flex; flex-direction:column; gap:6px; flex:1; }
  .fim-hq-foot{ display:flex; gap:8px; flex-wrap:wrap; padding-top:10px; border-top:1px dashed var(--line); }
  .fim-hq-me{ display:flex; gap:12px; align-items:center; color:var(--u); }
  .fim-hq-me-name{ font-family:'Space Grotesk', sans-serif; font-size:17px; font-weight:600; color:var(--ink); }
  .fim-hq-me-sub{ font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); margin-top:3px; }
  .fim-hq-kpis{ display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:4px; }
  .fim-hq-kpis div{ background:var(--void-2); border-radius:3px; padding:8px 10px; }
  .fim-hq-kpis b{ display:block; font-family:'JetBrains Mono', monospace; font-size:16px; }
  .fim-hq-kpis span{ font-family:'JetBrains Mono', monospace; font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-faint); }
  .fim-hq-row{ display:flex; align-items:center; gap:8px; padding:8px 10px; background:var(--void-2); border-left:2px solid var(--u); border-radius:2px; }
  .fim-hq-row .nm{ font-family:'JetBrains Mono', monospace; font-weight:700; font-size:12px; letter-spacing:.04em; }
  .fim-hq-row .meta{ font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); margin-right:auto; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .fim-hq-todo{ display:flex; flex-direction:column; gap:2px; text-align:left; cursor:pointer; color:inherit; font-family:'Inter', sans-serif; font-size:12.5px;
    padding:9px 11px; background:var(--void-2); border:1px solid transparent; border-radius:2px; }
  .fim-hq-todo:hover{ border-color:var(--accent); }
  .fim-hq-todo small{ font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); }
  .fim-hq .fim-medals{ margin-top:4px; }
  .fim-staff{ width:100%; border-collapse:collapse; font-size:12.5px; }
  .fim-staff th{ text-align:left; font-family:'JetBrains Mono', monospace; font-size:9.5px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); padding:8px 10px; border-bottom:1px solid var(--line); }
  .fim-staff td{ padding:9px 10px; border-bottom:1px solid var(--line); vertical-align:middle; }
  .fim-staff tr.unit-row td{ font-family:'JetBrains Mono', monospace; font-size:10.5px; letter-spacing:.08em; color:var(--u); background:color-mix(in srgb, var(--u) 7%, transparent); border-left:3px solid var(--u); }
  .fim-staff .em{ display:inline-flex; width:22px; height:22px; border-radius:50%; align-items:center; justify-content:center; margin-right:3px; color:#E6B43C; border:1px solid rgba(230,180,60,.45); }
  .fim-staff .em svg{ width:13px; height:13px; }
  .fim-staff tr.clickable{ cursor:pointer; }
  .fim-staff tr.clickable:hover td{ background:var(--panel-raised); }
  .fim-staff tr.sel td{ background:color-mix(in srgb, var(--accent) 10%, transparent); }
  .fim-note{ border-left:2px solid var(--c); background:var(--void-2); border-radius:2px; padding:9px 12px; margin-bottom:8px; }
  .fim-note-head{ display:flex; align-items:center; gap:10px; font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); }
  .fim-note-head span:nth-child(2){ margin-right:auto; }
  .fim-note-text{ font-size:12.5px; color:var(--ink-dim); line-height:1.6; margin-top:6px; white-space:pre-wrap; }
  .fim-staff-wrap{ overflow-x:auto; background:var(--panel); border:1px solid var(--line); border-radius:3px; }
  @media (max-width:640px){ .fim-dossier{ padding:18px; } .fim-hero{ padding:18px; } }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  // ---------------------------------------------------------------
  // Données fixes
  // ---------------------------------------------------------------
  const CODES = {
    VERT: { color: '#4FD895', desc: 'Les opérations du Site ne sont pas perturbées.', posture: "<b>Posture 5 — Garnison.</b> Entraînement, patrouilles de routine en surface, maintenance du matériel. Les unités restent joignables à la Base des FIM." },
    JAUNE: { color: '#F2D14B', desc: 'Vigilance requise. Risque suspecté.', posture: "<b>Posture 4 — Vigilance.</b> Une équipe d'alerte s'équipe à la Base des FIM. Radio ouverte en permanence sur le canal FIM." },
    ORANGE: { color: '#F0A83C', desc: 'Brèche de confinement mineure.', posture: "<b>Posture 3 — Intervention.</b> Epsilon-11 se déploie vers la zone signalée en appui de l'EIT. Les autres unités restent en réserve." },
    BLEU: { color: '#5AA9FF', desc: 'Toutes les expériences doivent être interrompues.', posture: "<b>Posture 3 — Escorte.</b> Les FIM sécurisent les chambres de test et escortent le personnel scientifique hors des zones de confinement." },
    ROUGE: { color: '#F0525A', desc: 'Brèches de confinement multiples. Personnel non-combatif, rejoignez les abris les plus proches.', posture: "<b>Posture 2 — Reconfinement.</b> Toutes les unités disponibles sont déployées. Epsilon-11 prend la tête du reconfinement, Nu-7 tient les axes et la Gate A, Bêta-7 gère les zones contaminées." },
    MAUVE: { color: '#B07CFF', desc: "L'installation est attaquée. Rejoignez les abris les plus proches.", posture: "<b>Posture 2 — Défense du Site.</b> Nu-7 prend le commandement tactique contre la force hostile (Insurrection du Chaos en priorité). Epsilon-11 protège les cellules SCP et les abris." },
    BLANC: { color: '#E8EAF0', desc: "Entité inconnue repérée dans l'installation.", posture: "<b>Posture 2 — Identification.</b> Bêta-7 isole la zone. Aucun tir sur une entité non identifiée sans ordre. Observation, prise d'images, rapport au Département Scientifique." },
    NOIR: { color: '#7A7F8E', desc: "L'installation est hors de ses moyens. Survivez.", posture: "<b>Posture 1 — Dernier rempart.</b> Commandement direct Alpha-1 / Conseil O5. Protection des abris et de l'évacuation, préparation éventuelle de l'ogive du Site." },
  };
  const CODE_ORDER = ['VERT', 'JAUNE', 'ORANGE', 'BLEU', 'ROUGE', 'MAUVE', 'BLANC', 'NOIR'];

  const UNITS = [
    {
      id: 'ALPHA-1', letter: 'Α', name: 'Alpha-1', nick: '« La Main Droite Rouge »', color: '#E0443F',
      callsign: 'MAIN', motto: 'PAR LA MAIN DU CONSEIL', match: ['ALPHA', 'A-1', 'A1'],
      role: "Unité placée sous l'autorité directe du Conseil O5. Opérations les plus sensibles de la Fondation.",
      facts: { Autorité: 'Conseil O5', Spécialité: 'Opérations au plus haut niveau', Effectif: 'Classifié', Accréditation: 'Niveau 5', Indicatif: 'MAIN', Déploiement: 'Sur ordre O5 uniquement' },
      body: `
## Mission
Alpha-1 est la seule Force d'Intervention Mobile qui ne répond à **aucun directeur de site**. Elle reçoit ses ordres directement du Conseil O5 et intervient là où l'existence même de la Fondation est en jeu : trahison au sommet, prise de contrôle d'une installation, anomalie capable de compromettre le Voile.

Ses membres sont sélectionnés parmi les meilleurs opérateurs des autres FIM, après une enquête de loyauté approfondie menée par le {{Bureau de la Sécurité Interne}}.

## Au Site-15
- Arrive **sans préavis** : l'annonce « Déploiement de la FIM Alpha-1 sur le site » suffit à transférer le commandement tactique.
- Seule unité habilitée à **escorter un membre du Conseil O5** et à superviser l'armement de l'ogive nucléaire du Site.
- Peut placer n'importe quel membre du personnel, y compris un directeur, en **détention préventive**.
- Ses ordres priment sur ceux de toutes les autres FIM, de la DSE et de l'EIT.

## Règles propres
- Aucune identité réelle n'est communiquée : les opérateurs se présentent par leur indicatif (MAIN-1, MAIN-2…).
- Les rapports Alpha-1 sont transmis au Conseil, pas au commandement du Site.
- Une opération Alpha-1 n'est jamais commentée sur les canaux radio publics.

> « Ils ne sont pas là pour vous protéger. Ils sont là pour protéger ce que nous gardons. »
`,
    },
    {
      id: 'EPSILON-11', letter: 'Ε', name: 'Epsilon-11', nick: '« Les Neuf-Queues »', color: '#6E76FF',
      callsign: 'RENARD', motto: 'NOUS GARDONS LA NUIT', match: ['EPSILON', 'E-11', 'E11'],
      role: "Reconfinement à l'intérieur des installations. Première unité déployée lors d'une brèche.",
      facts: { Autorité: 'Commandement FIM', Spécialité: 'Reconfinement intra-site', Effectif: '2 escouades', Accréditation: 'Niveau 4', Indicatif: 'RENARD', Déploiement: 'Code ORANGE et plus' },
      body: `
## Mission
Epsilon-11, les « Neuf-Queues », est spécialisée dans le **reconfinement d'anomalies à l'intérieur même des sites**. Ses opérateurs connaissent les plans des installations, les procédures de chaque cellule et le comportement des entités qu'ils gardent.

C'est l'unité qu'on appelle quand une porte de cellule reste ouverte.

## Au Site-15
- Déploiement prioritaire dès le **code ORANGE**, en appui de l'Équipe d'Intervention Tactique.
- Prend la tête du reconfinement au **code ROUGE**.
- Utilise le **Kit de confinement** et les terminaux de confinement des cellules.
- Seule unité dotée d'un **binôme cynophile K9** en intervention de reconfinement.

## Spécialités
- Procédures de reconfinement de chaque SCP du Site (voir l'onglet *Reconfinement*).
- Combat rapproché en couloirs, nettoyage de zone pièce par pièce.
- Évacuation du personnel bloqué en zone de confinement.

> « Neuf queues, une seule tête. Le renard ne recule pas. »
`,
    },
    {
      id: 'NU-7', letter: 'Ν', name: 'Nu-7', nick: '« Le Marteau Tombe »', color: '#50C878',
      callsign: 'MARTEAU', motto: 'QUAND LE MARTEAU TOMBE', match: ['NU-7', 'NU7', 'N-7'],
      role: "Division militaire lourde. Défense du Site contre les forces hostiles armées.",
      facts: { Autorité: 'Commandement FIM', Spécialité: 'Combat de haute intensité', Effectif: 'Section renforcée', Accréditation: 'Niveau 4', Indicatif: 'MARTEAU', Déploiement: 'Code MAUVE / ROUGE' },
      body: `
## Mission
Nu-7, « Le Marteau Tombe », est la **force de frappe conventionnelle** de la Fondation : armement lourd, véhicules, tireurs d'élite. Là où Epsilon-11 reconfine, Nu-7 **tient le terrain**.

## Au Site-15
- Prend le commandement tactique au **code MAUVE** (attaque du Site).
- Cible prioritaire : l'**Insurrection du Chaos** et toute force armée non identifiée.
- Tient les points de passage : **Gate A**, checkpoint de la zone Classe-D, quais du tram (ligne D, arrêt D-FIM).
- Fournit les **tireurs d'élite** (BARRETT M98B, tir uniquement à la lunette).

## Spécialités
- Défense de périmètre, tir de suppression, appui feu des autres unités.
- Contre-assaut après un raid IC, récupération d'objets volés.
- Emploi du C4, des grenades aveuglantes et des boucliers anti-émeute.

> « On ne négocie pas avec un marteau. »
`,
    },
    {
      id: 'BETA-7', letter: 'Β', name: 'Bêta-7', nick: '« Les Chapeliers Fous »', color: '#E6B43C',
      callsign: 'CHAPELIER', motto: 'RESPIREZ QUAND ON VOUS LE DIT', match: ['BETA', 'BÊTA', 'B-7', 'B7'],
      role: "Menaces biologiques, chimiques, radiologiques et mémétiques (NRBC).",
      facts: { Autorité: 'Commandement FIM', Spécialité: 'NRBC / contamination', Effectif: '1 escouade', Accréditation: 'Niveau 4', Indicatif: 'CHAPELIER', Déploiement: 'Contamination, code BLANC' },
      body: `
## Mission
Bêta-7, les « Chapeliers Fous », intervient lorsque **l'air, l'eau ou les corps** deviennent le danger : agents biologiques, gaz, radiations, contamination mémétique. Ses opérateurs travaillent en tenue étanche intégrale et masque à gaz.

## Au Site-15
- Déploiement sur **fuite radioactive**, épidémie, contamination de zone et **code BLANC** (entité inconnue).
- Établit les **zones d'exclusion** et les sas de décontamination, en lien avec le Département Médical (division BIO).
- Escorte les sujets contaminés vers la quarantaine.
- Gère les zones touchées par **SCP-457** (feu) et **SCP-049** (« pestilence »).

## Spécialités
- Décontamination, prélèvements, détection.
- Évacuation sous fumigène, intervention en zone sans lumière (JVN).
- Isolement d'une zone entière : personne n'entre, personne ne sort.

> « Si vous nous voyez arriver, retenez votre souffle. »
`,
    },
    {
      id: 'XI-8', letter: 'Ξ', name: 'Xi-8', nick: '« K.N.I »', color: '#B07CFF',
      callsign: 'XI', motto: 'LA CHAIR NE PASSERA PAS', match: ['XI-8', 'XI8', 'K.N.I', 'KNI'],
      role: "Bataillon dédié à l'acquisition et/ou la destruction d'entités et d'artéfacts sarkiques.",
      facts: { Autorité: 'Commandement FIM (affiliée)', Spécialité: 'Menaces sarkiques', Effectif: 'Bataillon', Accréditation: 'Niveau 4', Indicatif: 'XI', Déploiement: 'Sur menace sarkique' },
      body: `
## Mission
Xi-8 est un bataillon affilié aux FIM, dédié à **l'acquisition et/ou la destruction d'entités et d'artéfacts sarkiques** : anomalies de chair, cultes et objets liés à la tradition sarkique.

## Au Site-15
- Unité affiliée : ses opérateurs rejoignent le jeu par l'équipe **Xi-8 | K.N.I**.
- Intervient sur **menace sarkique** confirmée ou sur demande du Commandement FIM.
- Peut prendre en charge les prisonniers dans les cellules du tram de la ligne D.

## Règles propres
- Aucun objet sarkique n'est conservé sans l'accord du Département Scientifique.
- Toute exposition donne lieu à un examen médical complet avant le retour en service.

> « La chair ne passera pas. »
`,
    },
    {
      id: 'SIGMA-9', letter: 'Σ', name: 'Sigma-9', nick: '« Valkyries »', color: '#38C6D9',
      callsign: 'VALKYRIE', motto: 'NOUS TOMBONS DU CIEL', match: ['SIGMA-9', 'SIGMA', 'S-9', 'VALKYRIE'],
      role: "Petite unité aérienne : appui des opérations au sol et lutte contre les anomalies volantes.",
      facts: { Autorité: 'Commandement FIM', Spécialité: 'Appui aérien, observation, anomalies volantes', Effectif: 'Petite unité', Accréditation: 'Niveau 4', Indicatif: 'VALKYRIE', Déploiement: "Sur demande d'appui ou menace aérienne" },
      body: `
## Mission
Sigma-9, les « Valkyries », est une **petite unité aérienne** de la Fondation. Elle apporte un **appui aérien aux opérations au sol** et combat les **anomalies volantes** que les autres unités ne peuvent pas atteindre.

Elle n'agit presque jamais seule : on l'appelle quand une opération a besoin de **voir de haut**, de **couvrir** une équipe ou de **poursuivre** une cible qui échappe au sol.

## Au Site-15
- Fournit les **pilotes et équipages** des appareils FIM : transport de troupes, largage, appui aérien.
- Au sol, opère depuis la **surface, les toits et les points hauts** : c'est l'**œil au-dessus** des autres FIM.
- **Surveillance** des abords, de la **Gate A** et des accès extérieurs pendant les alertes ; guidage des équipes au sol par radio.
- **Couverture** des évacuations, des convois et des transferts par la surface.
- Déploiement prioritaire lorsqu'une **anomalie volante** ou une entité s'échappe **à l'extérieur** du Site.
- Appui des autres unités : repère les cibles pour Nu-7, ouvre la voie à Epsilon-11, surveille les zones d'exclusion de Bêta-7.

## Spécialités
- Observation, repérage et guidage (radio, marquage des positions).
- Tir de précision et tir d'appui à longue distance.
- Intervention rapide par le haut : arrivée et extraction par les toits et les accès de surface.
- Lutte contre les cibles aériennes et les entités qui se déplacent hors de portée du sol.

## Règles propres
- Une Valkyrie **ne descend pas** au contact sans ordre : sa place est au-dessus, pas dans le couloir.
- Toute position d'observation est annoncée sur le canal FIM, jamais sur les canaux publics.
- Pas de tir d'appui au-dessus d'une équipe amie sans **confirmation radio** du chef d'équipe.

## Dossiers connus
Unité citée dans le confinement de plusieurs anomalies aériennes ou en altitude, dont **SCP-526**, **SCP-1262** et **SCP-2069**.

> « Quand vous entendez les Valkyries, c'est qu'on vous a déjà vus. »
`,
    },
  ];

  // Fiches de reconfinement — adaptées au comportement réel des SCP du jeu.
  const SCPS = [
    { id: 'SCP-173', name: 'La Sculpture', cls: 'Euclid', threat: 4, units: 'EPSILON-11',
      md: `
## Comportement
Statue de béton qui **ne bouge que lorsqu'elle n'est observée par personne**. Brise la nuque de sa cible en un instant.

## Procédure
1. Jamais seul : entrée en **trinôme minimum**, chaque opérateur garde un contact visuel.
2. **Annoncez vos clignements** à la radio (« clignement ») : un autre opérateur reprend le contact avant.
3. Pas de lampe coupée, pas de fumigène dans la pièce : perdre la vue, c'est perdre un homme.
4. Reculez vers la cellule **face à l'entité**, sans jamais tourner le dos.

## Interdits
- Grenade aveuglante, fumigène, extinction des lumières.
- Laisser un couloir sans observateur derrière soi.
` },
    { id: 'SCP-096', name: "L'Homme Timide", cls: 'Euclid', threat: 5, units: 'EPSILON-11 · ALPHA-1',
      md: `
## Comportement
Humanoïde pâle et passif… jusqu'à ce que **quelqu'un voie son visage**, même sur un écran. Il poursuit alors cette personne sans s'arrêter, à travers tout obstacle, jusqu'à l'avoir tuée.

## Procédure
1. **Ne regardez jamais son visage.** Pas de caméra, pas de JVN braquée sur lui, pas de capture.
2. Identifiez la ou les personnes qui l'ont vu : elles sont **déjà perdues**, évacuez tout le monde autour d'elles.
3. Laissez la crise se terminer : 096 se calme une fois sa cible éliminée.
4. Reconfinement uniquement **dos tourné**, sac de contention sur la tête, dirigé par la radio.

## Interdits
- Tirer sur 096 en crise : inutile, et l'équipe se retrouve sur son chemin.
` },
    { id: 'SCP-049', name: 'Le Docteur de Peste', cls: 'Euclid', threat: 4, units: 'BETA-7 · EPSILON-11',
      md: `
## Comportement
Humanoïde en tenue de médecin de peste, **doué de parole**. Il croit combattre une « pestilence » et tue au toucher, puis transforme ses victimes en **SCP-049-2** (cadavres animés hostiles).

## Procédure
1. **Distance minimale : 5 m.** Il ne doit jamais pouvoir toucher un opérateur.
2. Ne lui répondez pas : sa voix sert à attirer. Un seul négociateur désigné, à distance.
3. Neutralisez les **049-2** en priorité, ils protègent leur « docteur ».
4. Bêta-7 sécurise les corps : aucun cadavre ne reste dans un couloir.

## Interdits
- Le contact physique, même pour le menotter.
` },
    { id: 'SCP-939', name: 'Aux Multiples Voix', cls: 'Keter', threat: 5, units: 'EPSILON-11 · NU-7',
      md: `
## Comportement
Prédateur quadrupède **aveugle** qui chasse au son et **imite les voix humaines** pour attirer ses proies. Plus rapide qu'un opérateur au sprint. Il entend les tirs, les pas et les conversations.

## Procédure
1. **Silence radio dans la zone** : gestes uniquement. Ce que vous entendez n'est peut-être pas un collègue.
2. **Marchez, ne courez pas** : le sprint et l'équipement lourd font du bruit.
3. Si vous êtes repéré, le tir doit être **massif et immédiat** ; un tir isolé ne fait que le guider.
4. Code de vérification oral obligatoire avant de répondre à un appel à l'aide.

## Interdits
- Répondre à une voix sans code de vérification.
- Courir dans un couloir où il a été signalé.
` },
    { id: 'SCP-966', name: "L'Insomniaque", cls: 'Euclid', threat: 3, units: 'EPSILON-11',
      md: `
## Comportement
Créatures **invisibles à l'œil nu** qui épuisent leurs victimes en les privant de sommeil (vertiges, micro-sommeils), puis les attaquent quand elles sont trop faibles.

## Procédure
1. **JVN obligatoire** : elles sont visibles en vision nocturne. Surveillez la batterie (environ 5 minutes allumée).
2. Rotation des opérateurs : quiconque se sent **somnolent** quitte la zone.
3. Progression en binôme, l'un observe en JVN pendant que l'autre recharge.

## Interdits
- Entrer seul ou sans JVN chargée.
` },
    { id: 'SCP-076', name: 'Abel', cls: 'Keter', threat: 5, units: 'NU-7 · ALPHA-1',
      md: `
## Comportement
Guerrier humanoïde d'une force et d'une agilité extrêmes, armé de lames. Il **entre en rage une fois blessé** (moins de la moitié de sa vie) et devient encore plus dangereux. Il revient toujours.

## Procédure
1. Engagement à **longue distance uniquement** : tireurs d'élite Nu-7, armes lourdes.
2. Ne vous laissez jamais acculer : chaque équipe garde une sortie.
3. Quand il passe en rage, **repli immédiat** sur la ligne suivante et feu concentré.
4. Le reconfinement se fait dans son cercueil, sous escorte Nu-7.

## Interdits
- Le corps à corps, même à plusieurs.
` },
    { id: 'SCP-457', name: "L'Homme Ardent", cls: 'Euclid', threat: 4, units: 'BETA-7',
      md: `
## Comportement
Entité faite de **flammes**, qui grandit à mesure qu'elle brûle et laisse une **traînée de feu** derrière elle. Elle enflamme ce qu'elle touche.

## Procédure
1. Bêta-7 en tête, **tenue ignifugée**.
2. Ne la suivez pas dans sa traînée : contournez.
3. Faites évacuer les zones combustibles (cantine, stockage).
4. Reconfinement dans la cellule étanche, privée d'oxygène.

## Interdits
- Rester au contact : les brûlures s'accumulent.
` },
    { id: 'SCP-017', name: "L'Ombre", cls: 'Keter', threat: 4, units: 'EPSILON-11',
      md: `
## Comportement
Silhouette d'ombre qui **éteint les lumières** autour d'elle et absorbe ceux qui se trouvent dans l'obscurité qu'elle crée.

## Procédure
1. **Restez dans la lumière** : lampes d'arme allumées (touche L), éclairage de zone maintenu.
2. Gardez une source de lumière derrière vous en repli.
3. Coordination avec la DI&ST pour l'éclairage de secours.

## Interdits
- La JVN seule, sans lumière réelle.
` },
    { id: 'SCP-352', name: 'Baba Yaga', cls: 'Euclid', threat: 3, units: 'EPSILON-11',
      md: `
## Comportement
Femme âgée aux longs cheveux qui **ralentit et immobilise** ses victimes en les enserrant.

## Procédure
1. Distance : chaque coup reçu vous **ralentit quelques secondes**.
2. Binôme obligatoire : l'un dégage l'autre pendant qu'il est ralenti.
3. Reconfinement par la chambre de contention à piège.
` },
    { id: 'SCP-999', name: 'La Gelée Joyeuse', cls: 'Safe', threat: 1, units: '—',
      md: `
## Comportement
Masse gélatineuse orange, **inoffensive et affectueuse**, qui provoque un sentiment de bien-être.

## Procédure
Aucune intervention FIM requise. Si elle sort de sa cellule pendant une brèche, raccompagnez-la calmement : elle aide à calmer le personnel.
` },
  ];
  const CLASS_COLORS = { Safe: '#4FD895', Euclid: '#F0A83C', Keter: '#F0525A' };

  const DOCTRINE = [
    { id: 'charte', cat: 'Fondamentaux', title: 'Charte des Forces d\'Intervention Mobiles', md: `
Les **Forces d'Intervention Mobiles (FIM)** sont des unités d'élite que la Fondation déploie là où la sécurité ordinaire ne suffit plus. Elles sont recrutées parmi le personnel militaire et de sécurité le plus expérimenté.

## Chaîne de commandement
1. **Conseil O5** : autorité suprême, commande directement Alpha-1.
2. **Commandement FIM** : affecte les unités et valide les opérations.
3. **Chef d'unité** : responsable tactique sur le terrain.
4. **Chef d'équipe** : dirige un binôme ou un trinôme.
5. **Opérateurs**.

## Rapports avec le Site
- La **DSE** (Département de la Sécurité) assure la sécurité courante ; l'**EIT** est sa réponse armée.
- Les FIM interviennent **au-dessus** de l'EIT : sur code d'alerte, sur demande du Directeur du Site ou sur ordre du Commandement FIM.
- Une fois une FIM annoncée sur le Site, **le commandement tactique de la zone lui revient**.

## Devoirs de l'opérateur
- Confidentialité absolue sur les opérations.
- Respect de la chaîne de commandement et des règles d'engagement.
- Rédaction d'un **débriefing** après toute opération.
` },
    { id: 'roe', cat: 'Fondamentaux', title: "Règles d'engagement (RDE)", md: `
Chaque opération indique son niveau de RDE. Sans précision, c'est **RDE-1** qui s'applique.

| Niveau | Nom | Autorise |
|---|---|---|
| RDE-0 | Observation | Aucun tir. Reconnaissance, escorte, présence dissuasive. |
| RDE-1 | Riposte | Tir uniquement en réponse à une agression directe. |
| RDE-2 | Neutralisation | Tir sur toute personne armée et hostile, et sur les SCP en brèche. |
| RDE-3 | Feu libre | Tir sans sommation sur tout hostile identifié (Insurrection du Chaos, évadé armé). |
| RDE-Ω | Omega | Réservé à Alpha-1 sur ordre O5. |

## Toujours
- **Le personnel de la Fondation n'est jamais une cible**, sauf trahison constatée et ordre explicite.
- Un Classe-D qui se rend est **menotté**, pas abattu.
- En cas de doute sur une entité : on observe, on rend compte, on attend l'ordre.

> HRP : les règles du serveur s'appliquent toujours. Pas de tir sans raison RP, pas de « random kill ».
` },
    { id: 'codes', cat: 'Site-15', title: "Codes d'alerte et posture FIM", md: null },
    { id: 'protocoles', cat: 'Site-15', title: 'Protocoles du Site et rôle des FIM', md: `
Les protocoles sont lancés depuis les **consoles des protocoles**. Ils verrouillent ou ouvrent des portes de tout le Site.

| Protocole | Niveau | Code | Rôle des FIM |
|---|---|---|---|
| Anti-émeute | N3 | ORANGE | Nu-7 en appui de la DSE au checkpoint Classe-D. Boucliers, grenades aveuglantes. |
| Confinement zone lourde | N3 | JAUNE | Epsilon-11 se poste aux sas de la zone lourde et du réacteur. |
| Confinement zone moyenne | N3 | JAUNE | Epsilon-11 contrôle les accès de la zone moyenne. |
| Confinement total | N4 | ROUGE | Toutes les unités. Personne ne circule sans escorte FIM. Les abris restent ouverts. |
| Évacuation | N4 | ROUGE | Escorte du personnel vers les abris. Nu-7 tient la zone lourde verrouillée. |
| Brèche de confinement | N4 | ROUGE | Les accès [REDACTED] vers la Gate A s'ouvrent : Nu-7 **tient la Gate A**, aucun Classe-D ne sort. |

Un opérateur FIM de niveau 4 peut **lever tous les protocoles** à une console, une fois la zone sécurisée et sur ordre du chef d'unité.
` },
    { id: 'reconfinement', cat: 'Opérations', title: 'Procédure de reconfinement standard', md: `
## 1. Alerte
Réception du code ou de l'annonce de déploiement. Équipement complet à la **Base des FIM** (arrêt D-FIM du tram, ascenseurs MTF).

## 2. Briefing (2 minutes maximum)
Le chef d'unité annonce : **entité, zone, RDE, équipes, fréquence radio, point de regroupement**. L'opération est créée dans l'onglet *Opérations*.

## 3. Insertion
Par le tram de la ligne D ou les ascenseurs. Les portes de zone sont ouvertes au badge par l'opérateur de tête ; **personne ne reste seul** dans un sas.

## 4. Localisation
Caméras de surveillance, terminaux de confinement, témoins. Annonce radio de chaque **contact** avec la position.

## 5. Neutralisation / reconfinement
Selon la fiche de l'entité (onglet *Reconfinement*). Kit de confinement en main, cellule ouverte depuis le terminal.

## 6. Sécurisation
Fouille de la zone, prise en charge des blessés (médecins, brancard, défibrillateur), comptage du personnel, levée des protocoles.

## 7. Débriefing
Dans l'heure, dans l'onglet *Débriefings* : déroulé, pertes, leçons. L'opération passe en **terminée**.
` },
    { id: 'radio', cat: 'Opérations', title: 'Communications radio', md: `
## Indicatifs
| Unité | Indicatif | Exemple |
|---|---|---|
| Alpha-1 | MAIN | « MAIN-1 à toutes les unités » |
| Epsilon-11 | RENARD | « RENARD-2, contact couloir est » |
| Nu-7 | MARTEAU | « MARTEAU-1, Gate A tenue » |
| Bêta-7 | CHAPELIER | « CHAPELIER-3, zone contaminée » |
| Xi-8 | XI | « XI-1, artéfact sécurisé » |
| Commandement | NID | « NID à RENARD, autorisé » |

## Codes brefs
- **CONTACT** : entité ou hostile en vue, suivi de la position.
- **BRÈCHE** : cellule ouverte ou entité hors confinement.
- **AU SOL** : opérateur à terre. Toujours suivi de la position.
- **MÉDIC** : demande de soins.
- **R.A.S.** : rien à signaler.
- **CONFINÉ** : entité de retour en cellule, porte fermée.
- **REPLI** : retrait immédiat vers le point de regroupement.
- **FEU VERT** / **FEU ROUGE** : tir autorisé / interdit.
- **CLIGNEMENT** : (SCP-173) « je ferme les yeux, reprenez le contact ».

## Discipline
- Messages courts : *qui appelle, qui est appelé, quoi, où*.
- Sous **brouillage radio**, on passe aux gestes et aux messagers.
- Face à SCP-939 : **silence radio**, code de vérification avant toute réponse.

## Alphabet
Alpha, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliett, Kilo, Lima, Mike, November, Oscar, Papa, Québec, Romeo, Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu.
` },
    { id: 'materiel', cat: 'Opérations', title: 'Dotation et matériel', md: `
| Matériel | Emploi |
|---|---|
| **Vision nocturne PVS-31** | Batterie d'environ 5 minutes allumée, recharge éteinte. Indispensable contre SCP-966. Évitez de fixer les lampes : éblouissement. |
| **Lampe d'arme** | Touche L. Obligatoire contre SCP-017. |
| **K9 Malinois** | Binôme cynophile (FIM et EIT). Pistage, détection, dissuasion. |
| **Kit de confinement** | Reconfinement des SCP aux terminaux de cellule. |
| **Bouclier anti-émeute** | Bloque les tirs de face. Protocole anti-émeute, couverture d'une progression. |
| **Fumigène** | Masque une progression ou une évacuation. Aveugle aussi les caméras. Jamais contre SCP-173. |
| **Grenade aveuglante** | Neutralise des hostiles dans une pièce avant l'entrée. |
| **C4** | Brèche de mur ou de porte. Nu-7 uniquement, sur ordre. |
| **BARRETT M98B** | Tireur d'élite Nu-7. Tir uniquement à la lunette ; retenir son souffle pour stabiliser. |
| **Bandage / attelle / défibrillateur** | Premiers soins avant l'arrivée du Médical. |

Chaque opérateur vérifie son matériel **avant** l'insertion, pas pendant.
` },
    { id: 'ogive', cat: 'Site-15', title: "Ogive nucléaire du Site", md: `
L'ogive du Site-15 est l'**ultime mesure** en cas de perte totale de contrôle (code NOIR).

- L'armement n'est envisagé que sur **ordre du Conseil O5**, sous supervision d'**Alpha-1**.
- Dès l'annonce « Ogive nucléaire du site armée », toutes les FIM passent en mission d'**évacuation** : le personnel est conduit à l'abri anti-atomique.
- Une annulation n'est valable que si elle est annoncée sur le canal officiel.

Aucun opérateur ne quitte son poste d'escorte tant que l'abri n'est pas fermé.
` },
  ];

  const STATUS_META = {
    planifiee: { label: 'Planifiée', color: '#9297A8' },
    en_cours: { label: 'En cours', color: '#F0A83C' },
    terminee: { label: 'Terminée', color: '#4FD895' },
    annulee: { label: 'Annulée', color: '#565B6B' },
  };
  const PRIORITY_META = {
    routine: { label: 'Routine', color: '#9297A8' },
    prioritaire: { label: 'Prioritaire', color: '#5AA9FF' },
    critique: { label: 'Critique', color: '#F0525A' },
    omega: { label: 'Oméga', color: '#E0443F' },
  };
  const OUTCOME_META = {
    succes: { label: 'Succès', color: '#4FD895' },
    partiel: { label: 'Succès partiel', color: '#F0A83C' },
    echec: { label: 'Échec', color: '#F0525A' },
  };
  const UNIT_OPTIONS = ['EPSILON-11', 'NU-7', 'BETA-7', 'ALPHA-1', 'XI-8', 'SIGMA-9', 'INTER-UNITÉS'];

  // ---------------------------------------------------------------
  // Outils
  // ---------------------------------------------------------------
  const esc = (s) => window.escapeHtml(s);
  const unitColor = (id) => (UNITS.find((u) => u.id === id) || {}).color || '#9297A8';
  const unitLabel = (id) => (UNITS.find((u) => u.id === id) || {}).name || id;
  const fmtDate = (t) => (t ? new Date(t).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '');
  const pill = (meta) => `<span class="fim-pill" style="--c:${meta.color}">${esc(meta.label)}</span>`;

  function crest(letter) {
    return `<svg class="fim-crest" viewBox="0 0 46 52" aria-hidden="true">
      <path d="M23 1.5 44 9v16.5C44 38 35.5 46.5 23 50.5 10.5 46.5 2 38 2 25.5V9z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.6"/>
      <path d="M23 7 39 12.6v12.9C39 35 32.6 41.6 23 44.8 13.4 41.6 7 35 7 25.5V12.6z" fill="none" stroke="currentColor" stroke-width=".7" opacity=".55"/>
      <text x="23" y="32" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="20" font-weight="700" fill="currentColor">${letter}</text>
    </svg>`;
  }
  function setSide(stats, journal) {
    const grid = document.getElementById('stat-grid');
    if (grid) grid.innerHTML = stats.map(([v, l]) => `<div class="stat-cell"><div class="stat-value">${esc(v)}</div><div class="stat-label">${esc(l)}</div></div>`).join('');
    const panel = document.getElementById('journal-panel');
    if (panel) {
      panel.innerHTML = journal.length
        ? journal.map(([t, x]) => `<div class="journal-entry"><span class="journal-time">${esc(t)}</span><span class="journal-text">${esc(x)}</span></div>`).join('')
        : '<div class="journal-entry"><span class="journal-text">Rien à signaler.</span></div>';
    }
  }
  // Un onglet à sous-navigation (Unités, Savoir, Opérations) rend ses vues
  // dans un conteneur à lui : mainEl() le renvoie tant qu'il est affiché.
  let mainOverride = null;
  function mainEl() {
    if (mainOverride && document.body.contains(mainOverride)) return mainOverride;
    return document.getElementById('terminal-main');
  }
  function subTabs(items, current, attr) {
    return `<div class="fim-subnav">${items.map(([k, l]) => `<button type="button" ${attr}="${k}" class="${k === current ? 'active' : ''}">${l}</button>`).join('')}</div>`;
  }
  // Roster FIM actif + dossiers du personnel (indicatifs, notes).
  let currentDeptId = null;
  let personnel = new Map();
  let personnelCanManage = false;
  const personKey = (name) => String(name || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 80);
  async function loadPersonnel() {
    try {
      const r = await window.apiFetch('/api/rp/fim/personnel');
      personnel = new Map((r.personnel || []).map((p) => [p.key, p]));
      personnelCanManage = !!r.canManage;
    } catch (err) { /* garde la dernière liste */ }
  }
  async function loadRoster() {
    const [dept] = await Promise.all([
      window.apiFetch(`/api/rp/depts/${encodeURIComponent(currentDeptId)}`).catch(() => null),
      loadRoleMembers(),
      loadPersonnel(),
    ]);
    return (dept?.dept?.agents || []).filter((a) => (a.status || 'actif') === 'actif');
  }
  const callsignOf = (name) => personnel.get(personKey(name))?.callsign || '';
  const withCallsign = (name) => (callsignOf(name) ? `${name} « ${callsignOf(name)} »` : name);
  // Rôle d'une personne dans une opération (chef, équipier) ou null.
  function roleIn(op, name) {
    const n = norm(name);
    if (!n) return null;
    if (norm(op.leader) === n) return 'Chef d’opération';
    const m = (op.team || []).find((x) => norm(x.name) === n);
    if (m) return m.role || 'Équipier';
    if (!(op.team || []).length && norm(op.assigned).includes(n)) return 'Affecté';
    return null;
  }
  // Minutes passées en jeu pendant les opérations (relevé de présence).
  function presenceMinutes(op, name) {
    const n = norm(name);
    return Object.values(op.presence || {}).filter((x) => norm(x.name) === n).reduce((a, x) => a + (x.minutes || 0), 0);
  }
  function relTime(t) {
    if (!t) return '';
    const d = t - Date.now();
    const abs = Math.abs(d);
    const txt = abs < 3600000 ? `${Math.max(1, Math.round(abs / 60000))} min` : abs < 86400000 ? `${Math.round(abs / 3600000)} h` : `${Math.round(abs / 86400000)} j`;
    return d >= 0 ? `dans ${txt}` : `il y a ${txt}`;
  }

  // Ouvre un onglet FIM du terminal (après avoir réglé sa vue).
  function goTab(id) {
    document.querySelector(`.terminal-tab[data-tab="${id}"]`)?.click();
  }
  function credit() {
    return `<div class="fim-credit">Contenu d'univers inspiré de la <a href="https://scp-wiki.wikidot.com/" target="_blank" rel="noopener">Fondation SCP</a> (CC BY-SA 3.0), adapté au Site-15.</div>`;
  }
  // Membres des rôles Discord d'unité, par pseudo Roblox : le rôle fait foi
  // pour l'unité et donne l'ID Discord d'un agent du roster.
  let roleMembers = new Map();
  async function loadRoleMembers() {
    try {
      const r = await window.apiFetch('/api/rp/fim/unit-members');
      roleMembers = new Map((r.members || []).filter((m) => m.robloxUsername).map((m) => [norm(m.robloxUsername), m]));
    } catch (err) { /* garde la dernière liste */ }
  }
  const roleMemberOf = (agent) => roleMembers.get(norm(agent.robloxUsername || agent.username)) || null;
  function unitFromAgent(agent) {
    const fromRole = roleMemberOf(agent);
    if (fromRole) return fromRole.unit;
    const hay = `${agent.division || ''} ${agent.rank || ''}`.toUpperCase();
    const unit = UNITS.find((u) => u.match.some((m) => hay.includes(m)));
    return unit ? unit.id : null;
  }

  let refreshTimer = null;
  function stopRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = null;
  }

  // ---------------------------------------------------------------
  // Onglet QG : situation en direct + tableau de bord de l'opérateur
  // ---------------------------------------------------------------
  async function loadHQ(deptId) {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Connexion au réseau tactique…</div>';
    const safe = (pr, fallback) => pr.catch(() => fallback);
    const [ops, debriefs, evalData, docs, agents] = await Promise.all([
      safe(window.apiFetch('/api/rp/fim/operations'), { operations: [] }),
      safe(window.apiFetch('/api/rp/fim/debriefs'), { debriefs: [] }),
      safe(window.apiFetch('/api/rp/fim/evaluations'), { evaluations: [] }),
      safe(window.apiFetch('/api/rp/fim/docs'), { documents: [] }),
      loadRoster(),
    ]);
    if (mainEl() !== main || !main.isConnected) return;
    const operations = ops.operations || [];
    const debriefList = debriefs.debriefs || [];
    const evaluations = evalData.evaluations || [];
    const isCommand = !!evalData.canEvaluate;
    const self = evalData.self || '';
    const canCommand = !!ops.canCommand;
    const me = agents.find((a) => norm(a.name || a.username) === norm(self));
    const myUnit = me ? unitFromAgent(me) : null;
    // Le commandement reçoit toutes les évaluations : on garde les siennes.
    const myEvals = isCommand ? evaluations.filter((e) => norm(e.agentName) === norm(self)) : evaluations;
    const myAvg = avgOf(myEvals.map((e) => e.percent).filter((v) => v != null));
    const activeOps = operations.filter((o) => o.status === 'en_cours' || o.status === 'planifiee')
      .sort((a, b) => (a.status === 'en_cours' ? 0 : 1) - (b.status === 'en_cours' ? 0 : 1) || (a.scheduledAt || Infinity) - (b.scheduledAt || Infinity));
    const myMissions = activeOps.filter((o) => roleIn(o, self));
    const myFile = personnel.get(personKey(self)) || {};
    const myMinutes = operations.reduce((acc, o) => acc + presenceMinutes(o, self), 0);
    const debriefed = new Set(debriefList.map((d) => d.operationId).filter(Boolean));
    const toDebrief = operations.filter((o) => o.status === 'terminee' && !debriefed.has(o.id));
    const neverEvaluated = isCommand ? agents.filter((a) => norm(a.name || a.username) !== norm(self) && !evaluations.some((e) => norm(e.agentName) === norm(a.name || a.username))).length : 0;
    const promos = isCommand ? [...new Set(evaluations.filter((e) => e.recommendation === 'promotion').map((e) => e.agentName))] : [];

    const card = (title, count, inner, foot) => `
      <div class="fim-hq-card">
        <div class="fim-hq-card-head"><h3>${title}</h3>${count != null ? `<span class="count">${count}</span>` : ''}</div>
        <div class="fim-hq-card-body">${inner}</div>
        ${foot ? `<div class="fim-hq-foot">${foot}</div>` : ''}
      </div>`;
    const color = myUnit ? unitColor(myUnit) : 'var(--accent)';
    const myCard = card('Mon dossier', null, `
      <div class="fim-hq-me" style="--u:${color}">
        ${myUnit ? crest((UNITS.find((u) => u.id === myUnit) || {}).letter || '?') : ''}
        <div>
          <div class="fim-hq-me-name">${esc(self || '—')}${myFile.callsign ? ` <span style="color:${color}; font-size:13px;">« ${esc(myFile.callsign)} »</span>` : ''}</div>
          <div class="fim-hq-me-sub">${esc(me?.rank || 'Opérateur')} · ${myUnit ? `<span style="color:${color}">FIM ${esc(unitLabel(myUnit))}</span>` : 'sans unité'}</div>
        </div>
      </div>
      <div class="fim-hq-kpis">
        <div><b style="color:${pctColor(myAvg)}">${fmtPct(myAvg)}</b><span>Moyenne</span></div>
        <div><b>${myEvals.length}</b><span>Évaluations</span></div>
        <div><b>${earnedBrevets(myEvals).length}</b><span>Brevets</span></div>
        <div><b>${operations.filter((o) => roleIn(o, self) || presenceMinutes(o, self) > 0).length}</b><span>Missions</span></div>
        <div><b>${myMinutes ? `${fr(myMinutes / 60, 1)} h` : '—'}</b><span>En opération</span></div>
        <div><b>${(myFile.notes || []).filter((n) => n.kind === 'felicitation').length}</b><span>Félicitations</span></div>
      </div>
      ${medalsRow(myEvals)}`,
      `<button class="btn ghost small" type="button" data-go="fim-evals">${isCommand ? 'Évaluations' : 'Mes évaluations'}</button>`);
    const opRow = (o) => `
        <div class="fim-hq-row" style="--u:${unitColor(o.unit)}">
          <span class="nm">${esc(o.codeName)}</span>
          <span class="meta">${o.scheduledAt && o.status === 'planifiee' ? `${esc(relTime(o.scheduledAt))} · ` : ''}${esc(unitLabel(o.unit))}${roleIn(o, self) ? ` · ${esc(roleIn(o, self))}` : o.zone ? ` · ${esc(o.zone)}` : ''}</span>
          ${pill(STATUS_META[o.status] || STATUS_META.planifiee)}
        </div>`;
    const missionsCard = card('Mes missions', myMissions.length, myMissions.length
      ? myMissions.slice(0, 5).map(opRow).join('')
      : '<div class="empty-row">Aucune mission en cours ou à venir.</div>',
      `<button class="btn ghost small" type="button" data-go="fim-ops" data-ops="miennes">Mes missions</button>`);
    const opsCard = card('Opérations actives', activeOps.length, activeOps.length
      ? activeOps.slice(0, 5).map(opRow).join('')
      : '<div class="empty-row">Aucune opération en cours ou planifiée.</div>',
      `<button class="btn ghost small" type="button" data-go="fim-ops" data-ops="planning">Planning</button><button class="btn ghost small" type="button" data-go="fim-ops" data-ops="actives">Toutes</button>${canCommand ? '<button class="btn small" type="button" data-go="fim-ops" data-ops="nouvelle">+ Nouvel ordre</button>' : ''}`);
    const todo = [];
    if (toDebrief.length) todo.push([`${toDebrief.length} opération(s) terminée(s) sans débriefing`, toDebrief.slice(0, 3).map((o) => o.codeName).join(', '), 'fim-ops', 'debriefs']);
    if (isCommand && neverEvaluated) todo.push([`${neverEvaluated} opérateur(s) jamais évalué(s)`, 'Onglet Évaluations', 'fim-evals', '']);
    if (isCommand && promos.length) todo.push([`${promos.length} opérateur(s) proposé(s) à la promotion`, promos.slice(0, 3).join(', '), 'fim-evals', '']);
    const todoCard = card('À traiter', todo.length, todo.length
      ? todo.map(([t, sub, tab, view]) => `<button class="fim-hq-todo" type="button" data-go="${tab}" data-ops="${view}"><span>${esc(t)}</span><small>${esc(sub)}</small></button>`).join('')
      : '<div class="empty-row">Rien à traiter.</div>');
    const debriefCard = card('Derniers débriefings', debriefList.length, debriefList.length
      ? debriefList.slice(0, 4).map((d) => `
        <div class="fim-hq-row" style="--u:${unitColor(d.unit)}">
          <span class="nm" style="font-family:'Space Grotesk', sans-serif; letter-spacing:0;">${esc(d.title)}</span>
          <span class="meta">${esc(new Date(d.createdAt).toLocaleDateString('fr-FR'))}</span>
          ${pill(OUTCOME_META[d.outcome] || OUTCOME_META.partiel)}
        </div>`).join('')
      : '<div class="empty-row">Aucun débriefing.</div>',
      `<button class="btn ghost small" type="button" data-go="fim-ops" data-ops="debriefs">Tous les débriefings</button>`);
    const notes = (docs.documents || []).slice(0, 4);
    const notesCard = card('Notes du commandement', (docs.documents || []).length, notes.length
      ? notes.map((d) => `<button class="fim-hq-todo" type="button" data-go="fim-library" data-doc="${esc(d.id)}"><span>${esc(d.title)}</span><small>${esc(d.authorCharacterName || '')} · ${esc(new Date(d.createdAt).toLocaleDateString('fr-FR'))}</small></button>`).join('')
      : '<div class="empty-row">Aucune note publiée.</div>',
      `<button class="btn ghost small" type="button" data-go="fim-library">Doctrine et fiches SCP</button>`);

    main.innerHTML = `
      <div id="fim-hq">
        <div id="fim-live"><div class="center-msg">Connexion au réseau tactique…</div></div>
        <div class="fim-hq-grid">${myCard}${missionsCard}${opsCard}${todoCard}${debriefCard}${notesCard}</div>
        <div id="fim-live-servers"></div>
      </div>`;
    main.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.ops) opsFilter = b.dataset.ops;
      if (b.dataset.doc) { libView = 'doctrine'; docSelected = b.dataset.doc; }
      goTab(b.dataset.go);
    }));
    await refreshLive(false);
    if (!refreshTimer) refreshTimer = setInterval(() => refreshLive(true), 30000);
  }

  // Bandeau en direct du QG : code, brèches, unités déployées, serveurs.
  async function refreshLive(silent) {
    if (!document.getElementById('fim-live')) return stopRefresh();
    let data;
    try {
      data = await window.apiFetch('/api/rp/fim/situation');
    } catch (err) {
      const box = document.getElementById('fim-live');
      if (box && !silent) box.innerHTML = `<div class="center-msg">Réseau tactique injoignable : ${esc(err.message)}</div>`;
      return;
    }
    const box = document.getElementById('fim-live');
    if (!box) return stopRefresh();
    const servers = data.servers || [];
    const totals = {};
    let breaches = 0;
    servers.forEach((s) => {
      breaches += s.breaches.length;
      Object.entries(s.deployed).forEach(([u, names]) => { totals[u] = (totals[u] || 0) + names.length; });
    });
    const worst = servers.reduce((acc, s) => (CODE_ORDER.indexOf(s.alertCode) > CODE_ORDER.indexOf(acc) ? s.alertCode : acc), 'VERT');
    const deployedCount = Object.values(totals).reduce((a, b) => a + b, 0);
    setSide(
      [[String(servers.length), 'Serveurs'], [String(deployedCount), 'FIM en jeu']],
      servers.flatMap((s) => s.breaches.map((b) => [s.alertCode || '—', `Brèche ${b}`])).slice(0, 5)
    );
    const worstMeta = CODES[worst] || CODES.VERT;
    box.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">QG FIM · réseau tactique actualisé toutes les 30 s</div>
        <h2>Situation du Site-15</h2>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <span class="fim-code" style="--c:${worstMeta.color}"><i></i>CODE ${esc(worst)}</span>
          <span class="fim-chip">${breaches} brèche${breaches > 1 ? 's' : ''}</span>
          <span class="fim-chip">${servers.length} serveur${servers.length > 1 ? 's' : ''} · ${servers.reduce((a, s) => a + s.players, 0)} joueurs</span>
          <span class="fim-chip">${deployedCount} FIM en jeu</span>
          <button class="btn ghost small fim-alert-btn" id="fim-alert-btn" type="button" style="margin-left:auto;"></button>
        </div>
        <div class="fim-posture" style="--c:${worstMeta.color}">${worstMeta.posture}</div>
        <div class="fim-hq-units">${UNITS.map((u) => `<span class="fim-chip u${totals[u.id] ? '' : ' off'}" style="--u:${u.color}">${esc(u.name)} · ${totals[u.id] ? `${totals[u.id]} en service` : 'réserve'}</span>`).join('')}</div>
      </div>`;
    const alertBtn = document.getElementById('fim-alert-btn');
    renderAlertButton(alertBtn);
    alertBtn.addEventListener('click', () => toggleAlerts(alertBtn));
    const srv = document.getElementById('fim-live-servers');
    if (srv) {
      srv.innerHTML = `
        <div class="record-block" style="margin-top:24px;">
          <div class="record-block-head"><h2>Serveurs en ligne</h2><span class="count">${servers.length}</span></div>
          ${servers.length ? servers.map(serverCard).join('') : '<div class="empty-row">Aucun serveur de jeu en ligne. Le réseau tactique reprendra dès qu\'un serveur ouvrira.</div>'}
        </div>`;
    }
  }

  function serverCard(s) {
    const meta = CODES[s.alertCode] || { color: '#9297A8', desc: 'Code inconnu.' };
    const deployed = Object.entries(s.deployed);
    const raid = s.raid && s.raid.stage ? s.raid : null;
    return `
      <div class="fim-server">
        <div class="fim-server-head">
          <span class="fim-code" style="--c:${meta.color}"><i></i>CODE ${esc(s.alertCode || '—')}</span>
          <span class="fim-server-id">SRV ${esc(s.jobId)} · ${s.players}/${s.maxPlayers || '?'} joueurs</span>
        </div>
        <div class="fim-sit-grid">
          <div class="fim-sit-cell${s.breaches.length ? ' bad' : ''}"><h4>Brèches</h4>${s.breaches.length ? s.breaches.map((b) => `<span class="fim-chip" style="color:var(--bad)">${esc(/^\d/.test(b) ? `SCP-${b}` : b)}</span>`).join(' ') : '<span class="fim-chip">Aucune</span>'}</div>
          <div class="fim-sit-cell${s.protocols.length ? ' warn' : ''}"><h4>Protocoles</h4>${s.protocols.length ? s.protocols.map((p) => `<span class="fim-chip">${esc(p)}</span>`).join(' ') : '<span class="fim-chip">Aucun</span>'}</div>
          <div class="fim-sit-cell"><h4>FIM déployées</h4>${deployed.length ? deployed.map(([u, names]) => `<div style="margin-bottom:4px;"><span class="fim-chip u" style="--u:${unitColor(u)}">${esc(unitLabel(u))} · ${names.length}</span> <span style="font-size:11.5px; color:var(--ink-dim)">${names.map(esc).join(', ')}</span></div>`).join('') : '<span class="fim-chip">Aucune</span>'}</div>
          <div class="fim-sit-cell${s.nuke || raid ? ' bad' : s.radioJam ? ' warn' : ''}"><h4>Menaces</h4>
            ${s.nuke ? '<span class="fim-chip" style="color:var(--bad)">☢ OGIVE ARMÉE</span> ' : ''}
            ${raid ? `<span class="fim-chip" style="color:var(--bad)">RAID IC · ${esc(raid.stage)}${raid.target ? ` · ${esc(raid.target)}` : ''}</span> ` : ''}
            ${s.radioJam ? `<span class="fim-chip" style="color:var(--warn)">Brouillage radio ${s.radioJam}/3</span> ` : ''}
            ${s.detained ? `<span class="fim-chip">${s.detained} en détention</span>` : ''}
            ${!s.nuke && !raid && !s.radioJam && !s.detained ? '<span class="fim-chip">R.A.S.</span>' : ''}
          </div>
        </div>
        <div style="margin-top:10px; font-size:12px; color:var(--ink-faint);">${esc(meta.desc)}</div>
      </div>`;
  }

  // ---------------------------------------------------------------
  // Onglet Unités
  // ---------------------------------------------------------------
  let selectedUnit = 'EPSILON-11';
  let unitsView = 'bataille';
  function loadUnits(deptId) {
    const root = document.getElementById('terminal-main');
    mainOverride = null;
    root.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Commandement FIM · ordre de bataille</div>
        <h2>Forces d'Intervention Mobiles du Site-15</h2>
        <p>${UNITS.length} unités, chacune avec sa spécialité, son indicatif et ses règles. L'unité d'un opérateur vient de son rôle d'unité sur le Discord FIM (à défaut, de sa division dans le roster).</p>
      </div>
      ${subTabs([['bataille', 'Ordre de bataille'], ['effectifs', 'Effectifs et dossiers'], ['activite', 'Activité']], unitsView, 'data-uv')}
      <div id="fim-units-body"></div>`;
    root.querySelectorAll('[data-uv]').forEach((b) => b.addEventListener('click', () => {
      unitsView = b.dataset.uv;
      loadUnits(deptId);
    }));
    mainOverride = document.getElementById('fim-units-body');
    if (unitsView === 'effectifs') loadStaff();
    else if (unitsView === 'activite') loadActivity();
    else loadBattleOrder(deptId);
  }

  async function loadBattleOrder(deptId) {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let agents = [];
    try {
      const [data] = await Promise.all([window.apiFetch(`/api/rp/depts/${encodeURIComponent(deptId)}`), loadRoleMembers()]);
      agents = (data.dept?.agents || []).filter((a) => (a.status || 'actif') === 'actif');
    } catch (err) {
      agents = [];
    }
    const byUnit = {};
    agents.forEach((a) => {
      const u = unitFromAgent(a);
      if (u) (byUnit[u] = byUnit[u] || []).push(a);
    });
    const unassigned = agents.filter((a) => !unitFromAgent(a)).length;
    setSide([[String(agents.length), 'Opérateurs'], [String(UNITS.length), 'Unités']], UNITS.map((u) => [u.callsign, `${u.name} · ${(byUnit[u.id] || []).length} opérateur(s)`]));

    const render = () => {
      const u = UNITS.find((x) => x.id === selectedUnit) || UNITS[1];
      const roster = byUnit[u.id] || [];
      main.innerHTML = `
        <div class="fim-grid">
          ${UNITS.map((x) => `
            <button class="fim-unit-card${x.id === u.id ? ' active' : ''}" style="--u:${x.color}" data-unit="${x.id}" type="button">
              <div class="fim-unit-top">${crest(x.letter)}<div><div class="fim-unit-code">${esc(x.name)}</div><div class="fim-unit-nick">${esc(x.nick)}</div></div></div>
              <div class="fim-unit-role">${esc(x.role)}</div>
              <div class="fim-unit-foot"><span>${(byUnit[x.id] || []).length} opérateur(s)</span><span>${esc(x.callsign)}</span></div>
            </button>`).join('')}
        </div>
        <div class="fim-dossier" style="--u:${u.color}">
          <div class="fim-dossier-head" style="color:${u.color}">
            ${crest(u.letter)}
            <div style="color:var(--ink)"><h3>FIM ${esc(u.name)} <span style="color:${u.color}">${esc(u.nick)}</span></h3>${u.motto ? `<div class="fim-motto">« ${esc(u.motto)} »</div>` : ''}</div>
          </div>
          <div class="fim-facts">${Object.entries(u.facts).map(([k, v]) => `<div class="fim-fact"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div>
          <div class="sci-body-rendered">${window.renderMarkdown(u.body)}</div>
          <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 4px;">Opérateurs affectés</h3>
          ${roster.length
            ? `<div class="fim-roster">${roster.map((a) => `<span class="fim-chip u">${esc(a.rank ? `${a.rank} · ` : '')}${esc(a.name || a.username)}</span>`).join('')}</div>`
            : `<div style="font-size:12.5px; color:var(--ink-faint);">Aucun opérateur rattaché à cette unité dans le roster${unassigned ? ` (${unassigned} opérateur(s) sans unité renseignée : il leur faut le rôle d'unité sur le Discord FIM, ou une division qui contient le nom de l'unité, ex. « E-11 »)` : ''}.</div>`}
        </div>
        ${credit()}
      `;
      main.querySelectorAll('[data-unit]').forEach((b) => b.addEventListener('click', () => {
        selectedUnit = b.dataset.unit;
        render();
        main.querySelector('.fim-dossier')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
    };
    render();
  }

  // Effectifs : tous les opérateurs actifs, rangés par unité, avec leur dossier.
  let staffSearch = '';
  let staffSelected = null;
  const NOTE_META = {
    felicitation: { label: 'Félicitation', color: '#4FD895' },
    avertissement: { label: 'Avertissement', color: '#F0525A' },
    observation: { label: 'Observation', color: '#5AA9FF' },
  };
  async function loadStaff() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let agents = [];
    let evalData = { evaluations: [] };
    let ops = [];
    try {
      const [roster, ev, o] = await Promise.all([
        loadRoster(),
        window.apiFetch('/api/rp/fim/evaluations').catch(() => evalData),
        window.apiFetch('/api/rp/fim/operations').catch(() => ({ operations: [] })),
      ]);
      agents = roster;
      evalData = ev;
      ops = o.operations || [];
    } catch (err) {
      main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    if (mainEl() !== main) return;
    const isCommand = !!evalData.canEvaluate;
    const self = evalData.self || '';
    const evaluations = evalData.evaluations || [];
    const people = agents.map((a) => {
      const member = roleMemberOf(a);
      const name = a.name || a.username;
      const evals = evaluations.filter((e) => (member?.discordId && e.agentDiscordId === member.discordId) || norm(e.agentName) === norm(name));
      const missions = ops.filter((o) => roleIn(o, name) || presenceMinutes(o, name) > 0);
      const minutes = ops.reduce((acc, o) => acc + presenceMinutes(o, name), 0);
      return { name, rank: a.rank || '', unit: unitFromAgent(a), viaRole: !!member, discordName: member?.discordName || '', evals, missions, minutes, file: personnel.get(personKey(name)) || {} };
    });
    const groups = [...UNITS.map((u) => ({ id: u.id, label: `FIM ${u.name}${u.nick ? ` ${u.nick}` : ''}`, color: u.color })), { id: null, label: 'Sans unité', color: '#9297A8' }];
    setSide(
      [[String(people.length), 'Opérateurs'], [String(people.filter((p) => !p.unit).length), 'Sans unité']],
      UNITS.map((u) => [u.callsign, `${u.name} · ${people.filter((p) => p.unit === u.id).length}`])
    );

    main.innerHTML = `
      <div id="fim-staff-dossier"></div>
      <input type="text" id="fim-staff-search" class="fim-search" placeholder="Rechercher un opérateur, un indicatif, un grade, une unité…" value="${esc(staffSearch)}">
      <div class="fim-staff-wrap"><table class="fim-staff"><thead><tr>
        <th>Opérateur</th><th>Indicatif</th><th>Grade</th><th>Brevets</th><th>Missions</th>${isCommand ? '<th>Moyenne</th>' : ''}<th>Unité</th>
      </tr></thead><tbody id="fim-staff-body"></tbody></table></div>
      <div style="margin-top:10px; font-size:11.5px; color:var(--ink-faint);">Clique sur un opérateur pour ouvrir son dossier. « Rôle Discord » : unité lue sur le rôle d'unité du Discord FIM (compte Roblox lié), sinon sur la division du roster.</div>`;

    const renderDossier = () => {
      const box = document.getElementById('fim-staff-dossier');
      const p = people.find((x) => norm(x.name) === norm(staffSelected));
      if (!p) { box.innerHTML = ''; return; }
      const isSelf = norm(p.name) === norm(self);
      const color = p.unit ? unitColor(p.unit) : '#6E76FF';
      const avg = avgOf(p.evals.map((e) => e.percent).filter((v) => v != null));
      const notes = [...(p.file.notes || [])].sort((a, b) => b.at - a.at);
      const canSeeNotes = isCommand || isSelf;
      const missions = [...p.missions].sort((a, b) => (b.scheduledAt || b.createdAt || 0) - (a.scheduledAt || a.createdAt || 0));
      box.innerHTML = `
        <div class="fim-dossier" style="--u:${color}; margin:0 0 18px;">
          <div class="fim-dossier-head" style="color:${color}">
            ${p.unit ? crest((UNITS.find((u) => u.id === p.unit) || {}).letter || '?') : ''}
            <div style="color:var(--ink); flex:1;">
              <h3>${esc(p.name)}${p.file.callsign ? ` <span style="color:${color}">« ${esc(p.file.callsign)} »</span>` : ''}</h3>
              <div class="fim-motto">${esc(p.rank || 'Opérateur')} · ${p.unit ? `FIM ${esc(unitLabel(p.unit))}` : 'sans unité'}${p.discordName ? ` · ${esc(p.discordName)}` : ''}</div>
            </div>
            <button class="btn ghost small" type="button" id="fim-dossier-close">Fermer</button>
          </div>
          <div class="fim-facts">
            <div class="fim-fact"><b>Missions</b><span>${p.missions.length}</span></div>
            <div class="fim-fact"><b>Temps en opération</b><span>${p.minutes ? `${fr(p.minutes / 60, 1)} h` : '—'}</span></div>
            <div class="fim-fact"><b>Brevets</b><span>${earnedBrevets(p.evals).length}</span></div>
            ${isCommand || isSelf ? `<div class="fim-fact"><b>Moyenne</b><span style="color:${pctColor(avg)}">${fmtPct(avg)} · ${p.evals.length} éval.</span></div>` : ''}
            ${canSeeNotes ? `<div class="fim-fact"><b>Félicitations / avert.</b><span>${notes.filter((n) => n.kind === 'felicitation').length} / ${notes.filter((n) => n.kind === 'avertissement').length}</span></div>` : ''}
          </div>
          ${medalsRow(p.evals)}
          ${isCommand ? `
            <div class="fim-editor-section">Indicatif radio</div>
            <form id="fim-callsign-form" style="display:flex; gap:8px; max-width:420px;">
              <input type="text" id="fim-callsign" maxlength="24" placeholder="Ex : VALKYRIE-1" value="${esc(p.file.callsign || '')}" style="flex:1;">
              <button class="btn small" type="submit">Enregistrer</button>
            </form>` : ''}
          <div class="fim-editor-section">Missions</div>
          ${missions.length ? missions.slice(0, 12).map((o) => `
            <div class="fim-hq-row" style="--u:${unitColor(o.unit)}; margin-bottom:6px;">
              <span class="nm">${esc(o.codeName)}</span>
              <span class="meta">${esc(roleIn(o, p.name) || 'Présent en jeu')}${presenceMinutes(o, p.name) ? ` · ${fr(presenceMinutes(o, p.name), 0)} min en jeu` : ''} · ${esc(new Date(o.scheduledAt || o.createdAt).toLocaleDateString('fr-FR'))}</span>
              ${pill(STATUS_META[o.status] || STATUS_META.planifiee)}
            </div>`).join('') : '<div class="empty-row" style="padding:12px;">Aucune mission enregistrée.</div>'}
          ${canSeeNotes ? `
            <div class="fim-editor-section">Notes du commandement</div>
            ${notes.length ? notes.map((n) => `
              <div class="fim-note" style="--c:${(NOTE_META[n.kind] || NOTE_META.observation).color}">
                <div class="fim-note-head">${pill(NOTE_META[n.kind] || NOTE_META.observation)}<span>${esc(n.by)} · ${fmtDate(n.at)}</span>${isCommand ? `<button type="button" class="fim-x" data-note-del="${esc(n.id)}" title="Retirer">×</button>` : ''}</div>
                <div class="fim-note-text">${esc(n.text)}</div>
              </div>`).join('') : '<div class="empty-row" style="padding:12px;">Aucune note au dossier.</div>'}
            ${isCommand && !isSelf ? `
              <form id="fim-note-form" style="margin-top:10px;">
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <select id="fim-note-kind" style="width:auto;">${Object.entries(NOTE_META).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}</select>
                  <input type="text" id="fim-note-text" maxlength="1000" placeholder="Motif, contexte, opération concernée…" style="flex:1; min-width:220px;">
                  <button class="btn small" type="submit">Ajouter au dossier</button>
                </div>
              </form>` : ''}` : ''}
        </div>`;
      document.getElementById('fim-dossier-close').addEventListener('click', () => { staffSelected = null; renderDossier(); render(); });
      document.getElementById('fim-callsign-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await window.apiFetch('/api/rp/fim/personnel/callsign', { method: 'PATCH', body: JSON.stringify({ name: p.name, callsign: document.getElementById('fim-callsign').value.trim() }) });
          window.showToast('Indicatif enregistré.', 'success');
          loadStaff();
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      });
      document.getElementById('fim-note-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = document.getElementById('fim-note-text').value.trim();
        if (!text) return;
        try {
          await window.apiFetch('/api/rp/fim/personnel/notes', { method: 'POST', body: JSON.stringify({ name: p.name, kind: document.getElementById('fim-note-kind').value, text }) });
          window.showToast('Note ajoutée au dossier.', 'success');
          loadStaff();
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      });
      box.querySelectorAll('[data-note-del]').forEach((b) => b.addEventListener('click', async () => {
        if (!confirm('Retirer cette note du dossier ?')) return;
        try {
          await window.apiFetch(`/api/rp/fim/personnel/notes/${encodeURIComponent(b.dataset.noteDel)}?name=${encodeURIComponent(p.name)}`, { method: 'DELETE' });
          loadStaff();
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      }));
    };

    const render = () => {
      const q = norm(staffSearch);
      const shown = q ? people.filter((p) => [p.name, p.rank, p.discordName, p.file.callsign, p.unit && unitLabel(p.unit)].some((x) => norm(x).includes(q))) : people;
      const cols = isCommand ? 7 : 6;
      document.getElementById('fim-staff-body').innerHTML = groups.map((g) => {
        const rows = shown.filter((p) => p.unit === g.id).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        if (!rows.length) return '';
        return `<tr class="unit-row" style="--u:${g.color}"><td colspan="${cols}">${esc(g.label.toUpperCase())} · ${rows.length}</td></tr>` + rows.map((p) => {
          const avg = avgOf(p.evals.map((e) => e.percent).filter((v) => v != null));
          const brevets = earnedBrevets(p.evals);
          brevets.forEach((e) => diplomaRegistry.set(e.id, e));
          return `<tr class="clickable${norm(p.name) === norm(staffSelected) ? ' sel' : ''}" data-person="${esc(p.name)}">
            <td><b>${esc(p.name)}</b>${p.discordName ? `<div style="font-size:11px; color:var(--ink-faint);">${esc(p.discordName)}</div>` : ''}</td>
            <td style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">${esc(p.file.callsign || '—')}</td>
            <td>${esc(p.rank || '—')}</td>
            <td>${brevets.length ? brevets.map((e) => `<button type="button" class="em" data-diploma="${esc(e.id)}" title="${esc(certOf(e).title)}" style="background:none; cursor:pointer;">${emblemSvg(certOf(e).emblem)}</button>`).join('') : '<span style="color:var(--ink-faint);">—</span>'}</td>
            <td style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">${p.missions.length}${p.minutes ? ` · ${fr(p.minutes / 60, 1)} h` : ''}</td>
            ${isCommand ? `<td style="font-family:'JetBrains Mono', monospace; color:${pctColor(avg)}">${fmtPct(avg)}${trendBadge(p.evals)}</td>` : ''}
            <td>${p.unit ? `<span class="fim-chip u" style="--u:${unitColor(p.unit)}">${esc(unitLabel(p.unit))}</span>${p.viaRole ? ' <span style="font-size:10.5px; color:var(--ink-faint);">rôle Discord</span>' : ''}` : '<span style="color:var(--ink-faint);">—</span>'}</td>
          </tr>`;
        }).join('');
      }).join('') || `<tr><td colspan="${cols}" class="empty-row">Aucun opérateur.</td></tr>`;
      document.querySelectorAll('#fim-staff-body [data-person]').forEach((tr) => tr.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-diploma]')) return;
        staffSelected = tr.dataset.person;
        render();
        renderDossier();
        document.getElementById('fim-staff-dossier').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
    };
    document.getElementById('fim-staff-search').addEventListener('input', (e) => { staffSearch = e.target.value; render(); });
    render();
    renderDossier();
  }

  // Activité : bilan des opérations par unité et par opérateur.
  let activityPeriod = 30;
  async function loadActivity() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let ops = [];
    let debriefs = [];
    try {
      const [o, d] = await Promise.all([
        window.apiFetch('/api/rp/fim/operations'),
        window.apiFetch('/api/rp/fim/debriefs').catch(() => ({ debriefs: [] })),
        loadRoster(),
      ]);
      ops = o.operations || [];
      debriefs = d.debriefs || [];
    } catch (err) {
      main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    if (mainEl() !== main) return;
    const since = activityPeriod ? Date.now() - activityPeriod * 86400000 : 0;
    const inPeriod = (t) => (t || 0) >= since;
    const pOps = ops.filter((o) => inPeriod(o.scheduledAt || o.createdAt));
    const pDebriefs = debriefs.filter((d) => inPeriod(d.createdAt));
    const rate = (list) => (list.length ? Math.round((list.filter((d) => d.outcome === 'succes').length / list.length) * 100) : null);
    const minutesByUnit = {};
    const byPerson = new Map();
    pOps.forEach((o) => {
      Object.values(o.presence || {}).forEach((x) => {
        if (x.unit) minutesByUnit[x.unit] = (minutesByUnit[x.unit] || 0) + (x.minutes || 0);
        const k = norm(x.name);
        const p = byPerson.get(k) || { name: x.name, unit: x.unit, minutes: 0, ops: new Set(), led: 0 };
        p.minutes += x.minutes || 0;
        p.ops.add(o.id);
        byPerson.set(k, p);
      });
      [o.leader, ...(o.team || []).map((m) => m.name)].filter(Boolean).forEach((n, i) => {
        const k = norm(n);
        const p = byPerson.get(k) || { name: n, unit: null, minutes: 0, ops: new Set(), led: 0 };
        p.ops.add(o.id);
        if (i === 0 && norm(o.leader) === k) p.led += 1;
        byPerson.set(k, p);
      });
    });
    const top = [...byPerson.values()].sort((a, b) => b.minutes - a.minutes || b.ops.size - a.ops.size).slice(0, 12);
    const totalMin = Object.values(minutesByUnit).reduce((a, b) => a + b, 0);
    const sr = rate(pDebriefs);
    setSide([[String(pOps.length), 'Opérations'], [sr == null ? '—' : `${sr}%`, 'Succès']], top.slice(0, 5).map((p) => [`${fr(p.minutes / 60, 1)} h`, p.name]));

    main.innerHTML = `
      ${subTabs([['7', '7 jours'], ['30', '30 jours'], ['90', '90 jours'], ['0', 'Depuis le début']], String(activityPeriod), 'data-period')}
      <div class="fim-hq-kpis" style="grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); margin-bottom:18px;">
        <div><b>${pOps.length}</b><span>Opérations</span></div>
        <div><b>${pOps.filter((o) => o.status === 'terminee').length}</b><span>Terminées</span></div>
        <div><b style="color:${sr == null ? 'var(--ink-faint)' : pctColor(sr)}">${sr == null ? '—' : `${sr} %`}</b><span>Succès (débriefings)</span></div>
        <div><b>${fr(totalMin / 60, 1)} h</b><span>Temps en opération</span></div>
        <div><b>${byPerson.size}</b><span>Opérateurs engagés</span></div>
      </div>
      <div class="fim-grid">
        ${UNITS.map((u) => {
          const uo = pOps.filter((o) => o.unit === u.id);
          const ud = pDebriefs.filter((d) => d.unit === u.id);
          const r = rate(ud);
          return `<div class="fim-unit-card" style="--u:${u.color}; cursor:default;">
            <div class="fim-unit-top">${crest(u.letter)}<div><div class="fim-unit-code">${esc(u.name)}</div><div class="fim-unit-nick">${esc(u.nick)}</div></div></div>
            <div class="fim-hq-kpis">
              <div><b>${uo.length}</b><span>Opérations</span></div>
              <div><b style="color:${r == null ? 'var(--ink-faint)' : pctColor(r)}">${r == null ? '—' : `${r}%`}</b><span>Succès</span></div>
              <div><b>${fr((minutesByUnit[u.id] || 0) / 60, 1)} h</b><span>En jeu</span></div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="record-block" style="margin-top:24px;">
        <div class="record-block-head"><h2>Opérateurs les plus engagés</h2><span class="count">${top.length}</span></div>
        ${top.length ? `<div class="fim-staff-wrap"><table class="fim-staff"><thead><tr><th>#</th><th>Opérateur</th><th>Temps en jeu</th><th>Opérations</th><th>Commandées</th></tr></thead><tbody>
          ${top.map((p, i) => `<tr>
            <td style="font-family:'JetBrains Mono', monospace; color:var(--ink-faint);">${i + 1}</td>
            <td><b>${esc(withCallsign(p.name))}</b>${p.unit ? ` <span class="fim-chip u" style="--u:${unitColor(p.unit)}">${esc(unitLabel(p.unit))}</span>` : ''}</td>
            <td style="font-family:'JetBrains Mono', monospace;">${p.minutes ? `${fr(p.minutes / 60, 1)} h` : '—'}</td>
            <td style="font-family:'JetBrains Mono', monospace;">${p.ops.size}</td>
            <td style="font-family:'JetBrains Mono', monospace;">${p.led || '—'}</td>
          </tr>`).join('')}
        </tbody></table></div>` : '<div class="empty-row">Aucune activité sur cette période.</div>'}
      </div>`;
    main.querySelectorAll('[data-period]').forEach((b) => b.addEventListener('click', () => { activityPeriod = +b.dataset.period; loadActivity(); }));
  }

  // ---------------------------------------------------------------
  // Onglet Opérations
  // ---------------------------------------------------------------
  let opsFilter = 'actives';
  let opsSearch = '';
  let editingOp = null;
  const openJournals = new Set();
  const JOURNAL_META = {
    info: { label: 'Info', color: '#9297A8' },
    contact: { label: 'Contact', color: '#F0525A' },
    objectif: { label: 'Objectif', color: '#4FD895' },
    perte: { label: 'Perte', color: '#E0443F' },
    renfort: { label: 'Renfort', color: '#5AA9FF' },
    repli: { label: 'Repli', color: '#F0A83C' },
  };
  async function loadOperations() {
    const root = document.getElementById('terminal-main');
    mainOverride = null;
    root.innerHTML = '<div class="center-msg">Chargement…</div>';
    let ops = [];
    let debriefs = [];
    let canCommand = false;
    let agents = [];
    let self = '';
    try {
      const [o, d, roster, ev] = await Promise.all([
        window.apiFetch('/api/rp/fim/operations'),
        window.apiFetch('/api/rp/fim/debriefs').catch(() => ({ debriefs: [] })),
        loadRoster(),
        window.apiFetch('/api/rp/fim/evaluations').catch(() => ({})),
      ]);
      ops = o.operations || [];
      debriefs = d.debriefs || [];
      canCommand = !!o.canCommand;
      agents = roster;
      self = ev.self || '';
    } catch (err) {
      root.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    if (!canCommand && opsFilter === 'nouvelle') opsFilter = 'actives';
    const filters = {
      actives: (o) => o.status === 'en_cours' || o.status === 'planifiee',
      miennes: (o) => !!roleIn(o, self),
      archives: (o) => o.status === 'terminee' || o.status === 'annulee',
    };
    const debriefOf = new Map(debriefs.filter((d) => d.operationId).map((d) => [d.operationId, d]));
    const pendingDebriefs = ops.filter((o) => o.status === 'terminee' && !debriefOf.has(o.id)).length;
    const tabs = [
      ['actives', `Actives (${ops.filter(filters.actives).length})`],
      ['planning', 'Planning'],
      ['miennes', `Mes missions (${ops.filter(filters.miennes).length})`],
      ['archives', `Archives (${ops.filter(filters.archives).length})`],
      ['debriefs', `Débriefings (${debriefs.length})${pendingDebriefs ? ` · ${pendingDebriefs} à rédiger` : ''}`],
    ];
    if (canCommand) tabs.push(['nouvelle', editingOp ? 'Modifier l’ordre' : '+ Nouvel ordre']);

    root.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Commandement FIM · ordres de mission et rapports après action</div>
        <h2>Opérations</h2>
        <p>Le commandement émet les ordres : chef d'opération, équipe, heure, point de ralliement et règles d'engagement. Pendant l'opération, chaque opérateur alimente le journal de bord. Une fois clôturée, elle se termine par un débriefing.</p>
      </div>
      ${subTabs(tabs, opsFilter, 'data-f')}
      <div id="fim-ops-body"></div>
    `;
    root.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.f !== 'nouvelle') editingOp = null;
      opsFilter = b.dataset.f;
      loadOperations();
    }));

    const body = document.getElementById('fim-ops-body');
    if (opsFilter === 'debriefs') {
      renderDebriefs(body, debriefs, ops);
      return;
    }
    setSide(
      [[String(ops.filter((o) => o.status === 'en_cours').length), 'En cours'], [String(ops.filter((o) => o.status === 'planifiee').length), 'Planifiées']],
      ops.filter(filters.actives).slice(0, 5).map((o) => [STATUS_META[o.status]?.label || o.status, `${o.codeName} · ${unitLabel(o.unit)}`])
    );
    if (opsFilter === 'nouvelle') {
      const op = editingOp ? ops.find((o) => o.id === editingOp) : null;
      body.innerHTML = opForm(op, agents);
      bindOpForm(op, agents);
      return;
    }
    const ctx = { canCommand, self, debriefOf };
    if (opsFilter === 'planning') {
      renderPlanning(body, ops, ctx);
      return;
    }
    const base = ops.filter(filters[opsFilter] || filters.actives)
      .sort((a, b) => (a.status === 'en_cours' ? 0 : 1) - (b.status === 'en_cours' ? 0 : 1) || (b.createdAt || 0) - (a.createdAt || 0));
    const renderList = () => {
      const q = norm(opsSearch);
      const list = q ? base.filter((o) => [o.codeName, unitLabel(o.unit), o.zone, o.target, o.assigned, o.leader, o.rallyPoint, o.authorCharacterName].some((x) => norm(x).includes(q))) : base;
      document.getElementById('fim-ops-list').innerHTML = list.length
        ? list.map((o) => opCard(o, ctx)).join('')
        : `<div class="empty-row">${opsFilter === 'miennes' ? 'Tu n’es affecté à aucune opération.' : 'Aucune opération dans cette liste.'}</div>`;
      bindOpCards(document.getElementById('fim-ops-list'));
    };
    body.innerHTML = `
      <input type="text" id="fim-ops-search" class="fim-search" placeholder="Rechercher : nom de code, unité, chef, zone, cible, opérateur…" value="${esc(opsSearch)}">
      <div id="fim-ops-list"></div>`;
    document.getElementById('fim-ops-search').addEventListener('input', (e) => { opsSearch = e.target.value; renderList(); });
    renderList();
  }

  // Planning : opérations en cours, puis planifiées jour par jour.
  function renderPlanning(body, ops, ctx) {
    const live = ops.filter((o) => o.status === 'en_cours');
    const planned = ops.filter((o) => o.status === 'planifiee');
    const dated = planned.filter((o) => o.scheduledAt).sort((a, b) => a.scheduledAt - b.scheduledAt);
    const undated = planned.filter((o) => !o.scheduledAt);
    const dayKey = (t) => new Date(t).toDateString();
    const today = dayKey(Date.now());
    const tomorrow = dayKey(Date.now() + 86400000);
    const days = [];
    dated.forEach((o) => {
      const k = dayKey(o.scheduledAt);
      let g = days.find((d) => d.k === k);
      if (!g) days.push((g = { k, t: o.scheduledAt, ops: [] }));
      g.ops.push(o);
    });
    const dayLabel = (g) => (g.k === today ? 'Aujourd’hui' : g.k === tomorrow ? 'Demain' : new Date(g.t).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }));
    const row = (o) => `
      <div class="fim-plan-row" style="--u:${unitColor(o.unit)}">
        <span class="time">${o.scheduledAt ? new Date(o.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
        <span class="nm">${esc(o.codeName)}</span>
        <span class="meta">${esc(unitLabel(o.unit))}${o.leader ? ` · chef ${esc(withCallsign(o.leader))}` : ''}${o.rallyPoint ? ` · ralliement ${esc(o.rallyPoint)}` : ''} · ${(o.team || []).length || '?'} op.</span>
        ${roleIn(o, ctx.self) ? `<span class="fim-pill" style="--c:#4FD895">${esc(roleIn(o, ctx.self))}</span>` : ''}
        ${pill(PRIORITY_META[o.priority] || PRIORITY_META.routine)}
      </div>`;
    body.innerHTML = `
      ${live.length ? `<div class="fim-plan-day"><h3 style="color:var(--warn)">● En cours</h3>${live.map(row).join('')}</div>` : ''}
      ${days.map((g) => `<div class="fim-plan-day"><h3>${esc(dayLabel(g))}</h3>${g.ops.map(row).join('')}</div>`).join('')}
      ${undated.length ? `<div class="fim-plan-day"><h3>Sans horaire</h3>${undated.map(row).join('')}</div>` : ''}
      ${!live.length && !planned.length ? '<div class="empty-row">Aucune opération planifiée.</div>' : ''}`;
  }

  function bindOpCards(box) {
    box.querySelectorAll('[data-op-status]').forEach((b) => b.addEventListener('click', async () => {
      const next = b.dataset.opStatus;
      const note = next === 'annulee' || next === 'terminee' ? prompt('Note (facultative) :') || '' : '';
      try {
        await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(b.dataset.id)}/status`, { method: 'POST', body: JSON.stringify({ status: next, note }) });
        window.showToast(`Opération ${STATUS_META[next].label.toLowerCase()}.`, 'success');
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
    box.querySelectorAll('[data-op-delete]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Supprimer définitivement cet ordre de mission ?')) return;
      try {
        await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(b.dataset.id)}`, { method: 'DELETE' });
        window.showToast('Ordre supprimé.', 'success');
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
    box.querySelectorAll('[data-op-edit]').forEach((b) => b.addEventListener('click', () => {
      editingOp = b.dataset.id;
      opsFilter = 'nouvelle';
      loadOperations();
    }));
    box.querySelectorAll('[data-op-debrief]').forEach((b) => b.addEventListener('click', () => {
      pendingDebriefOp = b.dataset.id;
      opsFilter = 'debriefs';
      loadOperations();
    }));
    box.querySelectorAll('[data-op-see-debrief]').forEach((b) => b.addEventListener('click', () => {
      focusDebrief = b.dataset.id;
      opsFilter = 'debriefs';
      loadOperations();
    }));
    box.querySelectorAll('[data-journal-toggle]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.journalToggle;
      if (openJournals.has(id)) openJournals.delete(id); else openJournals.add(id);
      loadOperations();
    }));
    box.querySelectorAll('[data-journal-form]').forEach((form) => form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = form.dataset.journalForm;
      const text = form.querySelector('input').value.trim();
      if (!text) return;
      try {
        await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(id)}/journal`, { method: 'POST', body: JSON.stringify({ kind: form.querySelector('select').value, text }) });
        openJournals.add(id);
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
    box.querySelectorAll('[data-journal-del]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Retirer cette entrée du journal ?')) return;
      try {
        await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(b.dataset.op)}/journal/${encodeURIComponent(b.dataset.journalDel)}`, { method: 'DELETE' });
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
  }

  // Opérateurs FIM vus en jeu pendant l'opération (relevé automatique du bot).
  function presenceList(o) {
    return Object.values(o.presence || {}).sort((a, b) => b.minutes - a.minutes);
  }
  function presenceText(o) {
    return presenceList(o).map((x) => `${x.name} (${x.unit ? unitLabel(x.unit) : 'FIM'}, ${fr(x.minutes, 0)} min)`).join(', ');
  }
  function presenceLine(o) {
    const list = presenceList(o);
    if (!list.length) return o.status === 'en_cours' ? '<div class="fim-op-meta" style="margin:10px 0 0;">Présence en jeu <b>relevé en cours (toutes les minutes)…</b></div>' : '';
    return `<div class="fim-op-meta" style="margin:10px 0 0; flex-wrap:wrap; align-items:center;">Présents en jeu ${list.map((x) => `<span class="fim-chip u" style="--u:${unitColor(x.unit)}">${esc(x.name)} · ${fr(x.minutes, 0)} min</span>`).join(' ')}</div>`;
  }

  function journalBlock(o, ctx) {
    const entries = [...(o.journal || [])].sort((a, b) => b.at - a.at);
    const open = openJournals.has(o.id) || o.status === 'en_cours';
    const canWrite = o.status === 'en_cours' || o.status === 'planifiee';
    if (!entries.length && !canWrite) return '';
    const shown = open ? entries : entries.slice(0, 2);
    return `
      <div class="fim-journal">
        <div class="fim-journal-head"><span>Journal de bord · ${entries.length} entrée${entries.length > 1 ? 's' : ''}</span>${entries.length > 2 && o.status !== 'en_cours' ? `<button type="button" class="fim-link" data-journal-toggle="${esc(o.id)}">${open ? 'Réduire' : 'Tout voir'}</button>` : ''}</div>
        ${shown.map((e) => `
          <div class="fim-journal-row">
            <span class="t">${new Date(e.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            ${pill(JOURNAL_META[e.kind] || JOURNAL_META.info)}
            <span class="x">${esc(e.text)}</span>
            <span class="by">${esc(withCallsign(e.by))}</span>
            ${ctx.canCommand ? `<button type="button" class="fim-x" title="Retirer" data-journal-del="${esc(e.id)}" data-op="${esc(o.id)}">×</button>` : ''}
          </div>`).join('')}
        ${canWrite ? `<form class="fim-journal-form" data-journal-form="${esc(o.id)}">
          <select>${Object.entries(JOURNAL_META).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}</select>
          <input type="text" maxlength="500" placeholder="Ex : Contact avec SCP-939 couloir B, repli vers le sas…">
          <button class="btn small" type="submit">Ajouter</button>
        </form>` : ''}
      </div>`;
  }

  function opCard(o, ctx) {
    const st = STATUS_META[o.status] || STATUS_META.planifiee;
    const pr = PRIORITY_META[o.priority] || PRIORITY_META.routine;
    const debrief = ctx.debriefOf.get(o.id);
    const mine = roleIn(o, ctx.self);
    const actions = [];
    if (ctx.canCommand) {
      if (o.status === 'planifiee') actions.push(`<button class="btn small" data-op-status="en_cours" data-id="${esc(o.id)}">Lancer</button>`);
      if (o.status === 'en_cours') actions.push(`<button class="btn small" data-op-status="terminee" data-id="${esc(o.id)}">Clôturer</button>`);
      if (o.status === 'planifiee' || o.status === 'en_cours') {
        actions.push(`<button class="btn ghost small" data-op-edit data-id="${esc(o.id)}">Modifier</button>`);
        actions.push(`<button class="btn ghost small" data-op-status="annulee" data-id="${esc(o.id)}">Annuler</button>`);
      }
    }
    if (o.status === 'terminee' && debrief) actions.push(`<button class="btn ghost small" data-op-see-debrief data-id="${esc(debrief.id)}">Voir le débriefing</button>`);
    else if (o.status === 'terminee') actions.push(`<button class="btn small" data-op-debrief data-id="${esc(o.id)}">Rédiger le débriefing</button>`);
    if (ctx.canCommand) actions.push(`<button class="btn danger small" data-op-delete data-id="${esc(o.id)}">Supprimer</button>`);
    const team = o.team || [];
    return `
      <div class="fim-op${mine ? ' mine' : ''}" style="--u:${unitColor(o.unit)}">
        <div class="fim-op-top">
          <span class="fim-op-name">OPÉRATION ${esc(o.codeName)}</span>
          ${mine ? `<span class="fim-pill" style="--c:#4FD895">Ma mission · ${esc(mine)}</span>` : ''}
          ${pill(pr)} ${pill(st)}${debrief ? ` ${pill({ label: `Débriefé · ${(OUTCOME_META[debrief.outcome] || OUTCOME_META.partiel).label}`, color: (OUTCOME_META[debrief.outcome] || OUTCOME_META.partiel).color })}` : ''}
        </div>
        <div class="fim-op-meta">
          <span>Unité <b>${esc(unitLabel(o.unit))}</b></span>
          ${o.leader ? `<span>Chef <b>${esc(withCallsign(o.leader))}</b></span>` : ''}
          ${o.scheduledAt ? `<span>Heure <b>${esc(fmtDate(o.scheduledAt))}</b> (${esc(relTime(o.scheduledAt))})</span>` : ''}
          ${o.rallyPoint ? `<span>Ralliement <b>${esc(o.rallyPoint)}</b></span>` : ''}
          ${o.zone ? `<span>Zone <b>${esc(o.zone)}</b></span>` : ''}
          ${o.target ? `<span>Cible <b>${esc(o.target)}</b></span>` : ''}
          ${o.roe ? `<span>RDE <b>${esc(o.roe)}</b></span>` : ''}
        </div>
        <div class="fim-op-body">${esc(o.objective)}</div>
        ${team.length
          ? `<div class="fim-op-team">${team.map((m) => `<span class="fim-chip${norm(m.name) === norm(ctx.self) ? ' me' : ''}">${esc(withCallsign(m.name))}${m.role ? ` · <i>${esc(m.role)}</i>` : ''}</span>`).join('')}</div>`
          : o.assigned ? `<div class="fim-op-meta" style="margin:10px 0 0;">Affectés <b>${esc(o.assigned)}</b></div>` : ''}
        ${presenceLine(o)}
        ${journalBlock(o, ctx)}
        <div class="fim-op-foot">Émis par ${esc(o.authorCharacterName)} · ${fmtDate(o.createdAt)}${o.updatedBy ? ` · modifié par ${esc(o.updatedBy)}` : ''}</div>
        ${(o.statusLog || []).length > 1 ? `<div class="fim-op-log">${o.statusLog.map((l) => `${fmtDate(l.at)} — ${esc(STATUS_META[l.status]?.label || l.status)} par ${esc(l.by)}${l.note ? ` : ${esc(l.note)}` : ''}`).join('<br>')}</div>` : ''}
        ${actions.length ? `<div class="sci-card-actions">${actions.join('')}</div>` : ''}
      </div>`;
  }

  // Formulaire d'ordre (création ou modification) : équipe tirée du roster.
  let formTeam = [];
  function toLocalInput(t) {
    if (!t) return '';
    const d = new Date(t);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function opForm(op, agents) {
    formTeam = op ? (op.team || []).map((m) => ({ ...m })) : [];
    const names = agents.map((a) => a.name || a.username).filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr'));
    const roes = ['RDE-0 Observation', 'RDE-1 Riposte', 'RDE-2 Neutralisation', 'RDE-3 Feu libre', 'RDE-Ω Omega'];
    return `
      <div class="subsection" style="margin-top:0;">
        <h3>${op ? `Modifier l'ordre ${esc(op.codeName)}` : 'Émettre un ordre de mission'}</h3>
        <form id="fim-op-form">
          <div class="fim-editor-section">Mission</div>
          <div class="field-grid">
            <div class="field-row"><label>Nom de code *</label><input id="op-code" maxlength="60" placeholder="Ex : RENARD NOIR" required value="${op ? esc(op.codeName) : ''}"></div>
            <div class="field-row"><label>Unité</label><select id="op-unit">${UNIT_OPTIONS.map((u) => `<option value="${u}"${op && op.unit === u ? ' selected' : ''}>${esc(unitLabel(u))}</option>`).join('')}</select></div>
            <div class="field-row"><label>Priorité</label><select id="op-priority">${Object.entries(PRIORITY_META).map(([k, m]) => `<option value="${k}"${op && op.priority === k ? ' selected' : ''}>${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Règles d'engagement</label><select id="op-roe">${roes.map((r, i) => `<option${op ? (op.roe === r ? ' selected' : '') : i === 1 ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
            <div class="field-row"><label>Zone</label><input id="op-zone" maxlength="80" placeholder="Ex : Zone de confinement lourde" value="${op ? esc(op.zone || '') : ''}"></div>
            <div class="field-row"><label>Cible / entité</label><input id="op-target" maxlength="80" placeholder="Ex : SCP-939, cellule IC…" list="fim-scp-list" value="${op ? esc(op.target || '') : ''}"></div>
            <div class="field-row"><label>Heure prévue</label><input id="op-time" type="datetime-local" value="${op ? toLocalInput(op.scheduledAt) : ''}"></div>
            <div class="field-row"><label>Point de ralliement</label><input id="op-rally" maxlength="120" placeholder="Ex : quai D-FIM, Gate A" value="${op ? esc(op.rallyPoint || '') : ''}"></div>
          </div>
          <datalist id="fim-scp-list">${SCPS.map((s) => `<option value="${s.id}">`).join('')}<option value="Insurrection du Chaos"><option value="Classe-D évadé"></datalist>
          <div class="field-row"><label>Objectif et déroulé *</label><textarea id="op-objective" rows="6" maxlength="4000" placeholder="Objectif, phases, consignes particulières…" required>${op ? esc(op.objective || '') : ''}</textarea></div>
          <div class="fim-editor-section">Équipe</div>
          <div class="field-row"><label>Chef d'opération</label><select id="op-leader"><option value="">— Aucun —</option>${names.map((n) => `<option value="${esc(n)}"${op && norm(op.leader) === norm(n) ? ' selected' : ''}>${esc(withCallsign(n))}</option>`).join('')}${op && op.leader && !names.some((n) => norm(n) === norm(op.leader)) ? `<option selected value="${esc(op.leader)}">${esc(op.leader)}</option>` : ''}</select></div>
          <div class="field-row"><label>Opérateurs (clic pour ajouter)</label>
            <input type="text" id="op-team-filter" placeholder="Filtrer le roster…" style="margin-bottom:8px;">
            <div class="fim-picker" id="op-picker">${agents.map((a) => {
              const n = a.name || a.username;
              const u = unitFromAgent(a);
              return `<button type="button" class="fim-chip u" style="--u:${u ? unitColor(u) : '#9297A8'}" data-pick="${esc(n)}">${esc(withCallsign(n))}${u ? ` · ${esc(unitLabel(u))}` : ''}</button>`;
            }).join('')}</div>
            <div style="display:flex; gap:8px; margin-top:8px;"><input type="text" id="op-team-extra" maxlength="80" placeholder="Hors roster : nom ou indicatif" style="flex:1;"><button class="btn ghost small" type="button" id="op-team-add">Ajouter</button></div>
          </div>
          <div id="op-team"></div>
          <div style="display:flex; gap:10px; margin-top:16px;">
            <button class="btn" type="submit">${op ? 'Enregistrer les modifications' : 'Émettre l’ordre'}</button>
            ${op ? '<button class="btn ghost" type="button" id="op-cancel">Annuler</button>' : ''}
          </div>
        </form>
      </div>`;
  }
  function renderFormTeam() {
    const box = document.getElementById('op-team');
    if (!box) return;
    box.innerHTML = formTeam.length
      ? `<div class="fim-team-list">${formTeam.map((m, i) => `
          <div class="fim-team-row">
            <span class="nm">${esc(withCallsign(m.name))}</span>
            <input type="text" maxlength="40" placeholder="Rôle (ex : tireur, médic, K9…)" value="${esc(m.role || '')}" data-role="${i}">
            <button type="button" class="fim-x" data-unpick="${i}" title="Retirer">×</button>
          </div>`).join('')}</div>`
      : '<div class="empty-row" style="padding:12px;">Aucun opérateur dans l’équipe.</div>';
    box.querySelectorAll('[data-role]').forEach((inp) => inp.addEventListener('input', () => { formTeam[+inp.dataset.role].role = inp.value; }));
    box.querySelectorAll('[data-unpick]').forEach((b) => b.addEventListener('click', () => { formTeam.splice(+b.dataset.unpick, 1); renderFormTeam(); syncPicker(); }));
  }
  function syncPicker() {
    document.querySelectorAll('#op-picker [data-pick]').forEach((b) => b.classList.toggle('picked', formTeam.some((m) => norm(m.name) === norm(b.dataset.pick))));
  }
  function bindOpForm(op) {
    const addMember = (name) => {
      const n = String(name || '').trim();
      if (!n || formTeam.some((m) => norm(m.name) === norm(n))) return;
      formTeam.push({ name: n, role: '' });
      renderFormTeam();
      syncPicker();
    };
    document.querySelectorAll('#op-picker [data-pick]').forEach((b) => b.addEventListener('click', () => {
      const i = formTeam.findIndex((m) => norm(m.name) === norm(b.dataset.pick));
      if (i >= 0) { formTeam.splice(i, 1); renderFormTeam(); syncPicker(); } else addMember(b.dataset.pick);
    }));
    document.getElementById('op-team-filter').addEventListener('input', (e) => {
      const q = norm(e.target.value);
      document.querySelectorAll('#op-picker [data-pick]').forEach((b) => { b.style.display = !q || norm(b.textContent).includes(q) ? '' : 'none'; });
    });
    const extra = document.getElementById('op-team-extra');
    document.getElementById('op-team-add').addEventListener('click', () => { addMember(extra.value); extra.value = ''; });
    extra.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addMember(extra.value); extra.value = ''; } });
    document.getElementById('op-cancel')?.addEventListener('click', () => { editingOp = null; opsFilter = 'actives'; loadOperations(); });
    renderFormTeam();
    syncPicker();
    document.getElementById('fim-op-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const time = v('op-time');
      const payload = {
        codeName: v('op-code'), unit: v('op-unit'), priority: v('op-priority'), roe: v('op-roe'), zone: v('op-zone'), target: v('op-target'),
        objective: v('op-objective'), leader: v('op-leader'), rallyPoint: v('op-rally'), scheduledAt: time ? new Date(time).getTime() : null,
        team: formTeam.map((m) => ({ name: m.name, role: (m.role || '').trim() })),
      };
      if (!payload.codeName || !payload.objective) { window.showToast('Nom de code et objectif obligatoires.', 'error'); return; }
      try {
        if (op) await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(op.id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
        else await window.apiFetch('/api/rp/fim/operations', { method: 'POST', body: JSON.stringify(payload) });
        window.showToast(op ? 'Ordre modifié.' : 'Ordre de mission émis.', 'success');
        editingOp = null;
        opsFilter = 'actives';
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Débriefings (vue de l'onglet Opérations)
  // ---------------------------------------------------------------
  let pendingDebriefOp = null;
  let focusDebrief = null;
  let debriefSearch = '';
  function renderDebriefs(body, debriefs, ops) {
    const success = debriefs.filter((d) => d.outcome === 'succes').length;
    setSide(
      [[String(debriefs.length), 'Débriefings'], [debriefs.length ? `${Math.round((success / debriefs.length) * 100)}%` : '—', 'Succès']],
      debriefs.slice(0, 5).map((d) => [new Date(d.createdAt).toLocaleDateString('fr-FR'), d.title])
    );
    const preOp = ops.find((o) => o.id === pendingDebriefOp);
    pendingDebriefOp = null;
    const opName = (id) => ops.find((o) => o.id === id)?.codeName;
    const debriefed = new Set(debriefs.map((d) => d.operationId).filter(Boolean));
    const todo = ops.filter((o) => o.status === 'terminee' && !debriefed.has(o.id));

    body.innerHTML = `
      ${todo.length ? `<div class="fim-hq-card" style="margin-bottom:18px;">
        <div class="fim-hq-card-head"><h3>Opérations terminées sans débriefing</h3><span class="count">${todo.length}</span></div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">${todo.map((o) => `<button class="btn ghost small" type="button" data-write="${esc(o.id)}">${esc(o.codeName)}</button>`).join('')}</div>
      </div>` : ''}
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:14px;">
        <input type="text" id="fim-db-search" class="fim-search" style="flex:1; margin:0;" placeholder="Rechercher : titre, unité, entité, participant…" value="${esc(debriefSearch)}">
        <button class="btn small" type="button" id="fim-db-toggle">${preOp ? 'Fermer le formulaire' : '+ Rédiger un débriefing'}</button>
      </div>
      <div class="subsection" id="fim-db-formbox" style="margin:0 0 24px;${preOp ? '' : ' display:none;'}">
        <h3>${preOp ? `Débriefing de l'opération ${esc(preOp.codeName)}` : 'Rédiger un débriefing'}</h3>
        <form id="fim-db-form">
          <div class="field-grid">
            <div class="field-row"><label>Titre *</label><input id="db-title" maxlength="120" required value="${preOp ? `Opération ${esc(preOp.codeName)}` : ''}"></div>
            <div class="field-row"><label>Opération liée</label><select id="db-op"><option value="">— Aucune —</option>${ops.map((o) => `<option value="${esc(o.id)}"${preOp && preOp.id === o.id ? ' selected' : ''}>${esc(o.codeName)} (${esc(STATUS_META[o.status]?.label || o.status)})</option>`).join('')}</select></div>
            <div class="field-row"><label>Unité</label><select id="db-unit">${UNIT_OPTIONS.map((u) => `<option value="${u}"${preOp && preOp.unit === u ? ' selected' : ''}>${esc(unitLabel(u))}</option>`).join('')}</select></div>
            <div class="field-row"><label>Résultat</label><select id="db-outcome">${Object.entries(OUTCOME_META).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Entité / adversaire</label><input id="db-scp" maxlength="60" list="fim-scp-list2" value="${preOp ? esc(preOp.target || '') : ''}"></div>
            <div class="field-row"><label>Pertes et blessés</label><input id="db-losses" maxlength="200" placeholder="Ex : 1 blessé léger, aucun mort"></div>
          </div>
          <datalist id="fim-scp-list2">${SCPS.map((s) => `<option value="${s.id}">`).join('')}<option value="Insurrection du Chaos"></datalist>
          <div class="field-row"><label>Participants${preOp && presenceList(preOp).length ? ' (pré-rempli : présents en jeu)' : ''}</label><textarea id="db-participants" rows="2" maxlength="1000" placeholder="Ex : RENARD-1 (chef), RENARD-2…">${preOp ? esc(presenceText(preOp)) : ''}</textarea></div>
          <div class="field-row"><label>Déroulé *</label><textarea id="db-summary" rows="6" maxlength="6000" required></textarea></div>
          <div class="field-row"><label>Leçons et recommandations</label><textarea id="db-lessons" rows="3" maxlength="3000"></textarea></div>
          <button class="btn" type="submit">Enregistrer le débriefing</button>
        </form>
      </div>
      <div id="fim-db-list"></div>
    `;

    const renderList = () => {
      const q = norm(debriefSearch);
      const list = q ? debriefs.filter((d) => [d.title, unitLabel(d.unit), d.scp, d.participants, d.authorCharacterName, opName(d.operationId)].some((x) => norm(x).includes(q))) : debriefs;
      document.getElementById('fim-db-list').innerHTML = list.length ? list.map((d) => `
        <div class="fim-op${d.id === focusDebrief ? ' focus' : ''}" style="--u:${unitColor(d.unit)}" data-debrief-id="${esc(d.id)}">
          <div class="fim-op-top"><span class="fim-op-name" style="font-family:'Space Grotesk', sans-serif; letter-spacing:0;">${esc(d.title)}</span>${pill(OUTCOME_META[d.outcome] || OUTCOME_META.partiel)}</div>
          <div class="fim-op-meta">
            <span>Unité <b>${esc(unitLabel(d.unit))}</b></span>
            ${d.operationId && opName(d.operationId) ? `<span>Opération <b>${esc(opName(d.operationId))}</b></span>` : ''}
            ${d.scp ? `<span>Contre <b>${esc(d.scp)}</b></span>` : ''}
            ${d.losses ? `<span>Pertes <b>${esc(d.losses)}</b></span>` : ''}
            ${d.participants ? `<span>Participants <b>${esc(d.participants)}</b></span>` : ''}
            <span>${esc(d.authorCharacterName)} · ${fmtDate(d.createdAt)}</span>
          </div>
          <div class="fim-op-body">${esc(d.summary)}</div>
          ${d.lessons ? `<div class="fim-op-log" style="color:var(--ink-dim); font-family:'Inter', sans-serif; font-size:12.5px;"><b style="font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--accent-2); letter-spacing:.08em;">LEÇONS</b><br>${esc(d.lessons)}</div>` : ''}
        </div>`).join('') : '<div class="empty-row">Aucun débriefing.</div>';
    };
    renderList();
    if (focusDebrief) {
      document.querySelector(`[data-debrief-id="${CSS.escape(focusDebrief)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      focusDebrief = null;
    }
    document.getElementById('fim-db-search').addEventListener('input', (e) => { debriefSearch = e.target.value; renderList(); });
    const formBox = document.getElementById('fim-db-formbox');
    const toggle = document.getElementById('fim-db-toggle');
    toggle.addEventListener('click', () => {
      const open = formBox.style.display === 'none';
      formBox.style.display = open ? '' : 'none';
      toggle.textContent = open ? 'Fermer le formulaire' : '+ Rédiger un débriefing';
    });
    body.querySelectorAll('[data-write]').forEach((b) => b.addEventListener('click', () => {
      pendingDebriefOp = b.dataset.write;
      renderDebriefs(body, debriefs, ops);
      document.getElementById('fim-db-formbox')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    document.getElementById('db-op').addEventListener('change', (e) => {
      const op = ops.find((o) => o.id === e.target.value);
      const box = document.getElementById('db-participants');
      if (op && presenceList(op).length && !box.value.trim()) box.value = presenceText(op);
      if (op && !document.getElementById('db-title').value.trim()) document.getElementById('db-title').value = `Opération ${op.codeName}`;
      if (op) document.getElementById('db-unit').value = op.unit;
    });
    document.getElementById('fim-db-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const payload = { title: v('db-title'), operationId: v('db-op'), unit: v('db-unit'), outcome: v('db-outcome'), scp: v('db-scp'), losses: v('db-losses'), participants: v('db-participants'), summary: v('db-summary'), lessons: v('db-lessons') };
      if (!payload.title || !payload.summary) { window.showToast('Titre et déroulé obligatoires.', 'error'); return; }
      try {
        await window.apiFetch('/api/rp/fim/debriefs', { method: 'POST', body: JSON.stringify(payload) });
        window.showToast('Débriefing enregistré.', 'success');
        opsFilter = 'debriefs';
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Onglet Savoir : doctrine (et notes du commandement) + fiches SCP
  // ---------------------------------------------------------------
  let libView = 'doctrine';
  function loadLibrary() {
    const root = document.getElementById('terminal-main');
    mainOverride = null;
    root.innerHTML = `
      ${subTabs([['doctrine', 'Doctrine et notes'], ['scp', 'Fiches de reconfinement']], libView, 'data-lv')}
      <div id="fim-lib-body"></div>`;
    root.querySelectorAll('[data-lv]').forEach((b) => b.addEventListener('click', () => {
      libView = b.dataset.lv;
      loadLibrary();
    }));
    mainOverride = document.getElementById('fim-lib-body');
    if (libView === 'scp') loadContainment();
    else loadDoctrine();
  }

  // ---------------------------------------------------------------
  // Fiches de reconfinement (vue de l'onglet Savoir)
  // ---------------------------------------------------------------
  let selectedScp = 'SCP-173';
  function loadContainment() {
    const main = mainEl();
    const keter = SCPS.filter((s) => s.cls === 'Keter').length;
    setSide([[String(SCPS.length), 'Fiches'], [String(keter), 'Keter']], SCPS.filter((s) => s.threat >= 5).map((s) => ['MENACE 5', `${s.id} · ${s.name}`]));
    const render = () => {
      const s = SCPS.find((x) => x.id === selectedScp) || SCPS[0];
      const c = CLASS_COLORS[s.cls];
      main.innerHTML = `
        <div class="fim-hero">
          <div class="fim-hero-eyebrow">Fiches tactiques · usage FIM uniquement</div>
          <h2>Reconfinement des SCP du Site-15</h2>
          <p>Ce que l'entité fait, comment l'approcher, ce qu'il ne faut jamais faire. Les fiches complètes de recherche sont dans les Archives Fondationnaires.</p>
        </div>
        <div class="fim-grid" style="grid-template-columns:repeat(auto-fill, minmax(165px, 1fr));">
          ${SCPS.map((x) => `
            <button class="fim-scp-card${x.id === s.id ? ' active' : ''}" data-scp="${x.id}" type="button">
              <span class="id">${esc(x.id)}</span><span class="nm">${esc(x.name)}</span>
              <span style="display:flex; justify-content:space-between; align-items:center;">
                <span class="fim-pill" style="--c:${CLASS_COLORS[x.cls]}">${x.cls}</span>
                <span class="fim-threat">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= x.threat ? 'on' : ''}" style="--c:${x.threat >= 5 ? 'var(--bad)' : x.threat >= 3 ? 'var(--warn)' : 'var(--good)'}"></i>`).join('')}</span>
              </span>
            </button>`).join('')}
        </div>
        <div class="fim-dossier" style="--u:${c}">
          <div class="fim-dossier-head">
            <div><h3>${esc(s.id)} — ${esc(s.name)}</h3><div class="fim-motto" style="color:${c}">CLASSE ${esc(s.cls.toUpperCase())} · MENACE ${s.threat}/5 · UNITÉS : ${esc(s.units)}</div></div>
          </div>
          <div class="sci-body-rendered">${window.renderMarkdown(s.md)}</div>
        </div>
        ${credit()}
      `;
      main.querySelectorAll('[data-scp]').forEach((b) => b.addEventListener('click', () => {
        selectedScp = b.dataset.scp;
        render();
        main.querySelector('.fim-dossier')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
    };
    render();
  }

  // ---------------------------------------------------------------
  // Onglet Doctrine (articles officiels fixes + notes du commandement)
  // ---------------------------------------------------------------
  let docSelected = 'charte';
  let docCache = [];
  let docCanManage = false;

  function codesMarkdown() {
    return `Le code d'alerte du Site est affiché sur les écrans et annoncé par radio. Chaque code fixe la **posture** des FIM.

| Code | Signification | Posture FIM |
|---|---|---|
${CODE_ORDER.map((k) => `| **${k}** | ${CODES[k].desc} | ${CODES[k].posture.replace(/<\/?b>/g, '**')} |`).join('\n')}

Le code le plus grave entre tous les serveurs est affiché dans l'onglet *QG*.`;
  }

  async function loadDoctrine() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    try {
      const data = await window.apiFetch('/api/rp/fim/docs');
      docCache = data.documents || [];
      docCanManage = !!data.canManage;
    } catch (err) {
      docCache = [];
      docCanManage = false;
    }
    setSide([[String(DOCTRINE.length), 'Officiels'], [String(docCache.length), 'Notes']], docCache.slice(0, 4).map((d) => [new Date(d.createdAt).toLocaleDateString('fr-FR'), d.title]));

    main.innerHTML = `
      <div class="wiki-layout">
        <div class="wiki-toc">
          <div class="wiki-toc-head"><span class="record-block-head-title">Doctrine FIM</span><span class="count">${DOCTRINE.length + docCache.length}</span></div>
          ${docCanManage ? '<button class="btn small" id="fim-doc-new" type="button" style="width:100%; margin-top:10px;">+ Nouvelle note</button>' : ''}
          <div class="wiki-toc-list" id="fim-doc-toc"></div>
        </div>
        <div class="wiki-article" id="fim-doc-article"></div>
      </div>
      ${credit()}
    `;
    document.getElementById('fim-doc-new')?.addEventListener('click', () => {
      docSelected = 'new';
      renderDocToc();
      renderDocArticle();
    });
    renderDocToc();
    renderDocArticle();
  }

  function renderDocToc() {
    const list = document.getElementById('fim-doc-toc');
    const groups = {};
    DOCTRINE.forEach((d) => (groups[d.cat] = groups[d.cat] || []).push({ id: `s:${d.id}`, title: d.title, meta: 'Officiel' }));
    docCache.forEach((d) => (groups[d.category || 'Note interne'] = groups[d.category || 'Note interne'] || []).push({ id: d.id, title: d.title, meta: d.authorCharacterName }));
    list.innerHTML = Object.entries(groups).map(([cat, items]) => `
      <div style="font-family:'JetBrains Mono', monospace; font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); padding:10px 10px 4px;">${esc(cat)}</div>
      ${items.map((i) => `<button class="wiki-toc-item${(i.id === `s:${docSelected}` || i.id === docSelected) ? ' active' : ''}" data-doc="${esc(i.id)}" type="button"><span class="wiki-toc-title">${esc(i.title)}</span><span class="wiki-toc-meta">${esc(i.meta)}</span></button>`).join('')}
    `).join('');
    list.querySelectorAll('[data-doc]').forEach((b) => b.addEventListener('click', () => {
      docSelected = b.dataset.doc.startsWith('s:') ? b.dataset.doc.slice(2) : b.dataset.doc;
      renderDocToc();
      renderDocArticle();
    }));
  }

  function renderDocArticle() {
    const article = document.getElementById('fim-doc-article');
    const isEdit = typeof docSelected === 'string' && docSelected.startsWith('edit:');
    if (docSelected === 'new' || isEdit) {
      const doc = isEdit ? docCache.find((d) => d.id === docSelected.slice(5)) : null;
      article.innerHTML = `
        <h3 style="font-family:'Space Grotesk', sans-serif; font-size:16px; margin-bottom:16px;">${doc ? 'Modifier la note' : 'Nouvelle note du commandement'}</h3>
        <form id="fim-doc-form">
          <div class="field-grid">
            <div class="field-row"><label>Titre *</label><input id="fim-doc-title" maxlength="120" required value="${doc ? esc(doc.title) : ''}"></div>
            <div class="field-row"><label>Catégorie</label><input id="fim-doc-cat" maxlength="40" list="fim-doc-cats" value="${doc ? esc(doc.category || '') : 'Note interne'}"></div>
          </div>
          <datalist id="fim-doc-cats"><option value="Note interne"><option value="Fondamentaux"><option value="Opérations"><option value="Site-15"><option value="Formation"></datalist>
          <div class="field-row"><label>Contenu (Markdown, {{texte}} = caviardé) *</label><textarea id="fim-doc-content" rows="14" required>${doc ? esc(doc.content) : ''}</textarea></div>
          <div style="display:flex; gap:10px;"><button class="btn" type="submit">${doc ? 'Enregistrer' : 'Publier'}</button><button class="btn ghost" type="button" id="fim-doc-cancel">Annuler</button></div>
        </form>`;
      document.getElementById('fim-doc-cancel').addEventListener('click', () => {
        docSelected = doc ? doc.id : 'charte';
        renderDocToc();
        renderDocArticle();
      });
      document.getElementById('fim-doc-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = { title: document.getElementById('fim-doc-title').value.trim(), category: document.getElementById('fim-doc-cat').value.trim(), content: document.getElementById('fim-doc-content').value.trim() };
        if (!payload.title || !payload.content) { window.showToast('Titre et contenu obligatoires.', 'error'); return; }
        try {
          if (doc) await window.apiFetch(`/api/rp/fim/docs/${encodeURIComponent(doc.id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
          else await window.apiFetch('/api/rp/fim/docs', { method: 'POST', body: JSON.stringify(payload) });
          window.showToast(doc ? 'Note modifiée.' : 'Note publiée.', 'success');
          docSelected = doc ? doc.id : 'charte';
          loadDoctrine();
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      });
      return;
    }

    const official = DOCTRINE.find((d) => d.id === docSelected);
    if (official) {
      article.innerHTML = `
        <div class="wiki-article-head"><span class="fim-pill" style="--c:var(--accent-2)">Doctrine officielle</span><span class="fim-pill">${esc(official.cat)}</span></div>
        <h2 class="wiki-article-title">${esc(official.title)}</h2>
        <div class="post-card-meta" style="margin-bottom:20px;">Commandement FIM · Site-15</div>
        <div class="sci-body-rendered fim-table">${window.renderMarkdown(official.id === 'codes' ? codesMarkdown() : official.md)}</div>`;
      return;
    }
    const doc = docCache.find((d) => d.id === docSelected);
    if (!doc) {
      article.innerHTML = '<div class="wiki-empty"><div class="wiki-empty-title">Doctrine FIM</div><p>Sélectionne un article.</p></div>';
      return;
    }
    article.innerHTML = `
      <div class="wiki-article-head"><span class="fim-pill">${esc(doc.category || 'Note interne')}</span></div>
      <h2 class="wiki-article-title">${esc(doc.title)}</h2>
      <div class="post-card-meta" style="margin-bottom:20px;">${esc(doc.authorCharacterName)} — ${fmtDate(doc.createdAt)}</div>
      <div class="sci-body-rendered fim-table">${window.renderMarkdown(doc.content)}</div>
      ${docCanManage ? '<div class="sci-card-actions" style="margin-top:24px;"><button class="btn ghost small" id="fim-doc-edit">Modifier</button><button class="btn danger small" id="fim-doc-del">Supprimer</button></div>' : ''}`;
    document.getElementById('fim-doc-edit')?.addEventListener('click', () => {
      docSelected = `edit:${doc.id}`;
      renderDocArticle();
    });
    document.getElementById('fim-doc-del')?.addEventListener('click', async () => {
      if (!confirm('Supprimer cette note ?')) return;
      try {
        await window.apiFetch(`/api/rp/fim/docs/${encodeURIComponent(doc.id)}`, { method: 'DELETE' });
        window.showToast('Note supprimée.', 'success');
        docSelected = 'charte';
        loadDoctrine();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Onglet Évaluations (officiers : grilles configurables + notation ;
  // opérateurs : lecture de leurs propres évaluations)
  // ---------------------------------------------------------------
  const VERDICT_META = {
    excellent: { label: 'Excellent', color: '#4FD895' },
    conforme: { label: 'Conforme', color: '#5AA9FF' },
    a_ameliorer: { label: 'À améliorer', color: '#F0A83C' },
    insuffisant: { label: 'Insuffisant', color: '#F0525A' },
  };
  const RECO_META = {
    aucune: { label: 'Aucune', color: '#9297A8' },
    promotion: { label: 'Proposé à la promotion', color: '#4FD895' },
    formation: { label: 'Formation complémentaire', color: '#5AA9FF' },
    avertissement: { label: 'Avertissement', color: '#F0A83C' },
    retrait: { label: "Retrait de l'unité", color: '#F0525A' },
  };
  const CONTEXT_LABELS = { operation: 'Opération', exercice: 'Exercice', patrouille: 'Patrouille', periodique: 'Évaluation périodique', formation: 'Formation', recrutement: 'Recrutement' };

  // Barèmes proposés dans l'éditeur de grille.
  const SCALE_PRESETS = [
    { id: 'r1-5', label: 'Notes de 1 à 5', scale: { kind: 'range', min: 1, max: 5, step: 1 } },
    { id: 'r0-10', label: 'Sur 10 (demi-points)', scale: { kind: 'range', min: 0, max: 10, step: 0.5 } },
    { id: 'r0-20', label: 'Sur 20 (demi-points)', scale: { kind: 'range', min: 0, max: 20, step: 0.5 } },
    { id: 'r0-100', label: 'Sur 100', scale: { kind: 'range', min: 0, max: 100, step: 1 } },
    { id: 'lAE', label: 'Lettres A à E', scale: { kind: 'levels', levels: [{ label: 'A', value: 100 }, { label: 'B', value: 75 }, { label: 'C', value: 50 }, { label: 'D', value: 25 }, { label: 'E', value: 0 }] } },
    { id: 'lacq', label: 'Acquis / En cours / Non acquis', scale: { kind: 'levels', levels: [{ label: 'Acquis', value: 100 }, { label: 'En cours', value: 50 }, { label: 'Non acquis', value: 0 }] } },
    { id: 'lok', label: 'Réussi / Échoué', scale: { kind: 'levels', levels: [{ label: 'Réussi', value: 100 }, { label: 'Échoué', value: 0 }] } },
    { id: 'custom-range', label: 'Plage personnalisée…', scale: null },
    { id: 'custom-levels', label: 'Niveaux personnalisés…', scale: null },
  ];

  const evalStyle = document.createElement('style');
  evalStyle.textContent = `
  .fim-eval-layout{ display:grid; grid-template-columns:270px 1fr; gap:18px; align-items:start; }
  .fim-eval-list{ background:var(--panel); border:1px solid var(--line); border-radius:3px; padding:12px; position:sticky; top:0; }
  .fim-eval-list input{ margin-bottom:8px; }
  .fim-eval-items{ display:flex; flex-direction:column; gap:2px; max-height:560px; overflow-y:auto; }
  .fim-eval-item{ display:flex; align-items:center; gap:10px; width:100%; text-align:left; padding:9px 10px; border:none; border-left:2px solid transparent; border-radius:2px;
    background:transparent; color:var(--ink-dim); cursor:pointer; font-family:'Inter', sans-serif; }
  .fim-eval-item:hover{ background:var(--void-2); color:var(--ink); }
  .fim-eval-item.active{ background:var(--accent-soft); color:var(--ink); border-left-color:var(--u, var(--accent)); }
  .fim-eval-item .nm{ flex:1; min-width:0; font-size:12.5px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .fim-eval-item .sub{ display:block; font-family:'JetBrains Mono', monospace; font-size:9.5px; color:var(--ink-faint); font-weight:400; margin-top:2px; }
  .fim-score{ font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; min-width:40px; text-align:right; }
  .fim-eval-profile .fim-facts{ grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); }
  .fim-eval-profile{ background:var(--panel); border:1px solid var(--line); border-left:3px solid var(--u, var(--accent)); border-radius:3px; padding:22px 24px; }
  .fim-eval-head{ display:grid; grid-template-columns:250px 1fr; gap:22px; align-items:center; margin-bottom:8px; }
  .fim-radar{ width:250px; height:196px; }
  .fim-radar text{ font-family:'JetBrains Mono', monospace; font-size:9px; fill:var(--ink-faint); text-transform:uppercase; }
  .fim-bars{ display:flex; flex-direction:column; gap:9px; }
  .fim-bar-row{ display:grid; grid-template-columns:120px 1fr 64px; gap:10px; align-items:center; font-size:12px; color:var(--ink-dim); }
  .fim-bar{ height:6px; background:var(--void-2); border-radius:3px; overflow:hidden; }
  .fim-bar i{ display:block; height:100%; border-radius:3px; background:var(--c); }
  .fim-bar-row b{ font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--ink); text-align:right; font-weight:500; }
  .fim-rate{ display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end; }
  .fim-rate button{ min-width:32px; height:30px; padding:0 8px; border-radius:2px; border:1px solid var(--line); background:var(--void-2); color:var(--ink-faint);
    font-family:'JetBrains Mono', monospace; font-size:12px; cursor:pointer; transition:all .12s ease; }
  .fim-rate button:hover{ border-color:var(--accent); color:var(--ink); }
  .fim-rate button.on{ background:var(--c); border-color:var(--c); color:var(--void); font-weight:700; }
  .fim-num{ display:flex; align-items:center; gap:10px; }
  .fim-num input[type=range]{ width:170px; padding:0; accent-color:var(--accent); background:none; border:none; }
  .fim-num input[type=number]{ width:84px; text-align:right; }
  .fim-num span{ font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--ink-faint); }
  .fim-crit-row{ display:grid; grid-template-columns:1fr auto; gap:14px; align-items:center; padding:10px 0; border-bottom:1px solid var(--line-soft); }
  .fim-crit-row .t{ font-size:13px; font-weight:600; } .fim-crit-row .h{ font-size:11.5px; color:var(--ink-faint); margin-top:2px; }
  .fim-crit-row .w{ font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--accent-2); margin-left:6px; font-weight:500; }
  .fim-total{ display:flex; gap:14px; align-items:center; flex-wrap:wrap; padding:12px 14px; margin:14px 0 16px; background:var(--void-2); border-radius:3px; font-family:'JetBrains Mono', monospace; font-size:11.5px; color:var(--ink-dim); }
  .fim-total b{ font-family:'Space Grotesk', sans-serif; font-size:18px; }
  .fim-eval-card{ background:var(--void-2); border-radius:3px; padding:14px 16px; margin-bottom:10px; }
  .fim-eval-card-top{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:8px; }
  .fim-mini-scores{ display:flex; gap:12px; flex-wrap:wrap; font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); margin-bottom:8px; }
  .fim-mini-scores b{ font-weight:500; }
  .fim-eval-text{ font-size:12.5px; color:var(--ink-dim); line-height:1.65; white-space:pre-wrap; }
  .fim-eval-text strong{ font-family:'JetBrains Mono', monospace; font-size:9.5px; letter-spacing:.08em; color:var(--accent-2); display:block; margin-top:6px; }
  .fim-grid-card{ background:var(--panel); border:1px solid var(--line); border-radius:3px; padding:16px 18px; display:flex; flex-direction:column; gap:10px; }
  .fim-grid-card.archived{ opacity:.55; }
  .fim-grid-card h4{ font-family:'Space Grotesk', sans-serif; font-size:15px; }
  .fim-grid-card p{ font-size:12px; color:var(--ink-dim); line-height:1.55; }
  .fim-grid-crits{ display:flex; flex-wrap:wrap; gap:5px; }
  .fim-editor-row{ display:grid; grid-template-columns:1.1fr 1.6fr 86px auto; gap:8px; align-items:center; margin-bottom:8px; }
  .fim-editor-row.levels{ grid-template-columns:1fr 110px auto; }
  .fim-icon-btns{ display:flex; gap:3px; }
  .fim-icon-btns button{ width:28px; height:34px; border:1px solid var(--line); background:var(--void-2); color:var(--ink-faint); border-radius:2px; cursor:pointer; font-size:12px; }
  .fim-icon-btns button:hover:not(:disabled){ color:var(--ink); border-color:var(--accent); }
  .fim-icon-btns button:disabled{ opacity:.3; cursor:not-allowed; }
  .fim-zones{ display:flex; height:10px; border-radius:3px; overflow:hidden; margin:10px 0 4px; }
  .fim-zones i{ display:block; height:100%; }
  .fim-zones-legend{ display:flex; justify-content:space-between; font-family:'JetBrains Mono', monospace; font-size:9.5px; color:var(--ink-faint); }
  .fim-editor-section{ font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent-2); margin:20px 0 10px; padding-left:8px; border-left:2px solid var(--accent); }
  @media (max-width:900px){ .fim-eval-layout, .fim-eval-head{ grid-template-columns:1fr; } .fim-eval-list{ position:static; } .fim-radar{ margin:0 auto; }
    .fim-editor-row{ grid-template-columns:1fr 1fr; } .fim-crit-row{ grid-template-columns:1fr; } .fim-rate{ justify-content:flex-start; } }
  `;
  document.head.appendChild(evalStyle);

  const pctColor = (p) => (p == null ? 'var(--ink-faint)' : p >= 75 ? '#4FD895' : p >= 50 ? '#5AA9FF' : p >= 25 ? '#F0A83C' : '#F0525A');
  const norm = (s) => String(s || '').trim().toLowerCase();
  const fr = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toString().replace('.', ',');
  const fmtPct = (p) => (p == null ? '—' : `${fr(p, 0)} %`);

  // --- Barème : conversions note brute <-> pourcentage ---
  function rawPercent(scale, raw) {
    if (raw === null || raw === undefined || raw === '') return null;
    if (scale.kind === 'levels') {
      const l = scale.levels[Math.round(Number(raw))];
      return l ? l.value : null;
    }
    const v = Number(raw);
    if (!Number.isFinite(v) || v < scale.min || v > scale.max) return null;
    return ((v - scale.min) / (scale.max - scale.min)) * 100;
  }
  function rawLabel(scale, raw) {
    if (raw === null || raw === undefined) return '—';
    if (scale.kind === 'levels') return scale.levels[Math.round(Number(raw))]?.label ?? '—';
    return fr(Number(raw), 2);
  }
  // Pourcentage -> valeur affichée dans l'unité du barème (« 14,5 / 20 », « B »).
  function pctInScale(scale, p) {
    if (p == null) return '—';
    if (scale.kind === 'levels') {
      const nearest = scale.levels.reduce((a, l) => (Math.abs(l.value - p) < Math.abs(a.value - p) ? l : a), scale.levels[0]);
      return nearest.label;
    }
    return `${fr(scale.min + (p / 100) * (scale.max - scale.min))} / ${fr(scale.max, 2)}`;
  }
  function scaleSummary(scale) {
    if (scale.kind === 'levels') return scale.levels.map((l) => l.label).join(' · ');
    return `${fr(scale.min, 2)} à ${fr(scale.max, 2)}${scale.step !== 1 ? ` (pas ${fr(scale.step, 2)})` : ''}`;
  }
  function gridPercent(grid, scores) {
    let total = 0;
    let weights = 0;
    grid.criteria.forEach((c) => {
      const p = rawPercent(grid.scale, scores[c.id]);
      if (p == null) return;
      total += p * c.weight;
      weights += c.weight;
    });
    return weights ? total / weights : null;
  }
  function verdictFor(grid, p) {
    const t = grid.thresholds;
    return p >= t.excellent ? 'excellent' : p >= t.conforme ? 'conforme' : p >= t.a_ameliorer ? 'a_ameliorer' : 'insuffisant';
  }
  const avgOf = (vals) => (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null);

  // Moyennes par critère (en %) pour une grille donnée.
  function criteriaAverages(grid, evals) {
    const out = {};
    grid.criteria.forEach((c) => {
      out[c.id] = avgOf(evals.map((e) => rawPercent(e.grid.scale, e.scores?.[c.id])).filter((v) => v != null));
    });
    return out;
  }

  function radar(criteria, avg, color) {
    if (criteria.length < 3) return '';
    const cx = 110, cy = 110, R = 78, n = criteria.length;
    const pt = (i, r) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };
    const ring = (k) => criteria.map((_, i) => pt(i, (R * k) / 5).join(',')).join(' ');
    const shape = criteria.map((c, i) => pt(i, (R * (avg[c.id] || 0)) / 100).join(',')).join(' ');
    const short = (s) => (s.length > 13 ? `${s.slice(0, 12)}…` : s);
    return `<svg class="fim-radar" viewBox="-30 0 280 220" aria-hidden="true">
      ${[1, 2, 3, 4, 5].map((k) => `<polygon points="${ring(k)}" fill="none" stroke="var(--line)" stroke-width="${k === 5 ? 1.2 : 0.7}"/>`).join('')}
      ${criteria.map((_, i) => { const [x, y] = pt(i, R); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)" stroke-width=".7"/>`; }).join('')}
      <polygon points="${shape}" fill="${color}" fill-opacity=".22" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
      ${criteria.map((c, i) => { const [x, y] = pt(i, (R * (avg[c.id] || 0)) / 100); return avg[c.id] != null ? `<circle cx="${x}" cy="${y}" r="2.6" fill="${color}"/>` : ''; }).join('')}
      ${criteria.map((c, i) => { const [x, y] = pt(i, R + 16); return `<text x="${x}" y="${y + 3}" text-anchor="middle">${esc(short(c.label))}</text>`; }).join('')}
    </svg>`;
  }

  function evalCard(e, canDelete) {
    const v = VERDICT_META[e.verdict] || VERDICT_META.conforme;
    const r = RECO_META[e.recommendation] || RECO_META.aucune;
    const g = e.grid;
    const cert = certOf(e);
    if (cert) diplomaRegistry.set(e.id, e);
    return `
      <div class="fim-eval-card">
        ${cert ? `<div class="fim-cert-ribbon">${emblemSvg(cert.emblem)}<span>Brevet décerné : <b>${esc(cert.title)}</b> · mention ${esc(certMention(e))}</span><button class="btn small" type="button" data-diploma="${esc(e.id)}" style="background:#D4AF55; border-color:#D4AF55; white-space:nowrap;">Voir le diplôme</button></div>` : ''}
        <div class="fim-eval-card-top">
          <span class="fim-score" style="color:${pctColor(e.percent)}; text-align:left; min-width:0;">${esc(pctInScale(g.scale, e.percent))}</span>
          <span style="font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint);">${fmtPct(e.percent)}</span>
          ${pill(v)} ${e.recommendation && e.recommendation !== 'aucune' ? pill(r) : ''}
          <span class="fim-pill">${esc(g.name)}</span>
          <span class="fim-pill">${esc(CONTEXT_LABELS[e.context] || e.context)}</span>
          <span class="post-card-meta" style="margin-left:auto;">${esc(e.evaluatorName)} · ${fmtDate(e.createdAt)}</span>
        </div>
        <div class="fim-mini-scores">${g.criteria.map((c) => `<span>${esc(c.label)}${c.weight !== 1 ? ` ×${fr(c.weight, 2)}` : ''} <b style="color:${pctColor(rawPercent(g.scale, e.scores?.[c.id]))}">${esc(rawLabel(g.scale, e.scores?.[c.id]))}</b></span>`).join('')}</div>
        ${e.strengths || e.improvements ? `<div class="fim-eval-text">${e.strengths ? `<strong>POINTS FORTS</strong>${esc(e.strengths)}` : ''}${e.improvements ? `<strong>AXES DE PROGRÈS</strong>${esc(e.improvements)}` : ''}</div>` : ''}
        ${canDelete ? `<div class="sci-card-actions"><button class="btn danger small" data-eval-del="${esc(e.id)}">Supprimer</button></div>` : ''}
      </div>`;
  }

  // En-tête de profil : radar + barres pour UNE grille, moyenne globale en %.
  function profileBlock(name, unitId, evals, gridView, color, gridChoices, tags) {
    const overall = avgOf(evals.map((e) => e.percent).filter((v) => v != null));
    const scoped = gridView ? evals.filter((e) => e.gridId === gridView.id) : [];
    const avg = gridView ? criteriaAverages(gridView, scoped) : {};
    const last = evals[0];
    const promo = evals.filter((e) => e.recommendation === 'promotion').length;
    return `
      <div class="fim-eval-head">
        ${gridView && gridView.criteria.length >= 3 ? radar(gridView.criteria, avg, color) : `<div style="text-align:center; font-size:12px; color:var(--ink-faint);">${gridView ? 'Radar disponible à partir de 3 critères.' : 'Aucune évaluation.'}</div>`}
        <div>
          <div class="fim-hero-eyebrow" style="color:${color}">${esc([unitId ? unitLabel(unitId) : '', ...(tags || []).filter((t) => t !== 'FIM')].filter(Boolean).join(' · ') || 'Unité non renseignée')}</div>
          <h3 style="font-family:'Space Grotesk', sans-serif; font-size:21px; margin:4px 0 12px;">${esc(name)}</h3>
          <div class="fim-facts" style="margin-bottom:14px;">
            <div class="fim-fact"><b>Moyenne générale</b><span style="color:${pctColor(overall)}; font-weight:700;">${fmtPct(overall)}</span></div>
            <div class="fim-fact"><b>Évaluations</b><span>${evals.length}</span></div>
            <div class="fim-fact"><b>Dernier avis</b><span>${last ? esc((VERDICT_META[last.verdict] || {}).label || '—') : '—'}</span></div>
            <div class="fim-fact"><b>Propositions promo</b><span>${promo}</span></div>
          </div>
          ${medalsRow(evals)}
          ${gridView ? `
            ${gridChoices.length > 1 ? `<div class="field-row" style="margin-bottom:10px;"><label>Détail par grille</label><select id="fim-profile-grid">${gridChoices.map((g) => `<option value="${esc(g.id)}"${g.id === gridView.id ? ' selected' : ''}>${esc(g.name)} (${evals.filter((e) => e.gridId === g.id).length})</option>`).join('')}</select></div>` : `<div class="post-card-meta" style="margin-bottom:10px;">Grille : ${esc(gridView.name)} · ${scoped.length} évaluation(s)</div>`}
            <div class="fim-bars">${gridView.criteria.map((c) => `<div class="fim-bar-row"><span>${esc(c.label)}</span><div class="fim-bar"><i style="width:${avg[c.id] || 0}%; --c:${pctColor(avg[c.id])}"></i></div><b>${esc(pctInScale(gridView.scale, avg[c.id]))}</b></div>`).join('')}</div>` : ''}
        </div>
      </div>
      ${evolutionBlock(evals)}`;
  }

  // Grilles connues d'une liste d'évaluations (copies figées dans chaque évaluation).
  function gridsFromEvals(evals) {
    const map = new Map();
    evals.forEach((e) => { if (!map.has(e.gridId)) map.set(e.gridId, { id: e.gridId, ...e.grid }); });
    return [...map.values()];
  }

  let evalSelected = null;
  let evalFormOpen = false;
  let evalView = 'people';
  let evalTag = 'TOUS';
  let evalGridView = {};
  let gridEditing = null;

  async function loadEvaluations(deptId) {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let data;
    let grids = [];
    let agents = [];
    let extra = { roles: [], people: [] };
    let proposals = [];
    try {
      const [d, g, dept] = await Promise.all([
        window.apiFetch('/api/rp/fim/evaluations'),
        window.apiFetch('/api/rp/fim/eval-grids').catch(() => ({ grids: [] })),
        window.apiFetch(`/api/rp/depts/${encodeURIComponent(deptId)}`).catch(() => null),
        loadRoleMembers(),
      ]);
      data = d;
      grids = g.grids || [];
      if (data.canEvaluate) {
        [extra, proposals] = await Promise.all([
          window.apiFetch('/api/rp/fim/evaluables').catch(() => extra),
          window.apiFetch('/api/rp/fim/eri-proposals').then((r) => r.proposals || []).catch(() => []),
        ]);
      }
      agents = (dept?.dept?.agents || []).filter((a) => (a.status || 'actif') === 'actif');
    } catch (err) {
      main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    const evaluations = data.evaluations || [];

    // Vue opérateur : ses propres évaluations uniquement.
    if (!data.canEvaluate) {
      const me = agents.find((a) => norm(a.name || a.username) === norm(data.self));
      const unitId = me ? unitFromAgent(me) : null;
      const color = unitId ? unitColor(unitId) : '#6E76FF';
      const choices = gridsFromEvals(evaluations);
      const render = () => {
        const gv = choices.find((g) => g.id === evalGridView.self) || choices[0] || null;
        setSide([[String(evaluations.length), 'Évaluations'], [fmtPct(avgOf(evaluations.map((e) => e.percent).filter((v) => v != null))), 'Moyenne']], evaluations.slice(0, 4).map((e) => [new Date(e.createdAt).toLocaleDateString('fr-FR'), (VERDICT_META[e.verdict] || {}).label || '']));
        main.innerHTML = `
          <div class="fim-hero">
            <div class="fim-hero-eyebrow">Dossier personnel · lecture seule</div>
            <h2>Mes évaluations</h2>
            <p>Les évaluations rédigées par tes officiers après les opérations, exercices et revues périodiques. Seul le commandement peut en rédiger.</p>
          </div>
          <div class="fim-eval-profile" style="--u:${color}">
            <div style="display:flex; justify-content:flex-end; margin:-8px 0 6px;"><button class="btn ghost small" id="fim-export-btn" type="button">Exporter ma fiche</button></div>
            ${profileBlock(data.self || '—', unitId, evaluations, gv, color, choices)}
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 12px;">Historique</h3>
            ${evaluations.length ? evaluations.map((e) => evalCard(e, false)).join('') : '<div class="empty-row">Aucune évaluation pour le moment.</div>'}
          </div>`;
        document.getElementById('fim-profile-grid')?.addEventListener('change', (ev) => { evalGridView.self = ev.target.value; render(); });
        document.getElementById('fim-export-btn').addEventListener('click', () => exportFiche({ name: data.self, unit: unitId, tags: [] }, evaluations, null, []));
      };
      render();
      return;
    }

    main.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Commandement FIM · réservé aux officiers</div>
        <h2>Évaluation des opérateurs</h2>
        <p>Note les opérateurs avec la grille de ton choix. Chaque grille définit ses critères, leurs coefficients, son barème (1 à 5, sur 20, lettres, acquis / non acquis…) et les seuils de l'avis automatique. Les moyennes entre grilles sont ramenées en pourcentage.</p>
      </div>
      <div class="fim-subnav">
        <button type="button" data-ev-view="people" class="${evalView === 'people' ? 'active' : ''}">Opérateurs</button>
        <button type="button" data-ev-view="grids" class="${evalView === 'grids' ? 'active' : ''}">Grilles & barèmes (${grids.filter((g) => !g.archived).length})</button>
      </div>
      <div id="fim-eval-body"></div>`;
    main.querySelectorAll('[data-ev-view]').forEach((b) => b.addEventListener('click', () => {
      evalView = b.dataset.evView;
      gridEditing = null;
      loadEvaluations(deptId);
    }));
    const body = document.getElementById('fim-eval-body');
    if (evalView === 'grids') renderGrids(body, grids, evaluations, deptId);
    else renderPeople(body, data, grids, evaluations, agents, extra, proposals, deptId);
  }

  // ---------------- Vue officier : opérateurs ----------------
  function renderPeople(body, data, grids, evaluations, agents, extra, proposals, deptId) {
    const people = new Map();
    agents.forEach((a) => {
      const name = a.name || a.username;
      const member = roleMemberOf(a);
      if (name) people.set(norm(name), { name, unit: unitFromAgent(a), evals: [], tags: ['FIM'], username: a.username, discordId: member?.discordId, discordName: member?.discordName });
    });
    const keyByUsername = new Map([...people.entries()].filter(([, p]) => p.username).map(([k, p]) => [norm(p.username), k]));
    // Membres des rôles Discord évaluables (ex : ERI), qu'ils soient FIM ou non.
    (extra.people || []).forEach((x) => {
      const key = (x.robloxUsername && keyByUsername.get(norm(x.robloxUsername))) || norm(x.name);
      if (!key) return;
      const existing = people.get(key);
      if (existing) {
        existing.tags = [...new Set([...existing.tags, ...x.roles])];
        existing.discordId = x.discordId;
        existing.discordName = existing.discordName || x.discordName;
        existing.unit = x.unit || existing.unit;
      } else people.set(key, { name: x.name, unit: x.unit || (x.deptId === 'fim_mmqbs55q2vge' ? unitFromAgent(x) : null), evals: [], tags: x.roles, discordName: x.discordName, discordId: x.discordId });
    });
    // Une évaluation suit la personne par son ID Discord si connu (le nom RP
    // peut changer), sinon par nom RP ou pseudo Discord.
    const keyByDiscord = new Map([...people.entries()].filter(([, p]) => p.discordId).map(([k, p]) => [p.discordId, k]));
    const keyByDiscordName = new Map([...people.entries()].filter(([, p]) => p.discordName).map(([k, p]) => [norm(p.discordName), k]));
    evaluations.forEach((e) => {
      const key = (e.agentDiscordId && keyByDiscord.get(e.agentDiscordId))
        || (people.has(norm(e.agentName)) ? norm(e.agentName) : keyByDiscordName.get(norm(e.agentName)) || norm(e.agentName));
      if (!people.has(key)) people.set(key, { name: e.agentName, unit: e.unit !== 'INTER-UNITÉS' ? e.unit : null, evals: [], tags: [], former: true });
      people.get(key).evals.push(e);
    });
    const list = [...people.values()].sort((a, b) => (a.former ? 1 : 0) - (b.former ? 1 : 0) || a.name.localeCompare(b.name, 'fr'));
    const pending = list.filter((p) => !p.former && !p.evals.length).length;
    const promos = list.filter((p) => p.evals[0]?.recommendation === 'promotion');
    setSide(
      [[fmtPct(avgOf(evaluations.map((e) => e.percent).filter((v) => v != null))), 'Moyenne FIM'], [String(pending), 'Jamais évalués']],
      promos.length ? promos.slice(0, 5).map((p) => ['PROMO', p.name]) : evaluations.slice(0, 4).map((e) => [new Date(e.createdAt).toLocaleDateString('fr-FR'), e.agentName])
    );
    if (!evalSelected || !people.has(norm(evalSelected))) evalSelected = list[0]?.name || null;
    const activeGrids = grids.filter((g) => !g.archived);

    body.innerHTML = `
      <div class="fim-eval-layout">
        <div class="fim-eval-list">
          <input type="text" id="fim-eval-search" placeholder="Rechercher un opérateur ou une unité…">
          ${(extra.roles || []).length ? `<div class="fim-subnav" style="margin:0 0 8px;">${['TOUS', 'FIM', ...extra.roles].map((t) => `<button type="button" data-tag="${esc(t)}" class="${t === evalTag ? 'active' : ''}" style="padding:7px 10px;">${esc(t === 'TOUS' ? 'Tous' : t)} (${t === 'TOUS' ? list.length : list.filter((p) => p.tags.includes(t)).length})</button>`).join('')}</div>` : ''}
          <div class="fim-eval-items" id="fim-eval-items"></div>
        </div>
        <div class="fim-eval-profile" id="fim-eval-profile"></div>
      </div>`;

    let filter = '';
    const renderList = () => {
      const box = document.getElementById('fim-eval-items');
      const shown = list.filter((p) => (evalTag === 'TOUS' || p.tags.includes(evalTag)) && (!filter || norm(p.name).includes(filter) || norm(p.discordName).includes(filter) || (p.unit && norm(unitLabel(p.unit)).includes(filter))));
      box.innerHTML = shown.length ? shown.map((p) => {
        const avg = avgOf(p.evals.map((e) => e.percent).filter((v) => v != null));
        return `<button class="fim-eval-item${norm(p.name) === norm(evalSelected) ? ' active' : ''}" style="--u:${p.unit ? unitColor(p.unit) : 'var(--accent)'}" data-person="${esc(p.name)}" type="button">
          <span class="nm">${esc(p.name)}<span class="sub">${esc(p.unit ? unitLabel(p.unit) : p.tags.filter((t) => t !== 'FIM').join(' · ') || 'Sans unité')}${p.unit && p.tags.some((t) => t !== 'FIM') ? ` · ${esc(p.tags.filter((t) => t !== 'FIM').join(' · '))}` : ''}${p.former ? ' · hors effectif' : ''} · ${p.evals.length} éval.</span></span>
          <span class="fim-score" style="color:${pctColor(avg)}">${avg == null ? '—' : `${fr(avg, 0)}%`}${trendBadge(p.evals)}</span>
        </button>`;
      }).join('') : '<div class="empty-row">Aucun opérateur.</div>';
      box.querySelectorAll('[data-person]').forEach((b) => b.addEventListener('click', () => {
        evalSelected = b.dataset.person;
        evalFormOpen = false;
        renderList();
        renderProfile();
      }));
    };

    const renderProfile = () => {
      const box = document.getElementById('fim-eval-profile');
      const p = people.get(norm(evalSelected));
      if (!p) { box.innerHTML = '<div class="wiki-empty"><div class="wiki-empty-title">Évaluations</div><p>Aucun opérateur FIM dans le roster.</p></div>'; return; }
      const color = p.unit ? unitColor(p.unit) : '#6E76FF';
      const isSelf = norm(p.name) === norm(data.self);
      const choices = gridsFromEvals(p.evals);
      const gv = choices.find((g) => g.id === evalGridView[norm(p.name)]) || choices[0] || null;
      box.style.setProperty('--u', color);
      const personProposals = proposals.filter((x) => (p.discordId && x.agentDiscordId === p.discordId) || norm(x.agentName) === norm(p.name));
      const status = pathwayOf(grids, p.evals);
      const showPath = p.tags.some((t) => t !== 'FIM') || personProposals.length || status.modules.some((m) => m.attempts);
      box.innerHTML = `
        <div style="display:flex; justify-content:flex-end; margin:-8px 0 6px;"><button class="btn ghost small" id="fim-export-btn" type="button">Exporter la fiche</button></div>
        ${p.discordName && norm(p.discordName) !== norm(p.name) ? `<div class="post-card-meta" style="margin:-4px 0 6px;">Discord : ${esc(p.discordName)}</div>` : ''}
        ${profileBlock(p.name, p.unit, p.evals, gv, color, choices, p.tags)}
        ${showPath ? pathwayBlock(status, personProposals, { canPropose: true }) : ''}
        <div style="display:flex; justify-content:space-between; align-items:center; margin:22px 0 12px; gap:10px; flex-wrap:wrap;">
          <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px;">${evalFormOpen ? 'Nouvelle évaluation' : 'Historique'}</h3>
          ${isSelf ? '<span class="post-card-meta">Auto-évaluation impossible</span>' : `<button class="btn small${evalFormOpen ? ' ghost' : ''}" id="fim-eval-toggle" type="button">${evalFormOpen ? 'Annuler' : '+ Évaluer'}</button>`}
        </div>
        <div id="fim-eval-zone">${evalFormOpen && !isSelf ? '' : (p.evals.length ? p.evals.map((e) => evalCard(e, true)).join('') : '<div class="empty-row">Jamais évalué.</div>')}</div>
      `;
      document.getElementById('fim-profile-grid')?.addEventListener('change', (ev) => { evalGridView[norm(p.name)] = ev.target.value; renderProfile(); });
      document.getElementById('fim-eval-toggle')?.addEventListener('click', () => { evalFormOpen = !evalFormOpen; renderProfile(); });
      document.getElementById('fim-export-btn').addEventListener('click', () => exportFiche(p, p.evals, status.total ? status : null, personProposals));
      bindPathway(box, p, () => loadEvaluations(deptId));
      box.querySelectorAll('[data-eval-del]').forEach((b) => b.addEventListener('click', async () => {
        if (!confirm('Supprimer cette évaluation ?')) return;
        try {
          await window.apiFetch(`/api/rp/fim/evaluations/${encodeURIComponent(b.dataset.evalDel)}`, { method: 'DELETE' });
          window.showToast('Évaluation supprimée.', 'success');
          loadEvaluations(deptId);
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      }));
      if (evalFormOpen && !isSelf) renderEvalForm(document.getElementById('fim-eval-zone'), p, activeGrids, deptId);
    };

    document.getElementById('fim-eval-search').addEventListener('input', (e) => { filter = norm(e.target.value); renderList(); });
    body.querySelectorAll('[data-tag]').forEach((b) => b.addEventListener('click', () => {
      evalTag = b.dataset.tag;
      body.querySelectorAll('[data-tag]').forEach((x) => x.classList.toggle('active', x === b));
      renderList();
    }));
    renderList();
    renderProfile();
  }

  // ---------------- Formulaire de notation ----------------
  let lastGridId = 'standard';
  function renderEvalForm(zone, p, grids, deptId) {
    if (!grids.length) { zone.innerHTML = '<div class="empty-row">Aucune grille active. Crée-en une dans « Grilles & barèmes ».</div>'; return; }
    let grid = grids.find((g) => g.id === lastGridId) || grids[0];
    const scores = {};

    const scoreInput = (c) => {
      const s = grid.scale;
      if (s.kind === 'levels') {
        return `<div class="fim-rate" data-crit="${esc(c.id)}">${s.levels.map((l, i) => `<button type="button" data-v="${i}" style="--c:${pctColor(l.value)}">${esc(l.label)}</button>`).join('')}</div>`;
      }
      const count = Math.round((s.max - s.min) / s.step) + 1;
      if (count <= 11) {
        const vals = Array.from({ length: count }, (_, i) => Math.round((s.min + i * s.step) * 1000) / 1000);
        return `<div class="fim-rate" data-crit="${esc(c.id)}">${vals.map((v) => `<button type="button" data-v="${v}" style="--c:${pctColor(rawPercent(s, v))}">${esc(fr(v, 2))}</button>`).join('')}</div>`;
      }
      return `<div class="fim-num" data-crit="${esc(c.id)}"><input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.min}"><input type="number" min="${s.min}" max="${s.max}" step="${s.step}" placeholder="—"><span>/ ${esc(fr(s.max, 2))}</span></div>`;
    };

    const updateTotal = () => {
      const p100 = gridPercent(grid, scores);
      const done = grid.criteria.filter((c) => scores[c.id] !== undefined).length;
      const auto = p100 == null ? null : verdictFor(grid, p100);
      document.getElementById('fim-eval-total').innerHTML = `
        <span>Note</span><b style="color:${pctColor(p100)}">${esc(pctInScale(grid.scale, p100))}</b>
        <span>${fmtPct(p100)}</span>
        <span>· ${done}/${grid.criteria.length} critères</span>
        ${auto ? `<span>· avis automatique :</span> ${pill(VERDICT_META[auto])}` : ''}`;
    };

    const render = () => {
      Object.keys(scores).forEach((k) => delete scores[k]);
      const t = grid.thresholds;
      zone.innerHTML = `
        <form id="fim-eval-form">
          <div class="field-grid">
            <div class="field-row"><label>Grille d'évaluation</label><select id="ev-grid">${grids.map((g) => `<option value="${esc(g.id)}"${g.id === grid.id ? ' selected' : ''}>${esc(g.name)}</option>`).join('')}</select></div>
            <div class="field-row"><label>Contexte</label><select id="ev-context">${Object.entries(CONTEXT_LABELS).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></div>
          </div>
          <div class="post-card-meta" style="margin:-4px 0 6px;">Barème : ${esc(scaleSummary(grid.scale))} · Excellent ≥ ${t.excellent} % · Conforme ≥ ${t.conforme} % · À améliorer ≥ ${t.a_ameliorer} %${grid.description ? ` — ${esc(grid.description)}` : ''}</div>
          <div style="margin:4px 0 0;">
            ${grid.criteria.map((c) => `
              <div class="fim-crit-row">
                <div><div class="t">${esc(c.label)}${c.weight !== 1 ? `<span class="w">coef. ${esc(fr(c.weight, 2))}</span>` : ''}</div>${c.hint ? `<div class="h">${esc(c.hint)}</div>` : ''}</div>
                ${scoreInput(c)}
              </div>`).join('')}
          </div>
          <div class="fim-total" id="fim-eval-total"></div>
          <div class="field-grid">
            <div class="field-row"><label>Unité</label><select id="ev-unit">${UNIT_OPTIONS.map((u) => `<option value="${u}"${p.unit === u ? ' selected' : ''}>${esc(unitLabel(u))}</option>`).join('')}</select></div>
            <div class="field-row"><label>Avis général</label><select id="ev-verdict"><option value="auto">Automatique (selon les seuils)</option>${Object.entries(VERDICT_META).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Recommandation</label><select id="ev-reco">${Object.entries(RECO_META).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}</select></div>
          </div>
          <div class="field-row"><label>Points forts</label><textarea id="ev-strengths" rows="3" maxlength="1500"></textarea></div>
          <div class="field-row"><label>Axes de progrès</label><textarea id="ev-improvements" rows="3" maxlength="1500"></textarea></div>
          <button class="btn" type="submit">Enregistrer l'évaluation</button>
        </form>`;
      updateTotal();

      document.getElementById('ev-grid').addEventListener('change', (e) => {
        grid = grids.find((g) => g.id === e.target.value) || grid;
        lastGridId = grid.id;
        render();
      });
      zone.querySelectorAll('.fim-rate').forEach((group) => {
        group.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
          const v = Number(b.dataset.v);
          scores[group.dataset.crit] = v;
          if (grid.scale.kind === 'levels') group.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
          else group.querySelectorAll('button').forEach((x) => x.classList.toggle('on', Number(x.dataset.v) <= v));
          updateTotal();
        }));
      });
      zone.querySelectorAll('.fim-num').forEach((box) => {
        const [slider, input] = box.querySelectorAll('input');
        const set = (v) => {
          if (v === '' || !Number.isFinite(Number(v))) { delete scores[box.dataset.crit]; updateTotal(); return; }
          const s = grid.scale;
          const n = Math.min(s.max, Math.max(s.min, Number(v)));
          scores[box.dataset.crit] = n;
          slider.value = n;
          updateTotal();
        };
        slider.addEventListener('input', () => { input.value = slider.value; set(slider.value); });
        input.addEventListener('input', () => set(input.value));
      });
      document.getElementById('fim-eval-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const missing = grid.criteria.filter((c) => scores[c.id] === undefined);
        if (missing.length) { window.showToast(`Note manquante : ${missing.map((c) => c.label).join(', ')}.`, 'error'); return; }
        const v = (id) => document.getElementById(id).value.trim();
        const payload = { agentName: p.name, agentDiscordId: p.discordId || null, gridId: grid.id, unit: v('ev-unit'), context: v('ev-context'), scores, verdict: v('ev-verdict'), recommendation: v('ev-reco'), strengths: v('ev-strengths'), improvements: v('ev-improvements') };
        try {
          await window.apiFetch('/api/rp/fim/evaluations', { method: 'POST', body: JSON.stringify(payload) });
          window.showToast(`Évaluation de ${p.name} enregistrée.`, 'success');
          evalFormOpen = false;
          loadEvaluations(deptId);
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      });
    };
    render();
  }

  // ---------------- Vue officier : grilles & barèmes ----------------
  function renderGrids(body, grids, evaluations, deptId) {
    const uses = (id) => evaluations.filter((e) => e.gridId === id).length;
    setSide([[String(grids.filter((g) => !g.archived).length), 'Grilles actives'], [String(evaluations.length), 'Évaluations']], grids.slice(0, 5).map((g) => [`${uses(g.id)}×`, g.name]));
    if (gridEditing) { renderGridEditor(body, gridEditing, deptId); return; }

    body.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:10px; flex-wrap:wrap;">
        <p style="font-size:12.5px; color:var(--ink-dim); max-width:620px; line-height:1.6;">Une grille = des critères avec coefficient, un barème et des seuils d'avis. Modifier une grille ne change pas les évaluations déjà rendues : elles gardent la version utilisée.</p>
        <span style="display:flex; gap:8px;">${grids.some((g) => g.pathway && !g.archived) ? '' : '<button class="btn ghost small" id="fim-grid-template" type="button">Créer le parcours ERI type</button>'}<button class="btn small" id="fim-grid-new" type="button">+ Nouvelle grille</button></span>
      </div>
      <div class="fim-grid">
        ${grids.map((g) => `
          <div class="fim-grid-card${g.archived ? ' archived' : ''}">
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <h4 style="margin-right:auto;">${esc(g.name)}</h4>
              ${g.builtin ? '<span class="fim-pill" style="--c:var(--accent-2)">Par défaut</span>' : ''}
              ${g.pathway ? '<span class="fim-pill" style="--c:#B07CFF">Parcours ERI</span>' : ''}
              ${g.certificate?.enabled ? `<span class="fim-pill" style="--c:#D4AF55">🎖 ${esc(g.certificate.title)}</span>` : ''}
              ${g.archived ? '<span class="fim-pill">Archivée</span>' : ''}
            </div>
            ${g.description ? `<p>${esc(g.description)}</p>` : ''}
            <div class="fim-op-meta" style="margin:0;"><span>Barème <b>${esc(scaleSummary(g.scale))}</b></span><span>Utilisée <b>${uses(g.id)}×</b></span></div>
            <div class="fim-grid-crits">${g.criteria.map((c) => `<span class="fim-chip">${esc(c.label)}${c.weight !== 1 ? ` ×${esc(fr(c.weight, 2))}` : ''}</span>`).join('')}</div>
            <div class="fim-zones" title="Seuils de l'avis automatique">${zonesBar(g.thresholds)}</div>
            <div class="sci-card-actions" style="margin-top:4px;">
              ${g.builtin ? '' : `<button class="btn ghost small" data-grid-edit="${esc(g.id)}">Modifier</button>`}
              <button class="btn ghost small" data-grid-dup="${esc(g.id)}">Dupliquer</button>
              ${g.builtin ? '' : `<button class="btn danger small" data-grid-arch="${esc(g.id)}" data-arch="${g.archived ? '0' : '1'}">${g.archived ? 'Restaurer' : 'Archiver'}</button>`}
            </div>
          </div>`).join('')}
      </div>`;

    const byId = (id) => grids.find((g) => g.id === id);
    document.getElementById('fim-grid-template')?.addEventListener('click', async () => {
      if (!confirm("Créer les 4 grilles du parcours d'intégration ERI (radio, RDE, tir, reconfinement) ? Tu pourras les modifier ensuite.")) return;
      try {
        await window.apiFetch('/api/rp/fim/eval-grids/pathway-template', { method: 'POST', body: '{}' });
        window.showToast('Parcours ERI créé.', 'success');
        loadEvaluations(deptId);
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
    document.getElementById('fim-grid-new').addEventListener('click', () => {
      gridEditing = { id: null, name: '', description: '', scale: { kind: 'range', min: 0, max: 20, step: 0.5 }, criteria: [{ id: '', label: '', hint: '', weight: 1 }], thresholds: { excellent: 80, conforme: 55, a_ameliorer: 35 } };
      renderGrids(body, grids, evaluations, deptId);
    });
    body.querySelectorAll('[data-grid-edit]').forEach((b) => b.addEventListener('click', () => {
      gridEditing = JSON.parse(JSON.stringify(byId(b.dataset.gridEdit)));
      renderGrids(body, grids, evaluations, deptId);
    }));
    body.querySelectorAll('[data-grid-dup]').forEach((b) => b.addEventListener('click', () => {
      const src = JSON.parse(JSON.stringify(byId(b.dataset.gridDup)));
      gridEditing = { ...src, id: null, name: `${src.name} (copie)`.slice(0, 60), builtin: false, archived: false };
      renderGrids(body, grids, evaluations, deptId);
    }));
    body.querySelectorAll('[data-grid-arch]').forEach((b) => b.addEventListener('click', async () => {
      const archived = b.dataset.arch === '1';
      if (archived && !confirm("Archiver cette grille ? Elle ne sera plus proposée pour noter, l'historique est conservé.")) return;
      try {
        await window.apiFetch(`/api/rp/fim/eval-grids/${encodeURIComponent(b.dataset.gridArch)}`, { method: 'PATCH', body: JSON.stringify({ archived }) });
        window.showToast(archived ? 'Grille archivée.' : 'Grille restaurée.', 'success');
        loadEvaluations(deptId);
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
  }

  function zonesBar(t) {
    return `<i style="width:${t.a_ameliorer}%; background:#F0525A"></i><i style="width:${t.conforme - t.a_ameliorer}%; background:#F0A83C"></i><i style="width:${t.excellent - t.conforme}%; background:#5AA9FF"></i><i style="width:${100 - t.excellent}%; background:#4FD895"></i>`;
  }

  function presetIdFor(scale) {
    const same = SCALE_PRESETS.find((p) => p.scale && JSON.stringify(p.scale) === JSON.stringify(scale));
    if (same) return same.id;
    return scale.kind === 'levels' ? 'custom-levels' : 'custom-range';
  }

  function renderGridEditor(body, g, deptId) {
    if (!g.scaleMode) g.scaleMode = presetIdFor(g.scale);
    const preset = g.scaleMode;
    const t = g.thresholds;
    const isCustomRange = preset === 'custom-range';
    const isLevels = g.scale.kind === 'levels';
    body.innerHTML = `
      <div class="subsection" style="margin-top:0;">
        <h3>${g.id ? `Modifier « ${esc(g.name)} »` : 'Nouvelle grille d\'évaluation'}</h3>
        <div class="field-grid">
          <div class="field-row"><label>Nom *</label><input id="ge-name" maxlength="60" value="${esc(g.name)}" placeholder="Ex : Qualification tir Nu-7"></div>
          <div class="field-row"><label>Description</label><input id="ge-desc" maxlength="300" value="${esc(g.description || '')}" placeholder="À quoi sert cette grille"></div>
        </div>
        <label style="display:flex; align-items:center; gap:8px; text-transform:none; letter-spacing:0; font-family:'Inter', sans-serif; font-size:12.5px; color:var(--ink-dim); cursor:pointer;"><input type="checkbox" id="ge-pathway" style="width:auto;"${g.pathway ? ' checked' : ''}> Module du parcours d'intégration ERI (validé quand une évaluation atteint le seuil « Conforme »)</label>

        <div class="fim-editor-section" style="color:#E8C874; border-left-color:#D4AF55;">Brevet</div>
        <label style="display:flex; align-items:center; gap:8px; text-transform:none; letter-spacing:0; font-family:'Inter', sans-serif; font-size:12.5px; color:var(--ink-dim); cursor:pointer; margin-bottom:10px;"><input type="checkbox" id="ge-cert" style="width:auto;"${g.certificate?.enabled ? ' checked' : ''}> Cette grille délivre un brevet : un diplôme est décerné quand l'évaluation atteint le seuil « Conforme »</label>
        <div id="ge-cert-box" style="${g.certificate?.enabled ? '' : 'display:none;'}">
          <div class="field-row"><label>Intitulé du brevet</label><input id="ge-cert-title" maxlength="80" value="${esc(g.certificate?.title || g.name || '')}" placeholder="Ex : Brevet de tireur d'élite"></div>
          <label>Emblème</label>
          <div class="fim-emblems" id="ge-emblems">${Object.entries(EMBLEMS).map(([k, em]) => `<button type="button" data-emblem="${k}" class="${(g.certificate?.emblem || 'etoile') === k ? 'on' : ''}">${emblemSvg(k)}${esc(em.label)}</button>`).join('')}</div>
        </div>

        <div class="fim-editor-section">Barème</div>
        <div class="field-grid">
          <div class="field-row"><label>Type de notes</label><select id="ge-preset">${SCALE_PRESETS.map((p) => `<option value="${p.id}"${p.id === preset ? ' selected' : ''}>${esc(p.label)}</option>`).join('')}</select></div>
          ${isCustomRange ? `
            <div class="field-row"><label>Minimum · maximum · pas</label><div style="display:flex; gap:6px;">
              <input id="ge-min" type="number" step="any" value="${g.scale.min}"><input id="ge-max" type="number" step="any" value="${g.scale.max}"><input id="ge-step" type="number" step="any" min="0.01" value="${g.scale.step}">
            </div></div>` : '<div></div>'}
        </div>
        ${isLevels ? `
          <div class="post-card-meta" style="margin-bottom:8px;">Chaque niveau vaut un pourcentage de réussite (100 % = parfait).</div>
          <div id="ge-levels">${g.scale.levels.map((l, i) => `
            <div class="fim-editor-row levels" data-level="${i}">
              <input data-f="label" maxlength="20" value="${esc(l.label)}" placeholder="Libellé">
              <input data-f="value" type="number" min="0" max="100" value="${l.value}" title="Valeur en %">
              <div class="fim-icon-btns"><button type="button" data-lv-del="${i}" title="Retirer"${g.scale.levels.length <= 2 ? ' disabled' : ''}>✕</button></div>
            </div>`).join('')}</div>
          ${g.scale.levels.length < 10 ? '<button class="btn ghost small" type="button" id="ge-level-add">+ Ajouter un niveau</button>' : ''}` : ''}

        <div class="fim-editor-section">Critères (${g.criteria.length}/15)</div>
        <div class="fim-editor-row" style="margin-bottom:4px;"><label style="margin:0;">Critère</label><label style="margin:0;">Description</label><label style="margin:0;">Coef.</label><span></span></div>
        <div id="ge-criteria">${g.criteria.map((c, i) => `
          <div class="fim-editor-row" data-crit="${i}">
            <input data-f="label" maxlength="40" value="${esc(c.label)}" placeholder="Ex : Précision">
            <input data-f="hint" maxlength="160" value="${esc(c.hint || '')}" placeholder="Ce qu'on observe">
            <input data-f="weight" type="number" min="0.1" max="10" step="0.5" value="${c.weight}">
            <div class="fim-icon-btns">
              <button type="button" data-cr-up="${i}" title="Monter"${i === 0 ? ' disabled' : ''}>▲</button>
              <button type="button" data-cr-down="${i}" title="Descendre"${i === g.criteria.length - 1 ? ' disabled' : ''}>▼</button>
              <button type="button" data-cr-del="${i}" title="Retirer"${g.criteria.length <= 1 ? ' disabled' : ''}>✕</button>
            </div>
          </div>`).join('')}</div>
        ${g.criteria.length < 15 ? '<button class="btn ghost small" type="button" id="ge-crit-add">+ Ajouter un critère</button>' : ''}

        <div class="fim-editor-section">Seuils de l'avis automatique (en % de la note)</div>
        <div class="field-grid" style="grid-template-columns:repeat(3, 1fr);">
          <div class="field-row"><label style="color:#4FD895">Excellent à partir de</label><input id="ge-t-exc" type="number" min="0" max="100" value="${t.excellent}"></div>
          <div class="field-row"><label style="color:#5AA9FF">Conforme à partir de</label><input id="ge-t-conf" type="number" min="0" max="100" value="${t.conforme}"></div>
          <div class="field-row"><label style="color:#F0A83C">À améliorer à partir de</label><input id="ge-t-amel" type="number" min="0" max="100" value="${t.a_ameliorer}"></div>
        </div>
        <div class="fim-zones" id="ge-zones">${zonesBar(t)}</div>
        <div class="fim-zones-legend"><span>0 %</span><span id="ge-zones-txt"></span><span>100 %</span></div>

        <div style="display:flex; gap:10px; margin-top:22px;">
          <button class="btn" type="button" id="ge-save">${g.id ? 'Enregistrer' : 'Créer la grille'}</button>
          <button class="btn ghost" type="button" id="ge-cancel">Annuler</button>
        </div>
      </div>`;

    // Relit le formulaire dans l'objet en cours d'édition (avant tout re-rendu).
    const collect = () => {
      g.name = document.getElementById('ge-name').value;
      g.description = document.getElementById('ge-desc').value;
      g.pathway = document.getElementById('ge-pathway').checked;
      g.certificate = {
        enabled: document.getElementById('ge-cert').checked,
        title: document.getElementById('ge-cert-title').value,
        emblem: body.querySelector('#ge-emblems .on')?.dataset.emblem || 'etoile',
      };
      if (document.getElementById('ge-min')) {
        g.scale = { kind: 'range', min: Number(document.getElementById('ge-min').value), max: Number(document.getElementById('ge-max').value), step: Number(document.getElementById('ge-step').value) };
      }
      body.querySelectorAll('[data-level]').forEach((row) => {
        const l = g.scale.levels[Number(row.dataset.level)];
        l.label = row.querySelector('[data-f=label]').value;
        l.value = Number(row.querySelector('[data-f=value]').value);
      });
      body.querySelectorAll('[data-crit]').forEach((row) => {
        const c = g.criteria[Number(row.dataset.crit)];
        c.label = row.querySelector('[data-f=label]').value;
        c.hint = row.querySelector('[data-f=hint]').value;
        c.weight = Number(row.querySelector('[data-f=weight]').value) || 1;
      });
      g.thresholds = { excellent: Number(document.getElementById('ge-t-exc').value), conforme: Number(document.getElementById('ge-t-conf').value), a_ameliorer: Number(document.getElementById('ge-t-amel').value) };
    };
    const updateZones = () => {
      const exc = Math.min(100, Math.max(0, Number(document.getElementById('ge-t-exc').value) || 0));
      const conf = Math.min(exc, Math.max(0, Number(document.getElementById('ge-t-conf').value) || 0));
      const amel = Math.min(conf, Math.max(0, Number(document.getElementById('ge-t-amel').value) || 0));
      document.getElementById('ge-zones').innerHTML = zonesBar({ excellent: exc, conforme: conf, a_ameliorer: amel });
      const s = g.scale.kind === 'range' && document.getElementById('ge-min')
        ? { kind: 'range', min: Number(document.getElementById('ge-min').value), max: Number(document.getElementById('ge-max').value) }
        : g.scale;
      document.getElementById('ge-zones-txt').textContent = s.kind === 'range' && s.max > s.min
        ? `Excellent dès ${pctInScale(s, exc)} · Conforme dès ${pctInScale(s, conf)} · À améliorer dès ${pctInScale(s, amel)}`
        : '';
    };
    ['ge-t-exc', 'ge-t-conf', 'ge-t-amel', 'ge-min', 'ge-max'].forEach((id) => document.getElementById(id)?.addEventListener('input', updateZones));
    // Brevet : case, emblème, et « Brevet de… » dans le nom coche la case d'office.
    const certBox = document.getElementById('ge-cert');
    const certTitle = document.getElementById('ge-cert-title');
    let certTitleTouched = !!g.certificate?.title && g.certificate.title !== g.name;
    certBox.addEventListener('change', () => { document.getElementById('ge-cert-box').style.display = certBox.checked ? '' : 'none'; });
    certTitle.addEventListener('input', () => { certTitleTouched = true; });
    document.getElementById('ge-name').addEventListener('input', (ev) => {
      const v = ev.target.value;
      if (!certTitleTouched) certTitle.value = v;
      if (/^\s*brevet\b/i.test(v) && !g.id && !certBox.checked) { certBox.checked = true; certBox.dispatchEvent(new Event('change')); }
    });
    body.querySelectorAll('#ge-emblems [data-emblem]').forEach((b) => b.addEventListener('click', () => {
      body.querySelectorAll('#ge-emblems [data-emblem]').forEach((x) => x.classList.toggle('on', x === b));
    }));
    updateZones();

    document.getElementById('ge-preset').addEventListener('change', (e) => {
      collect();
      const p = SCALE_PRESETS.find((x) => x.id === e.target.value);
      g.scaleMode = p.id;
      if (p.scale) g.scale = JSON.parse(JSON.stringify(p.scale));
      else if (p.id === 'custom-levels') g.scale = g.scale.kind === 'levels' ? g.scale : { kind: 'levels', levels: [{ label: 'Maîtrisé', value: 100 }, { label: 'Partiel', value: 50 }, { label: 'Non maîtrisé', value: 0 }] };
      else if (g.scale.kind !== 'range') g.scale = { kind: 'range', min: 0, max: 50, step: 1 };
      renderGridEditor(body, g, deptId);
    });
    document.getElementById('ge-level-add')?.addEventListener('click', () => { collect(); g.scale.levels.push({ label: '', value: 0 }); renderGridEditor(body, g, deptId); });
    body.querySelectorAll('[data-lv-del]').forEach((b) => b.addEventListener('click', () => { collect(); g.scale.levels.splice(Number(b.dataset.lvDel), 1); renderGridEditor(body, g, deptId); }));
    document.getElementById('ge-crit-add')?.addEventListener('click', () => { collect(); g.criteria.push({ id: '', label: '', hint: '', weight: 1 }); renderGridEditor(body, g, deptId); });
    body.querySelectorAll('[data-cr-del]').forEach((b) => b.addEventListener('click', () => { collect(); g.criteria.splice(Number(b.dataset.crDel), 1); renderGridEditor(body, g, deptId); }));
    const move = (i, d) => { collect(); const [c] = g.criteria.splice(i, 1); g.criteria.splice(i + d, 0, c); renderGridEditor(body, g, deptId); };
    body.querySelectorAll('[data-cr-up]').forEach((b) => b.addEventListener('click', () => move(Number(b.dataset.crUp), -1)));
    body.querySelectorAll('[data-cr-down]').forEach((b) => b.addEventListener('click', () => move(Number(b.dataset.crDown), 1)));
    document.getElementById('ge-cancel').addEventListener('click', () => { gridEditing = null; loadEvaluations(deptId); });
    document.getElementById('ge-save').addEventListener('click', async () => {
      collect();
      if (!g.name.trim()) { window.showToast('Donne un nom à la grille.', 'error'); return; }
      if (!g.criteria.some((c) => c.label.trim())) { window.showToast('Ajoute au moins un critère.', 'error'); return; }
      if (g.scale.kind === 'range' && !(g.scale.max > g.scale.min)) { window.showToast('Le maximum doit être supérieur au minimum.', 'error'); return; }
      const payload = { name: g.name, description: g.description, pathway: !!g.pathway, certificate: g.certificate, scale: g.scale, criteria: g.criteria, thresholds: g.thresholds };
      try {
        if (g.id) await window.apiFetch(`/api/rp/fim/eval-grids/${encodeURIComponent(g.id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
        else await window.apiFetch('/api/rp/fim/eval-grids', { method: 'POST', body: JSON.stringify(payload) });
        window.showToast(g.id ? 'Grille enregistrée.' : 'Grille créée.', 'success');
        gridEditing = null;
        loadEvaluations(deptId);
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Brevets : grilles qui décernent un diplôme (« Brevet de tireur d'élite »…)
  // ---------------------------------------------------------------
  // Emblèmes en traits, viewBox 0 0 24 24 (mêmes clés que le bot).
  const EMBLEMS = {
    cible: { label: 'Tireur', svg: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>' },
    croix: { label: 'Secours', svg: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>' },
    radio: { label: 'Transmissions', svg: '<rect x="6" y="8" width="12" height="13" rx="1.5"/><path d="M9 8L14 2.5M9 13h6M9 16.5h6"/><circle cx="9" cy="18.8" r=".6" fill="currentColor"/>' },
    explosif: { label: 'Explosifs', svg: '<circle cx="11" cy="14" r="7"/><path d="M15.5 8.5l2-2M17.5 6.5l1.5-1.5M19 5l1.2.3M19 5l-.3-1.2"/><path d="M8 12.5a3.5 3.5 0 0 1 3-2.5"/>' },
    k9: { label: 'Cynophile', svg: '<path d="M5 10l1.5-5 3 3h5l3-3L19 10c0 6-3 10-7 10s-7-4-7-10z"/><circle cx="9.5" cy="12" r=".7" fill="currentColor"/><circle cx="14.5" cy="12" r=".7" fill="currentColor"/><path d="M11 15.5h2l-1 1.2z"/>' },
    bouclier: { label: 'Protection', svg: '<path d="M12 2.5l8 3v6.5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5.5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>' },
    etoile: { label: 'Mérite', svg: '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6-4.9-4.6 6.6-.8z"/>' },
    parachute: { label: 'Aéroporté', svg: '<path d="M3 11a9 9 0 0 1 18 0"/><path d="M3 11c1.5-1.5 3-1.5 4.5 0 1.5-1.5 3-1.5 4.5 0 1.5-1.5 3-1.5 4.5 0 1.5-1.5 3-1.5 4.5 0"/><path d="M3 11l9 8 9-8M7.5 11L12 19l4.5-8M12 11v8"/><rect x="10.5" y="19" width="3" height="3" rx=".5"/>' },
    biohazard: { label: 'NRBC', svg: '<circle cx="12" cy="13" r="2.2"/><path d="M12 3.5a4 4 0 0 0-2.2 7.3M12 3.5a4 4 0 0 1 2.2 7.3M4.5 17.5a4 4 0 0 0 7.4-1M4.5 17.5a4 4 0 0 1 5.3-6.7M19.5 17.5a4 4 0 0 1-7.4-1M19.5 17.5a4 4 0 0 0-5.3-6.7"/>' },
    cle: { label: 'Confinement', svg: '<circle cx="8" cy="12" r="4.5"/><path d="M12.5 12H21M17.5 12v3.5M20.5 12v2.5"/>' },
  };
  const emblemSvg = (key, attrs = '', sw = 1.5) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${attrs}>${(EMBLEMS[key] || EMBLEMS.etoile).svg}</svg>`;

  const brevetStyle = document.createElement('style');
  brevetStyle.textContent = `
  .fim-cert-ribbon{ display:flex; align-items:center; gap:10px; margin:2px 0 10px; padding:8px 12px; border-radius:3px;
    background:linear-gradient(90deg, rgba(212,175,85,0.16), rgba(212,175,85,0.03)); border:1px solid rgba(212,175,85,0.4); color:#E8C874; font-size:12.5px; }
  .fim-cert-ribbon svg{ width:20px; height:20px; flex-shrink:0; }
  .fim-cert-ribbon b{ color:#F3DC9C; }
  .fim-cert-ribbon button{ margin-left:auto; }
  .fim-medals{ display:flex; flex-wrap:wrap; gap:10px; margin:0 0 14px; }
  .fim-medal{ display:flex; align-items:center; gap:9px; padding:6px 12px 6px 6px; border-radius:30px; cursor:pointer; color:var(--ink); font-family:'Inter', sans-serif; font-size:12px;
    background:linear-gradient(135deg, rgba(212,175,85,0.18), rgba(212,175,85,0.05)); border:1px solid rgba(212,175,85,0.45); transition:transform .15s ease, box-shadow .15s ease; }
  .fim-medal:hover{ transform:translateY(-1px); box-shadow:0 6px 18px rgba(212,175,85,0.18); }
  .fim-medal .disc{ width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#3a2a08;
    background:radial-gradient(circle at 35% 30%, #FFF1BE, #E2B851 55%, #9C7520); box-shadow:inset 0 0 0 2px rgba(255,255,255,0.35), 0 1px 3px rgba(0,0,0,0.5); }
  .fim-medal .disc svg{ width:17px; height:17px; }
  .fim-medal small{ display:block; font-family:'JetBrains Mono', monospace; font-size:9px; color:#C9A95A; margin-top:1px; }
  .fim-emblems{ display:flex; flex-wrap:wrap; gap:6px; }
  .fim-emblems button{ display:flex; flex-direction:column; align-items:center; gap:4px; width:78px; padding:8px 4px; border-radius:3px; cursor:pointer;
    background:var(--void-2); border:1px solid var(--line); color:var(--ink-faint); font-family:'JetBrains Mono', monospace; font-size:9px; }
  .fim-emblems button svg{ width:22px; height:22px; }
  .fim-emblems button:hover{ color:var(--ink); border-color:var(--accent); }
  .fim-emblems button.on{ color:#E8C874; border-color:#D4AF55; background:rgba(212,175,85,0.1); }
  `;
  document.head.appendChild(brevetStyle);

  const certOf = (e) => (e.certified && e.grid?.certificate?.enabled ? e.grid.certificate : null);
  const certNumber = (e) => `FIM-${new Date(e.createdAt || Date.now()).getFullYear()}-${String(e.id || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase().padEnd(6, '0')}`;
  function certMention(e) {
    const t = e.grid.thresholds;
    if (e.percent >= t.excellent) return 'Très bien';
    if (e.percent >= (t.excellent + t.conforme) / 2) return 'Bien';
    return 'Assez bien';
  }
  // Brevets obtenus : le plus ancien par intitulé.
  function earnedBrevets(evals) {
    const map = new Map();
    chrono(evals).forEach((e) => {
      const c = certOf(e);
      if (c && !map.has(c.title)) map.set(c.title, e);
    });
    return [...map.values()];
  }
  function medalsRow(evals) {
    const list = earnedBrevets(evals);
    if (!list.length) return '';
    return `<div class="fim-medals">${list.map((e) => {
      const c = certOf(e);
      diplomaRegistry.set(e.id, e);
      return `<button type="button" class="fim-medal" data-diploma="${esc(e.id)}" title="Voir le diplôme"><span class="disc">${emblemSvg(c.emblem)}</span><span>${esc(c.title)}<small>${esc(new Date(e.createdAt).toLocaleDateString('fr-FR'))} · ${esc(certNumber(e))}</small></span></button>`;
    }).join('')}</div>`;
  }

  // Registre des évaluations affichées, pour ouvrir un diplôme depuis un clic.
  const diplomaRegistry = new Map();
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest && ev.target.closest('[data-diploma]');
    if (!btn) return;
    const e = diplomaRegistry.get(btn.dataset.diploma);
    if (e) openDiploma(e);
  });

  function laurel(side) {
    // Branche de laurier qui remonte le long du médaillon : tige en arc +
    // paires de feuilles orientées sur la tangente (angles en degrés, y inversé).
    const R = 82;
    const pt = (deg, r) => [100 + r * Math.cos((deg * Math.PI) / 180), 100 - r * Math.sin((deg * Math.PI) / 180)];
    const [sx, sy] = pt(250, R);
    const [ex, ey] = pt(118, R);
    const parts = [`<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} A${R} ${R} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`];
    for (let k = 0; k < 9; k += 1) {
      const deg = 242 - k * 14;
      const size = 1 - k * 0.045;
      [[R + 7, 25], [R - 7, -25]].forEach(([r, tilt]) => {
        const [cx, cy] = pt(deg, r);
        parts.push(`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(4.2 * size).toFixed(1)}" ry="${(10 * size).toFixed(1)}" transform="rotate(${(-deg + tilt).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`);
      });
    }
    const [tx, ty] = pt(114, R + 2);
    parts.push(`<ellipse cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" rx="3.6" ry="9" transform="rotate(${(-114 + 90).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})"/>`);
    return `<g ${side === 'right' ? 'transform="translate(200 0) scale(-1 1)"' : ''}>${parts.join('')}</g>`;
  }

  function openDiploma(e) {
    const c = certOf(e);
    if (!c) return;
    const raw = String(c.title || '').trim();
    const m = raw.match(/^brevet\s+(.*)$/i);
    const kicker = m ? 'Brevet' : 'Certificat';
    const subtitle = m ? m[1] : raw;
    const date = new Date(e.createdAt || Date.now());
    const dateLong = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const unitName = e.unit && e.unit !== 'INTER-UNITÉS' ? `FIM ${unitLabel(e.unit)}` : "Forces d'Intervention Mobiles";
    const score = pctInScale(e.grid.scale, e.percent);
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>${esc(c.title)} — ${esc(e.agentName)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>
  @page{ size:A4 landscape; margin:0; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  html, body{ background:#2a2b30; }
  body{ font-family:'Cormorant Garamond', Georgia, serif; color:#1d2a44; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .bar{ position:fixed; top:14px; right:16px; display:flex; gap:8px; z-index:5; }
  .bar button{ font:600 13px Inter, Arial, sans-serif; padding:9px 16px; border-radius:3px; border:none; cursor:pointer; background:#6E76FF; color:#fff; }
  .bar button.ghost{ background:#ffffff22; color:#fff; }
  .sheet{ width:297mm; height:210mm; margin:24px auto; position:relative; overflow:hidden;
    background:radial-gradient(ellipse at 50% 40%, #fffaf0 0%, #f7efdc 55%, #eadcb9 100%); box-shadow:0 20px 60px rgba(0,0,0,.55); }
  .sheet::before{ content:''; position:absolute; inset:0; opacity:.35; pointer-events:none;
    background-image:radial-gradient(rgba(120,90,40,.10) 1px, transparent 1px); background-size:3px 3px; }
  .frame{ position:absolute; inset:8mm; border:2.2mm solid #1d2a44; }
  .frame::after{ content:''; position:absolute; inset:2.2mm; border:.5mm solid #b08d3c; }
  .guilloche{ position:absolute; inset:13mm; }
  .inner{ position:absolute; inset:19mm 22mm; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .watermark{ position:absolute; left:50%; top:52%; width:120mm; height:120mm; transform:translate(-50%,-50%); opacity:.06; color:#1d2a44; }
  .org{ font-family:'Cinzel', serif; font-weight:700; letter-spacing:.32em; font-size:11pt; color:#1d2a44; }
  .org small{ display:block; font-weight:500; letter-spacing:.24em; font-size:7.5pt; color:#8a6d2b; margin-top:3px; }
  .medallion{ position:relative; width:34mm; height:34mm; margin:6mm 0 2mm; }
  .medallion svg.laurels{ position:absolute; left:-12mm; top:-12mm; width:58mm; height:58mm; color:#8a6d2b; fill:#a58431; }
  .disc{ position:absolute; inset:0; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2b1f05;
    background:radial-gradient(circle at 35% 30%, #fff3c4, #e2b851 52%, #94701d 100%); box-shadow:inset 0 0 0 1.2mm rgba(255,255,255,.35), inset 0 0 0 1.8mm #8a6d2b, 0 1.5mm 3mm rgba(0,0,0,.25); }
  .disc svg{ width:17mm; height:17mm; }
  .kicker{ font-family:'Cinzel', serif; font-weight:900; font-size:30pt; letter-spacing:.3em; margin-top:3mm; color:#1d2a44; }
  .subtitle{ font-family:'Cinzel', serif; font-weight:500; font-size:15pt; letter-spacing:.14em; color:#8a6d2b; margin-top:-1mm; text-transform:uppercase; }
  .rule{ width:120mm; height:3mm; margin:3mm 0; color:#b08d3c; }
  .lead{ font-size:13.5pt; font-style:italic; color:#3b4660; }
  .name{ font-family:'Pinyon Script', cursive; font-size:40pt; line-height:1.15; color:#14203a; margin:1mm 0 0; }
  .body{ font-size:13pt; max-width:205mm; line-height:1.45; color:#2c3650; }
  .body b{ color:#14203a; }
  .scores{ display:flex; gap:5mm; flex-wrap:wrap; justify-content:center; margin-top:2.5mm; font-family:'Cinzel', serif; font-size:7.5pt; letter-spacing:.12em; color:#6b5524; }
  .footer{ position:absolute; left:0; right:0; bottom:0; display:grid; grid-template-columns:1fr 40mm 1fr; align-items:end; gap:8mm; }
  .sign{ text-align:center; }
  .sign .script{ font-family:'Pinyon Script', cursive; font-size:21pt; color:#1d2a44; height:11mm; }
  .sign .line{ border-top:.35mm solid #1d2a44; margin:0 10mm; padding-top:1.5mm; font-family:'Cinzel', serif; font-size:7.5pt; letter-spacing:.16em; }
  .sign .line small{ display:block; font-family:'Cormorant Garamond', serif; font-style:italic; font-size:10pt; letter-spacing:0; color:#556; margin-top:.5mm; }
  .seal{ width:36mm; height:36mm; justify-self:center; margin-bottom:-2mm; filter:drop-shadow(0 1.2mm 1.5mm rgba(80,0,0,.35)); }
  .meta{ position:absolute; left:36mm; right:36mm; bottom:11.2mm; display:flex; justify-content:space-between; font-family:'Cinzel', serif; font-size:6.8pt; letter-spacing:.18em; color:#8a6d2b; }
  @media print{ html, body{ background:none; } .bar{ display:none; } .sheet{ margin:0; box-shadow:none; } }
</style></head><body>
<div class="bar"><button onclick="window.print()">Imprimer / PDF</button><button class="ghost" onclick="window.close()">Fermer</button></div>
<div class="sheet">
  <div class="frame"></div>
  <svg class="guilloche" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <pattern id="rose" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="13" cy="13" r="9" fill="none" stroke="#b08d3c" stroke-width=".55" opacity=".7"/>
        <circle cx="0" cy="0" r="9" fill="none" stroke="#1d2a44" stroke-width=".4" opacity=".45"/>
        <circle cx="26" cy="26" r="9" fill="none" stroke="#1d2a44" stroke-width=".4" opacity=".45"/>
      </pattern>
      <mask id="band"><rect width="1000" height="700" fill="#fff"/><rect x="16" y="16" width="968" height="668" fill="#000"/></mask>
    </defs>
    <rect width="1000" height="700" fill="url(#rose)" mask="url(#band)"/>
    <rect x="16" y="16" width="968" height="668" fill="none" stroke="#b08d3c" stroke-width="1"/>
    ${[[0, 0], [1000, 0], [0, 700], [1000, 700]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(${x ? -1 : 1} ${y ? -1 : 1})"><path d="M16 70 Q16 16 70 16" fill="none" stroke="#1d2a44" stroke-width="1.6"/><path d="M26 90 Q26 26 90 26" fill="none" stroke="#b08d3c" stroke-width="1"/><circle cx="34" cy="34" r="5" fill="#b08d3c"/></g>`).join('')}
  </svg>
  <div class="inner">
    <svg class="watermark" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" stroke-width="5"/>${[0, 120, 240].map((r) => `<g transform="rotate(${r} 50 50)"><path d="M50 4 V30" stroke="currentColor" stroke-width="5"/><path d="M41 22 L50 34 L59 22 Z" fill="currentColor"/></g>`).join('')}</svg>
    <div class="org">FONDATION SCP · SITE-15<small>Commandement des Forces d'Intervention Mobiles</small></div>
    <div class="medallion">
      <svg class="laurels" viewBox="0 0 200 200" aria-hidden="true">${laurel('left')}${laurel('right')}</svg>
      <div class="disc">${emblemSvg(c.emblem, '', 1.3)}</div>
    </div>
    <div class="kicker">${esc(kicker.toUpperCase())}</div>
    <div class="subtitle">${esc(subtitle)}</div>
    <svg class="rule" viewBox="0 0 400 10" aria-hidden="true"><path d="M0 5 H170 M230 5 H400" stroke="currentColor" stroke-width="1"/><path d="M200 0 L208 5 L200 10 L192 5 Z" fill="currentColor"/><circle cx="180" cy="5" r="2" fill="currentColor"/><circle cx="220" cy="5" r="2" fill="currentColor"/></svg>
    <div class="lead">Le Commandement des Forces d'Intervention Mobiles certifie que</div>
    <div class="name">${esc(e.agentName)}</div>
    <div class="body">${esc(unitName)}, a satisfait aux épreuves du <b>${esc(raw.charAt(0).toLowerCase() + raw.slice(1))}</b> avec la note de <b>${esc(score)}</b> (${fr(e.percent, 0)} %) et obtient la mention <b>${esc(certMention(e))}</b>.</div>
    <div class="scores">${e.grid.criteria.map((cr) => `<span>${esc(cr.label)} · ${esc(rawLabel(e.grid.scale, e.scores?.[cr.id]))}</span>`).join('<span>✦</span>')}</div>
    <div class="footer">
      <div class="sign"><div class="script">${esc(e.evaluatorName)}</div><div class="line">L'ÉVALUATEUR<small>${esc(e.evaluatorName)}</small></div></div>
      <svg class="seal" viewBox="0 0 120 120" aria-hidden="true">
        <defs><path id="sealtext" d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0"/><radialGradient id="wax" cx="40%" cy="35%"><stop offset="0" stop-color="#d64545"/><stop offset=".6" stop-color="#9b1c1c"/><stop offset="1" stop-color="#5e0d0d"/></radialGradient></defs>
        <path d="M60 4 C72 6 78 2 88 10 C98 16 106 18 110 30 C116 42 120 48 116 60 C118 74 114 80 106 90 C100 100 96 108 82 112 C70 118 62 116 50 116 C38 116 30 110 22 102 C12 94 6 86 6 72 C2 60 4 50 8 40 C12 28 18 18 30 12 C40 6 48 2 60 4 Z" fill="url(#wax)"/>
        <circle cx="60" cy="60" r="47" fill="none" stroke="#f3b3b3" stroke-opacity=".35" stroke-width="1"/>
        <circle cx="60" cy="60" r="33" fill="none" stroke="#f3b3b3" stroke-opacity=".35" stroke-width="1"/>
        <text font-family="Cinzel, serif" font-size="8.5" font-weight="700" letter-spacing="2.6" fill="#ffd6d6" fill-opacity=".75"><textPath href="#sealtext">FIM · SITE-15 · FIM · SITE-15 · FIM · SITE-15 ·</textPath></text>
        <g transform="translate(43 43) scale(1.42)" color="#ffd6d6" opacity=".8">${emblemSvg(c.emblem, 'width="24" height="24"', 1.7)}</g>
      </svg>
      <div class="sign"><div class="script">Commandement FIM</div><div class="line">LE COMMANDEMENT FIM<small>Délivré au Site-15, le ${esc(dateLong)}</small></div></div>
    </div>
  </div>
  <div class="meta"><span>N° ${esc(certNumber(e))}</span><span>Classification : niveau 2 — usage interne</span></div>
</div>
</body></html>`;
    const win = window.open('', '_blank');
    if (!win) { window.showToast('Autorise les fenêtres pop-up pour afficher le diplôme.', 'error'); return; }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  // ---------------------------------------------------------------
  // Évolution, parcours ERI, export, alertes, espace ERI
  // ---------------------------------------------------------------
  const extraStyle = document.createElement('style');
  extraStyle.textContent = `
  .fim-evo{ margin-top:16px; background:var(--void-2); border-radius:3px; padding:12px 14px; }
  .fim-evo-head{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:6px; font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-faint); }
  .fim-evo svg{ width:100%; height:86px; display:block; }
  .fim-evo svg text{ font-family:'JetBrains Mono', monospace; font-size:8px; fill:var(--ink-faint); }
  .fim-trend{ font-family:'JetBrains Mono', monospace; font-size:10px; margin-left:4px; }
  .fim-path{ margin-top:18px; border:1px solid var(--line); border-radius:3px; padding:16px 18px; background:linear-gradient(140deg, rgba(110,118,255,0.07), transparent 60%); }
  .fim-path-head{ display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px; }
  .fim-path-head h4{ font-family:'Space Grotesk', sans-serif; font-size:14.5px; }
  .fim-progress{ height:8px; background:var(--void-2); border-radius:4px; overflow:hidden; margin:6px 0 14px; }
  .fim-progress i{ display:block; height:100%; background:linear-gradient(90deg, var(--accent), #4FD895); border-radius:4px; transition:width .4s ease; }
  .fim-modules{ display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:8px; }
  .fim-module{ display:flex; gap:10px; align-items:center; padding:10px 12px; background:var(--void-2); border-radius:3px; border:1px solid transparent; }
  .fim-module.ok{ border-color:rgba(79,216,149,0.35); }
  .fim-module .ic{ width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; background:var(--panel); color:var(--ink-faint); border:1px solid var(--line); }
  .fim-module.ok .ic{ background:#4FD895; color:var(--void); border-color:#4FD895; font-weight:700; }
  .fim-module .t{ font-size:12.5px; font-weight:600; line-height:1.3; }
  .fim-module .s{ font-family:'JetBrains Mono', monospace; font-size:9.5px; color:var(--ink-faint); margin-top:2px; }
  .fim-proposal{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:10px; padding:10px 12px; background:var(--void-2); border-radius:3px; font-size:12.5px; color:var(--ink-dim); }
  .fim-alert-btn.on{ border-color:#4FD895 !important; color:#4FD895 !important; }
  .fim-eri-wrap{ max-width:1040px; margin:0 auto; padding:40px 24px 90px; }
  `;
  document.head.appendChild(extraStyle);

  const chrono = (evals) => [...evals].filter((e) => e.percent != null).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  // Tendance : dernière note comparée à la moyenne des 3 précédentes.
  function trendOf(evals) {
    const list = chrono(evals);
    if (list.length < 2) return null;
    const last = list[list.length - 1].percent;
    const prev = avgOf(list.slice(-4, -1).map((e) => e.percent));
    return last - prev;
  }
  function trendBadge(evals) {
    const d = trendOf(evals);
    if (d == null) return '';
    if (Math.abs(d) < 3) return '<span class="fim-trend" style="color:var(--ink-faint)" title="Stable">→</span>';
    return d > 0
      ? `<span class="fim-trend" style="color:#4FD895" title="En progrès (+${fr(d, 0)} pts)">↑</span>`
      : `<span class="fim-trend" style="color:#F0525A" title="En baisse (${fr(d, 0)} pts)">↓</span>`;
  }

  function evolutionBlock(evals) {
    const list = chrono(evals).slice(-20);
    if (list.length < 2) return '';
    const W = 300, H = 86, padL = 6, padR = 6, padT = 8, padB = 8;
    const x = (i) => padL + (i * (W - padL - padR)) / (list.length - 1);
    const y = (p) => padT + ((100 - p) * (H - padT - padB)) / 100;
    const pts = list.map((e, i) => `${x(i)},${y(e.percent)}`).join(' ');
    const d = trendOf(evals);
    return `
      <div class="fim-evo">
        <div class="fim-evo-head"><span>Évolution · ${list.length} dernières évaluations · échelle 0 à 100 %</span>${d == null ? '' : `<span style="color:${Math.abs(d) < 3 ? 'var(--ink-faint)' : d > 0 ? '#4FD895' : '#F0525A'}">${d > 0 ? '+' : ''}${fr(d, 0)} pts</span>`}</div>
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
          ${[0, 50, 100].map((p) => `<line x1="${padL}" x2="${W - padR}" y1="${y(p)}" y2="${y(p)}" stroke="var(--line)" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="${p === 50 ? '3 3' : ''}"/>`).join('')}
          <polyline points="${pts}" fill="none" stroke="var(--accent-2)" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
          ${list.map((e, i) => `<line x1="${x(i)}" y1="${y(e.percent)}" x2="${x(i)}" y2="${y(e.percent)}" stroke="${pctColor(e.percent)}" stroke-width="7" stroke-linecap="round" vector-effect="non-scaling-stroke"><title>${esc(new Date(e.createdAt).toLocaleDateString('fr-FR'))} · ${esc(e.grid?.name || '')} · ${fr(e.percent, 0)} %</title></line>`).join('')}
        </svg>
      </div>`;
  }

  // Parcours d'intégration ERI (même règle que le serveur).
  function pathwayOf(grids, evals) {
    const modules = grids.filter((g) => g.pathway && !g.archived).map((g) => {
      const tries = evals.filter((e) => e.gridId === g.id);
      const best = tries.reduce((a, e) => (e.percent != null && (a == null || e.percent > a) ? e.percent : a), null);
      const threshold = g.thresholds?.conforme ?? 55;
      return { gridId: g.id, name: g.name, attempts: tries.length, best, validated: best != null && best >= threshold, threshold };
    });
    return { modules, done: modules.filter((m) => m.validated).length, total: modules.length, complete: modules.length > 0 && modules.every((m) => m.validated) };
  }
  const PROPOSAL_META = {
    proposee: { label: 'Intégration proposée', color: '#F0A83C' },
    acceptee: { label: 'Intégration acceptée', color: '#4FD895' },
    refusee: { label: 'Intégration refusée', color: '#F0525A' },
  };
  function pathwayBlock(status, proposals, opts = {}) {
    if (!status.total) {
      return opts.canPropose
        ? '<div class="fim-path"><div class="fim-path-head"><h4>Parcours d\'intégration ERI</h4></div><div style="font-size:12.5px; color:var(--ink-faint);">Aucun module défini. Coche « Module du parcours ERI » sur des grilles, ou crée le parcours type dans « Grilles & barèmes ».</div></div>'
        : '';
    }
    const pct = Math.round((status.done / status.total) * 100);
    const pending = proposals.find((p) => p.status === 'proposee');
    return `
      <div class="fim-path">
        <div class="fim-path-head">
          <h4>Parcours d'intégration ERI</h4>
          <span class="fim-pill" style="--c:${status.complete ? '#4FD895' : 'var(--accent-2)'}">${status.done} / ${status.total} modules${status.complete ? ' · complet' : ''}</span>
        </div>
        <div class="fim-progress"><i style="width:${pct}%"></i></div>
        <div class="fim-modules">${status.modules.map((m) => `
          <div class="fim-module${m.validated ? ' ok' : ''}">
            <span class="ic">${m.validated ? '✓' : m.attempts ? '…' : ''}</span>
            <div><div class="t">${esc(m.name.replace(/^ERI\s*·\s*/, ''))}</div><div class="s">${m.validated ? `Validé · ${fr(m.best, 0)} %` : m.attempts ? `Meilleur : ${fr(m.best, 0)} % · requis ${m.threshold} %` : 'Pas encore évalué'}</div></div>
          </div>`).join('')}</div>
        ${proposals.map((p) => `
          <div class="fim-proposal">
            ${pill(PROPOSAL_META[p.status] || PROPOSAL_META.proposee)}
            <span>par ${esc(p.proposedBy)} · ${fmtDate(p.createdAt)}${p.decidedBy ? ` — décision de ${esc(p.decidedBy)} · ${fmtDate(p.decidedAt)}` : ''}</span>
            ${p.note ? `<span style="width:100%; color:var(--ink-faint);">« ${esc(p.note)} »</span>` : ''}
            ${p.decisionNote ? `<span style="width:100%; color:var(--ink-faint);">Décision : « ${esc(p.decisionNote)} »</span>` : ''}
            ${opts.canPropose && p.status === 'proposee' ? `<span style="margin-left:auto; display:flex; gap:6px;"><button class="btn small" data-prop-decide="acceptee" data-id="${esc(p.id)}">Accepter</button><button class="btn danger small" data-prop-decide="refusee" data-id="${esc(p.id)}">Refuser</button></span>` : ''}
          </div>`).join('')}
        ${opts.canPropose && status.complete && !pending ? '<div style="margin-top:12px;"><button class="btn small" id="fim-propose-btn" type="button">Proposer l\'intégration FIM</button></div>' : ''}
        ${!opts.canPropose && status.complete && !proposals.length ? '<div style="margin-top:10px; font-size:12.5px; color:#4FD895;">Tous les modules sont validés : le commandement peut proposer ton intégration.</div>' : ''}
      </div>`;
  }
  function bindPathway(root, person, reload) {
    root.querySelector('#fim-propose-btn')?.addEventListener('click', async () => {
      const note = prompt(`Proposer l'intégration FIM de ${person.name}.\nCommentaire (facultatif) :`);
      if (note === null) return;
      try {
        await window.apiFetch('/api/rp/fim/eri-proposals', { method: 'POST', body: JSON.stringify({ agentName: person.name, agentDiscordId: person.discordId || null, note }) });
        window.showToast('Intégration proposée.', 'success');
        reload();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
    root.querySelectorAll('[data-prop-decide]').forEach((b) => b.addEventListener('click', async () => {
      const status = b.dataset.propDecide;
      const note = prompt(status === 'acceptee' ? 'Accepter l\'intégration. Commentaire (facultatif) :' : 'Refuser l\'intégration. Motif :');
      if (note === null) return;
      try {
        await window.apiFetch(`/api/rp/fim/eri-proposals/${encodeURIComponent(b.dataset.id)}`, { method: 'PATCH', body: JSON.stringify({ status, note }) });
        window.showToast(status === 'acceptee' ? 'Intégration acceptée. Pense à ajouter la personne au roster FIM.' : 'Intégration refusée.', 'success');
        reload();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
  }

  // Fiche imprimable (Imprimer -> « Enregistrer au format PDF »).
  function exportFiche(person, evals, pathway, proposals) {
    const overall = avgOf(evals.map((e) => e.percent).filter((v) => v != null));
    const tags = [person.unit ? unitLabel(person.unit) : '', ...(person.tags || []).filter((t) => t !== 'FIM')].filter(Boolean).join(' · ');
    const row = (e) => `
      <tr>
        <td>${esc(new Date(e.createdAt).toLocaleDateString('fr-FR'))}</td>
        <td>${esc(e.grid.name)}<br><small>${esc(CONTEXT_LABELS[e.context] || e.context)}</small></td>
        <td>${e.grid.criteria.map((c) => `${esc(c.label)} : <b>${esc(rawLabel(e.grid.scale, e.scores?.[c.id]))}</b>`).join('<br>')}</td>
        <td><b>${esc(pctInScale(e.grid.scale, e.percent))}</b><br><small>${fmtPct(e.percent)}</small></td>
        <td>${esc((VERDICT_META[e.verdict] || {}).label || '')}${e.recommendation && e.recommendation !== 'aucune' ? `<br><small>${esc(RECO_META[e.recommendation].label)}</small>` : ''}</td>
        <td>${e.strengths ? `<b>+</b> ${esc(e.strengths)}<br>` : ''}${e.improvements ? `<b>−</b> ${esc(e.improvements)}` : ''}<br><small>${esc(e.evaluatorName)}</small></td>
      </tr>`;
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Fiche d'évaluation — ${esc(person.name)}</title>
      <style>
        @page{ size:A4; margin:14mm; }
        body{ font-family:Inter, Arial, sans-serif; color:#111; font-size:11px; margin:0; }
        header{ display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #111; padding-bottom:10px; margin-bottom:14px; }
        h1{ font-size:20px; margin:4px 0 0; } .eyebrow{ font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#555; }
        .stamp{ border:2px solid #b00; color:#b00; font-weight:700; letter-spacing:.12em; padding:4px 10px; font-size:10px; transform:rotate(-3deg); }
        .facts{ display:flex; gap:10px; margin:0 0 14px; } .facts div{ flex:1; border:1px solid #ccc; padding:6px 8px; } .facts b{ display:block; font-size:9px; color:#666; text-transform:uppercase; letter-spacing:.06em; }
        .facts span{ font-size:14px; font-weight:700; }
        h2{ font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:18px 0 8px; border-left:3px solid #111; padding-left:6px; }
        table{ width:100%; border-collapse:collapse; } th, td{ border:1px solid #ccc; padding:5px 6px; vertical-align:top; text-align:left; }
        th{ background:#f1f1f1; font-size:9px; text-transform:uppercase; letter-spacing:.06em; } small{ color:#666; }
        .mods{ display:flex; flex-wrap:wrap; gap:6px; } .mods span{ border:1px solid #ccc; padding:3px 8px; } .mods .ok{ border-color:#1a7f4b; color:#1a7f4b; font-weight:700; }
        footer{ margin-top:18px; font-size:9px; color:#777; border-top:1px solid #ccc; padding-top:6px; display:flex; justify-content:space-between; }
        tr{ page-break-inside:avoid; }
      </style></head><body>
      <header>
        <div><div class="eyebrow">Fondation SCP · Site-15 · Commandement FIM</div><h1>Fiche d'évaluation — ${esc(person.name)}</h1><div class="eyebrow" style="margin-top:4px;">${esc(tags || 'Unité non renseignée')}${person.discordName ? ` · Discord : ${esc(person.discordName)}` : ''}</div></div>
        <div class="stamp">CONFIDENTIEL</div>
      </header>
      <div class="facts">
        <div><b>Moyenne générale</b><span>${fmtPct(overall)}</span></div>
        <div><b>Évaluations</b><span>${evals.length}</span></div>
        <div><b>Dernier avis</b><span>${evals[0] ? esc((VERDICT_META[evals[0].verdict] || {}).label) : '—'}</span></div>
        <div><b>Tendance</b><span>${(() => { const d = trendOf(evals); return d == null ? '—' : `${d > 0 ? '+' : ''}${fr(d, 0)} pts`; })()}</span></div>
      </div>
      ${pathway && pathway.total ? `<h2>Parcours d'intégration ERI · ${pathway.done}/${pathway.total}</h2><div class="mods">${pathway.modules.map((m) => `<span class="${m.validated ? 'ok' : ''}">${m.validated ? '✓ ' : ''}${esc(m.name)}${m.best != null ? ` (${fr(m.best, 0)} %)` : ''}</span>`).join('')}</div>` : ''}
      ${proposals && proposals.length ? `<p>${proposals.map((p) => `${esc(PROPOSAL_META[p.status].label)} par ${esc(p.proposedBy)} le ${esc(new Date(p.createdAt).toLocaleDateString('fr-FR'))}${p.decidedBy ? ` (décision : ${esc(p.decidedBy)})` : ''}`).join('<br>')}</p>` : ''}
      ${earnedBrevets(evals).length ? `<h2>Brevets obtenus</h2><div class="mods">${earnedBrevets(evals).map((b) => `<span class="ok">🎖 ${esc(certOf(b).title)} — ${esc(new Date(b.createdAt).toLocaleDateString('fr-FR'))} · N° ${esc(certNumber(b))}</span>`).join('')}</div>` : ''}
      <h2>Historique des évaluations</h2>
      ${evals.length ? `<table><thead><tr><th>Date</th><th>Grille</th><th>Notes</th><th>Total</th><th>Avis</th><th>Commentaires</th></tr></thead><tbody>${evals.map(row).join('')}</tbody></table>` : '<p>Aucune évaluation.</p>'}
      <footer><span>Document interne — diffusion restreinte au commandement FIM.</span><span>Édité le ${esc(new Date().toLocaleString('fr-FR'))}</span></footer>
      <script>window.onload = () => setTimeout(() => window.print(), 300);<\/script>
      </body></html>`;
    const win = window.open('', '_blank');
    if (!win) { window.showToast('Autorise les fenêtres pop-up pour exporter la fiche.', 'error'); return; }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  // --- Alertes navigateur (code grave, nouvelle brèche, ogive, raid IC) ---
  const ALERT_KEY = 'fim_alerts_on';
  const GRAVE = ['ROUGE', 'MAUVE', 'BLANC', 'NOIR'];
  let alertTimer = null;
  let alertBaseline = null;
  const alertsOn = () => { try { return localStorage.getItem(ALERT_KEY) === '1'; } catch (e) { return false; } };
  function notify(title, body) {
    window.showToast(`${title} — ${body}`, 'error');
    try {
      if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, tag: `fim-${title}`, icon: 'https://voidline-studio.com/ressources/voidline.ico' });
    } catch (e) { /* notifications indisponibles */ }
  }
  async function alertTick() {
    // Le guetteur ne tourne que tant qu'un terminal FIM est affiché.
    if (!alertsOn() || !document.querySelector('.terminal-tab[data-tab="fim-hq"]')) { stopAlerts(); return; }
    let data;
    try { data = await window.apiFetch('/api/rp/fim/situation'); } catch (e) { return; }
    const state = {};
    (data.servers || []).forEach((s) => { state[s.jobId] = { code: s.alertCode, breaches: s.breaches, nuke: s.nuke, raid: !!(s.raid && s.raid.stage) }; });
    if (alertBaseline) {
      Object.entries(state).forEach(([id, s]) => {
        const before = alertBaseline[id] || { code: 'VERT', breaches: [], nuke: false, raid: false };
        if (GRAVE.includes(s.code) && s.code !== before.code) notify(`CODE ${s.code}`, `Serveur ${id} : ${CODES[s.code]?.desc || ''}`);
        s.breaches.filter((b) => !before.breaches.includes(b)).forEach((b) => notify('BRÈCHE', `${/^\d/.test(b) ? `SCP-${b}` : b} hors confinement (serveur ${id}).`));
        if (s.nuke && !before.nuke) notify('☢ OGIVE ARMÉE', `Serveur ${id} : évacuation immédiate.`);
        if (s.raid && !before.raid) notify('RAID IC', `Serveur ${id} : l'Insurrection du Chaos attaque le Site.`);
      });
    }
    alertBaseline = state;
  }
  function startAlerts() {
    if (alertTimer || !alertsOn()) return;
    alertBaseline = null;
    alertTick();
    alertTimer = setInterval(alertTick, 30000);
  }
  function stopAlerts() {
    if (alertTimer) clearInterval(alertTimer);
    alertTimer = null;
  }
  async function toggleAlerts(btn) {
    if (alertsOn()) {
      try { localStorage.setItem(ALERT_KEY, '0'); } catch (e) { /* stockage indisponible */ }
      stopAlerts();
    } else {
      if ('Notification' in window && Notification.permission === 'default') {
        try { await Notification.requestPermission(); } catch (e) { /* refus */ }
      }
      try { localStorage.setItem(ALERT_KEY, '1'); } catch (e) { /* stockage indisponible */ }
      startAlerts();
      if (!('Notification' in window) || Notification.permission !== 'granted') window.showToast('Alertes activées dans la page (notifications du navigateur refusées).', 'success');
      else window.showToast('Alertes activées : tu seras prévenu même sur un autre onglet.', 'success');
    }
    renderAlertButton(btn);
  }
  function renderAlertButton(btn) {
    if (!btn) return;
    btn.classList.toggle('on', alertsOn());
    btn.textContent = alertsOn() ? '🔔 Alertes activées' : '🔕 Activer les alertes';
  }

  // --- Espace ERI : page à part pour les membres ERI (évaluations + parcours) ---
  async function checkEri() {
    try { return await window.apiFetch('/api/rp/eri/me'); } catch (e) { return null; }
  }
  function renderEriSpace(root, data, onBack) {
    const evals = data.evaluations || [];
    const choices = gridsFromEvals(evals);
    let gridId = choices[0]?.id;
    const render = () => {
      const gv = choices.find((g) => g.id === gridId) || null;
      root.innerHTML = `
        <div class="fim-eri-wrap">
          ${onBack ? `<button class="terminal-breadcrumb" id="eri-back" style="margin-bottom:22px;">← SITE-15 // MENU PRINCIPAL</button>` : ''}
          <div class="fim-hero">
            <div class="fim-hero-eyebrow">Commandement FIM · Espace ERI</div>
            <h2>${esc(data.name)}</h2>
            <p>Ton dossier de candidat : les évaluations rédigées par les officiers FIM et ta progression dans le parcours d'intégration. Lecture seule.</p>
            <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
              ${(data.roles || []).map((r) => `<span class="fim-chip u" style="--u:#B07CFF">${esc(r)}</span>`).join('')}
              ${data.discordName ? `<span class="fim-chip">Discord : ${esc(data.discordName)}</span>` : ''}
              <button class="btn ghost small" id="eri-export" type="button" style="margin-left:auto;">Exporter ma fiche</button>
            </div>
          </div>
          ${pathwayBlock(data.pathway || { modules: [], total: 0, done: 0 }, data.proposals || [], { canPropose: false })}
          <div class="fim-eval-profile" style="--u:#B07CFF; margin-top:18px;">
            ${profileBlock(data.name, null, evals, gv, '#B07CFF', choices, data.roles)}
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 12px;">Historique</h3>
            ${evals.length ? evals.map((e) => evalCard(e, false)).join('') : '<div class="empty-row">Aucune évaluation pour le moment.</div>'}
          </div>
          ${credit()}
        </div>`;
      root.querySelector('#eri-back')?.addEventListener('click', onBack);
      root.querySelector('#fim-profile-grid')?.addEventListener('change', (e) => { gridId = e.target.value; render(); });
      root.querySelector('#eri-export').addEventListener('click', () => exportFiche({ name: data.name, unit: null, tags: data.roles, discordName: data.discordName }, evals, data.pathway, data.proposals));
    };
    render();
  }

  // ---------------------------------------------------------------
  // Point d'entrée appelé par rp/index.html
  // ---------------------------------------------------------------
  window.FIM = {
    tabs: [
      { id: 'fim-hq', label: 'QG', icon: 'siren' },
      { id: 'fim-ops', label: 'Opérations', icon: 'radio' },
      { id: 'fim-units', label: 'Unités', icon: 'shield' },
      { id: 'fim-library', label: 'Savoir', icon: 'folder' },
      { id: 'fim-evals', label: 'Évaluations', icon: 'badge' },
    ],
    load(tabId, deptId) {
      stopRefresh();
      mainOverride = null;
      currentDeptId = deptId;
      startAlerts();
      if (tabId === 'fim-hq') loadHQ(deptId);
      else if (tabId === 'fim-ops') loadOperations();
      else if (tabId === 'fim-units') loadUnits(deptId);
      else if (tabId === 'fim-library') loadLibrary();
      else if (tabId === 'fim-evals') loadEvaluations(deptId);
    },
    stop: stopRefresh,
    checkEri,
    renderEriSpace,
  };
})();
