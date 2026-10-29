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
  .fim-sections{ display:flex; gap:6px; flex-wrap:wrap; margin-bottom:18px; }
  .fim-sections button{ display:flex; align-items:center; gap:7px; padding:7px 14px; border:1px solid var(--line); border-radius:3px; background:var(--panel);
    color:var(--ink-dim); font:600 12px 'Inter', sans-serif; cursor:pointer; transition:border-color .15s ease, color .15s ease; }
  .fim-sections button svg{ width:14px; height:14px; }
  .fim-sections button:hover{ color:var(--ink); border-color:var(--ink-faint); }
  .fim-sections button.active{ color:var(--accent-2); border-color:var(--accent); background:color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .fim-g-kpis{ display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:10px; margin-bottom:18px; }
  .fim-g-kpi{ background:var(--panel); border:1px solid var(--line); border-top:3px solid var(--c, var(--accent)); border-radius:3px; padding:14px 16px; }
  .fim-g-kpi b{ display:block; font-family:'Space Grotesk', sans-serif; font-size:26px; color:var(--c, var(--ink)); line-height:1.1; }
  .fim-g-kpi span{ font-size:11.5px; color:var(--ink-dim); }
  .fim-g-period{ display:flex; align-items:center; gap:6px; font-size:11.5px; color:var(--ink-faint); margin-bottom:14px; font-family:'Inter', sans-serif; letter-spacing:0; text-transform:none; }
  .fim-editor-section .fim-g-period{ margin:0 0 0 auto; }
  .fim-g-period button{ font:600 10.5px 'JetBrains Mono', monospace; padding:4px 9px; border:1px solid var(--line); background:transparent; color:var(--ink-dim); border-radius:3px; cursor:pointer; }
  .fim-g-period button.on{ border-color:var(--accent); color:var(--accent); background:color-mix(in srgb, var(--accent) 12%, transparent); }
  .fim-hq-row.clickable{ cursor:pointer; } .fim-hq-row.clickable:hover{ background:var(--panel-raised); }
  .fim-hq-row .meta b{ font-weight:600; }
  .fim-link-name{ background:none; border:0; padding:0; color:var(--ink); font:600 12.5px 'Inter', sans-serif; cursor:pointer; text-align:left; }
  .fim-link-name:hover{ color:var(--accent-2); text-decoration:underline; }
  .fim-g-rate{ display:inline-block; vertical-align:middle; width:70px; height:6px; background:var(--line); border-radius:3px; overflow:hidden; margin-right:8px; }
  .fim-g-rate div{ height:100%; }
  .fim-g-absform{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .fim-g-absform input[type=text]{ flex:1; min-width:180px; width:auto; }
  .fim-g-absform label{ display:flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-dim); }
  .fim-g-absform input[type=date]{ width:auto; }
  .fim-g-abs-now{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; justify-content:space-between; background:color-mix(in srgb, #F0525A 8%, transparent); border-left:3px solid #F0525A; padding:10px 14px; font-size:13px; }
  .fim-dispo{ display:flex; align-items:center; gap:14px 18px; flex-wrap:wrap; background:var(--panel); border:1px solid var(--line); border-left:3px solid var(--good); border-radius:3px; padding:14px 18px; margin:-8px 0 22px; }
  .fim-dispo:empty{ display:none; }
  .fim-dispo.away{ border-left-color:var(--bad); }
  .fim-dispo.editing{ border-left-color:var(--accent); }
  .fim-dispo-title{ width:100%; font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:-6px; }
  .fim-dispo-state{ display:flex; align-items:center; gap:12px; flex:1; min-width:220px; }
  .fim-dispo-state i{ flex:none; width:10px; height:10px; border-radius:50%; background:var(--good); box-shadow:0 0 10px var(--good); }
  .fim-dispo.away .fim-dispo-state i{ background:var(--bad); box-shadow:0 0 10px var(--bad); }
  .fim-dispo-state b{ display:block; font-family:'Space Grotesk', sans-serif; font-size:15px; }
  .fim-dispo-state span{ display:block; font-size:12.5px; color:var(--ink-dim); margin-top:2px; line-height:1.5; }
  .fim-dispo-form{ display:grid; grid-template-columns:200px 1fr; gap:12px; flex:1; min-width:240px; }
  .fim-dispo-form .field-row{ margin:0; }
  .fim-dispo-actions{ display:flex; gap:8px; }
  @media (max-width:640px){ .fim-dispo-form{ grid-template-columns:1fr; } .fim-dispo > .btn, .fim-dispo-actions{ width:100%; } .fim-dispo-actions .btn{ flex:1; } }
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
  .fim-g-grid .fim-hq-row{ flex-wrap:wrap; row-gap:2px; } .fim-g-grid .fim-hq-row .nm{ white-space:nowrap; } .fim-g-grid .fim-hq-row .meta{ white-space:normal; overflow:visible; line-height:1.5; }
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
  .fim-attention{ display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:8px; }
  .fim-attn{ display:flex; flex-direction:column; gap:3px; text-align:left; cursor:pointer; color:inherit; font-family:'Inter', sans-serif; font-size:12.5px; padding:10px 12px;
    background:var(--void-2); border:1px solid transparent; border-left:3px solid #5AA9FF; border-radius:2px; }
  .fim-attn.warn{ border-left-color:#F0A83C; } .fim-attn.bad{ border-left-color:#F0525A; }
  .fim-attn:hover{ border-color:var(--accent); }
  .fim-attn small{ font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); }
  .fim-org{ display:flex; flex-direction:column; gap:14px; }
  .fim-org-level-label{ font-family:'JetBrains Mono', monospace; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:8px; }
  .fim-org-row{ display:grid; grid-template-columns:repeat(auto-fill, minmax(230px, 1fr)); gap:10px; }
  .fim-org-card{ background:var(--panel); border:1px solid var(--line); border-top:3px solid var(--accent); border-radius:3px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; }
  .fim-org-card.lvl1{ border-top-color:#E6B43C; background:linear-gradient(160deg, rgba(230,180,60,0.08), var(--panel) 55%); }
  .fim-org-card.lvl2{ border-top-color:#B07CFF; }
  .fim-org-card.vacant{ border-style:dashed; border-top-style:solid; opacity:.8; }
  .fim-org-card.me{ box-shadow:0 0 0 1px rgba(79,216,149,0.5) inset; }
  .fim-org-title{ font-family:'JetBrains Mono', monospace; font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--accent-2); }
  .fim-org-card.lvl1 .fim-org-title{ color:#E6B43C; }
  .fim-holder{ display:block; font-family:'Space Grotesk', sans-serif; font-size:15px; font-weight:600; }
  .fim-holder-sub{ display:block; font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); margin-top:2px; }
  .fim-vacant{ font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--warn); }
  .fim-org-interim{ font-size:11.5px; color:var(--ink-dim); } .fim-org-interim b{ font-weight:600; }
  .fim-org-desc{ font-size:12px; color:var(--ink-faint); line-height:1.55; }
  .fim-org-edit{ background:var(--void-2); border-radius:3px; padding:12px; margin-bottom:10px; }
  .fim-org-edit-top{ display:grid; grid-template-columns:1fr 190px auto; gap:8px; align-items:center; }
  .fim-chain{ display:grid; grid-template-columns:repeat(auto-fill, minmax(210px, 1fr)); gap:10px; }
  .fim-chain-unit{ background:var(--panel); border:1px solid var(--line); border-left:3px solid var(--u); border-radius:3px; padding:12px 14px; }
  .fim-chain-head{ display:flex; gap:10px; align-items:center; color:var(--u); margin-bottom:8px; }
  .fim-chain-head .fim-crest{ width:30px; height:34px; }
  .fim-chain-head b{ display:block; color:var(--ink); font-size:13px; } .fim-chain-head small{ font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); }
  .fim-directive.unread{ box-shadow:inset 0 0 0 1px rgba(240,168,60,0.45); }
  .fim-ack{ display:flex; align-items:center; gap:10px; margin-top:10px; font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--ink-faint); }
  .fim-ack b{ color:var(--ink); font-weight:600; } .fim-ack.ok{ color:#4FD895; }
  .fim-check{ display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--ink-dim); margin:6px 0; cursor:pointer; }
  .fim-check input{ width:auto; }
  .fim-hq-alert{ display:flex; align-items:center; gap:14px; justify-content:space-between; flex-wrap:wrap; margin-bottom:14px; padding:12px 16px; border-radius:3px;
    border:1px solid rgba(240,168,60,0.5); background:rgba(240,168,60,0.07); }
  .fim-hq-alert b{ display:block; font-size:13.5px; } .fim-hq-alert small{ font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); }
  @media (max-width:640px){ .fim-org-edit-top{ grid-template-columns:1fr; } }
  .fim-editor-row.fim-fact-row{ grid-template-columns:1fr 1.6fr auto; }
  .fim-unit-cmd{ font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); }
  .fim-unit-cmd b{ color:var(--ink-dim); font-weight:500; }
  .fim-gauge{ flex:1; height:5px; background:var(--void-2); border-radius:3px; overflow:hidden; margin-right:8px; max-width:120px; }
  .fim-gauge i{ display:block; height:100%; background:var(--u); }
  .fim-unit-foot{ gap:6px; }
  .fim-staff tr.clickable:hover td{ background:var(--panel-raised); }
  .fim-staff tr.sel td{ background:color-mix(in srgb, var(--accent) 10%, transparent); }
  .fim-note{ border-left:2px solid var(--c); background:var(--void-2); border-radius:2px; padding:9px 12px; margin-bottom:8px; }
  .fim-note-head{ display:flex; align-items:center; gap:10px; font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--ink-faint); }
  .fim-note-head span:nth-child(2){ margin-right:auto; }
  .fim-note-text{ font-size:12.5px; color:var(--ink-dim); line-height:1.6; margin-top:6px; white-space:pre-wrap; }
  .fim-staff-wrap{ overflow-x:auto; background:var(--panel); border:1px solid var(--line); border-radius:3px; }
  @media (max-width:640px){ .fim-dossier{ padding:18px; } .fim-hero{ padding:18px; } }
  .fim-rsvp{ display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-top:10px; font-size:11.5px; color:var(--ink-faint); }
  .fim-rsvp button{ font:600 11px 'JetBrains Mono', monospace; letter-spacing:.04em; padding:5px 10px; border:1px solid var(--line); background:transparent; color:var(--ink-dim); border-radius:3px; cursor:pointer; }
  .fim-rsvp button.on{ border-color:var(--c); color:var(--c); background:color-mix(in srgb, var(--c) 12%, transparent); }
  .fim-att{ margin-top:4px; }
  .fim-att-list{ margin-top:8px; font-size:12.5px; }
  .fim-att-list summary{ cursor:pointer; color:var(--ink-dim); font-size:11.5px; font-family:'JetBrains Mono', monospace; }
  .fim-att-line{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:6px 0; border-bottom:1px dashed var(--line); }
  .fim-att-line .fim-chip{ border-color:var(--c); min-width:74px; text-align:center; }
  .fim-att-line > span:last-child{ color:var(--ink-dim); font-size:12px; }
  .fim-att-line i{ color:var(--ink-faint); }
  .fim-att-mine{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:10px; font-size:11.5px; color:var(--ink-faint); }
  .fim-att-form{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; flex:1; }
  .fim-att-form select, .fim-att-form input{ background:var(--void-2); color:var(--ink); border:1px solid var(--line); border-radius:3px; padding:5px 8px; font:inherit; font-size:12px; }
  .fim-att-form select{ width:auto; flex:none; }
  .fim-att-form input[data-att-reason]{ width:auto; flex:1; min-width:160px; }
  .fim-att-form [hidden]{ display:none; }
  .fim-att-row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:8px 12px; border-bottom:1px dashed var(--line); font-size:13px; }
  .fim-att-row .n{ min-width:160px; }
  .fim-loss{ margin-top:8px; font-size:11.5px; color:#F0525A; font-family:'JetBrains Mono', monospace; }
  .fim-badge{ display:inline-flex; align-items:center; justify-content:center; min-width:16px; height:16px; padding:0 4px; margin-left:6px; border-radius:8px; background:#F0525A; color:#fff; font:700 10px 'JetBrains Mono', monospace; vertical-align:middle; }
  .fim-gsearch{ position:relative; margin:0 0 18px; }
  .fim-gsearch-res{ position:absolute; left:0; right:0; top:100%; z-index:30; background:var(--panel); border:1px solid var(--line); border-radius:3px; max-height:360px; overflow:auto; box-shadow:0 12px 30px rgba(0,0,0,.35); }
  .fim-gsearch-res button{ display:flex; gap:10px; width:100%; text-align:left; padding:9px 12px; background:none; border:0; border-bottom:1px solid var(--line); color:var(--ink); cursor:pointer; font-size:13px; }
  .fim-gsearch-res button:hover{ background:color-mix(in srgb, var(--accent) 10%, transparent); }
  .fim-gsearch-res small{ font:600 10px 'JetBrains Mono', monospace; color:var(--accent-2); letter-spacing:.08em; min-width:92px; padding-top:2px; }
  .fim-training{ border-left:3px solid var(--u, var(--accent)); }
  .fim-roll{ margin-top:12px; border:1px solid var(--line); background:var(--void-2); }
  .fim-roll-row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:8px 12px; border-bottom:1px dashed var(--line); font-size:13px; }
  .fim-roll-row .n{ margin-right:auto; }
  .fim-roll-opts{ display:flex; gap:4px; }
  .fim-roll-opts button{ font:600 10.5px 'JetBrains Mono', monospace; padding:5px 9px; border:1px solid var(--line); border-radius:0; background:transparent; color:var(--ink-dim); cursor:pointer; }
  .fim-roll-opts button.on{ background:var(--c); border-color:var(--c); color:#0b0d12; }
  .fim-sheet{ margin-top:12px; border:1px solid var(--line); border-radius:3px; overflow:hidden; background:var(--panel); }
  .fim-sheet-head{ display:flex; align-items:center; gap:10px 16px; flex-wrap:wrap; padding:10px 14px; background:color-mix(in srgb, var(--accent) 14%, var(--panel)); border-bottom:1px solid var(--line); }
  .fim-sheet-head h4{ font:700 13px 'Space Grotesk', sans-serif; margin:0; }
  .fim-sheet-head h4 small{ font:500 11px 'Inter', sans-serif; color:var(--ink-dim); margin-left:6px; }
  .fim-sheet-state{ font:600 10.5px 'JetBrains Mono', monospace; letter-spacing:.04em; padding:3px 8px; border-radius:3px; border:1px solid var(--c); color:var(--c); }
  .fim-sheet-count{ display:flex; gap:12px; margin-left:auto; font:600 11px 'JetBrains Mono', monospace; color:var(--ink-dim); }
  .fim-sheet-count b{ color:var(--c); }
  .fim-sheet-scroll{ overflow-x:auto; }
  .fim-sheet table{ width:100%; border-collapse:collapse; font-size:12.5px; min-width:640px; }
  .fim-sheet th{ font:600 10px 'JetBrains Mono', monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-faint); background:var(--void-2); padding:7px 8px; border-bottom:1px solid var(--line); border-right:1px solid var(--line); text-align:left; }
  .fim-sheet th.c, .fim-sheet td.c{ text-align:center; width:46px; padding-left:0; padding-right:0; }
  .fim-sheet td{ padding:6px 8px; border-bottom:1px solid var(--line); border-right:1px solid var(--line); vertical-align:middle; }
  .fim-sheet th:last-child, .fim-sheet td:last-child{ border-right:0; }
  .fim-sheet tbody tr:nth-child(even){ background:color-mix(in srgb, var(--void-2) 55%, transparent); }
  .fim-sheet tr[data-st="absent"]{ background:color-mix(in srgb, #F0525A 14%, transparent) !important; }
  .fim-sheet tr[data-st="retard"]{ background:color-mix(in srgb, #F0A83C 13%, transparent) !important; }
  .fim-sheet tr[data-st="excuse"]{ background:color-mix(in srgb, #5AA9FF 12%, transparent) !important; }
  .fim-sheet tr.dirty td:first-child{ box-shadow:inset 3px 0 0 var(--accent); }
  .fim-sheet .num{ width:30px; text-align:center; font:11px 'JetBrains Mono', monospace; color:var(--ink-faint); }
  .fim-sheet-who{ display:flex; align-items:center; gap:10px; }
  .fim-sheet-ava{ flex:none; width:28px; height:32px; border-radius:2px; display:grid; place-items:center; background:var(--void-2); border:1px solid var(--line); font:700 11px 'Space Grotesk', sans-serif; color:var(--ink-dim); }
  .fim-sheet-who b{ display:block; font-weight:600; }
  .fim-sheet-who small{ display:block; font-size:11px; color:var(--ink-faint); }
  .fim-sheet-tag{ display:inline-block; margin-left:6px; font:700 9.5px 'JetBrains Mono', monospace; padding:1px 5px; border-radius:2px; background:var(--c); color:#0b0d12; vertical-align:middle; }
  .fim-sheet-ig{ font:11px 'JetBrains Mono', monospace; color:var(--ink-faint); white-space:nowrap; }
  .fim-sheet-ig.on{ color:#4FD895; }
  .fim-sheet-box{ width:20px; height:20px; border:1.5px solid var(--ink-faint); border-radius:2px; background:var(--void); cursor:pointer; padding:0; display:inline-grid; place-items:center; color:#0b0d12; font:800 13px 'Inter', sans-serif; line-height:1; }
  .fim-sheet-box:hover{ border-color:var(--c); }
  .fim-sheet-box.on{ background:var(--c); border-color:var(--c); }
  .fim-sheet-motif{ display:flex; gap:6px; align-items:center; }
  .fim-sheet-motif input, .fim-sheet-motif select{ background:var(--void-2); color:var(--ink); border:1px solid var(--line); border-radius:3px; padding:4px 7px; font:inherit; font-size:12px; }
  .fim-sheet-motif input{ flex:1; min-width:120px; width:auto; }
  .fim-sheet-motif select{ width:auto; flex:none; }
  .fim-sheet-motif [hidden]{ display:none; }
  .fim-sheet-motif .by{ font-size:10.5px; color:var(--ink-faint); white-space:nowrap; }
  .fim-sheet-foot{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; padding:10px 14px; border-top:1px solid var(--line); background:var(--void-2); }
  .fim-sheet-foot input{ flex:1; min-width:180px; }
  .fim-sheet-foot .hint{ width:100%; font-size:11px; color:var(--ink-faint); }
  .fim-roll-foot{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; padding:10px 12px; }
  .fim-roll-foot input{ flex:1; min-width:160px; }
  .fim-chip.att{ border-color:var(--c); color:var(--c); }
  .fim-audit-row{ display:grid; grid-template-columns:120px 1fr; gap:10px; padding:7px 0; border-bottom:1px dashed var(--line); font-size:12.5px; }
  .fim-audit-row .t{ font:11px 'JetBrains Mono', monospace; color:var(--ink-faint); }
  @media (max-width:640px){
    .fim-audit-row{ grid-template-columns:1fr; gap:2px; }
    .fim-journal-form{ flex-wrap:wrap; }
    .fim-journal-form input{ min-width:0; flex:1 1 100%; }
    .fim-op-top{ flex-wrap:wrap; }
    .sci-card-actions{ flex-wrap:wrap; }
    .fim-subnav{ overflow-x:auto; flex-wrap:nowrap; }
    .fim-subnav button{ white-space:nowrap; }
    .fim-journal-row{ flex-wrap:wrap; }
    .fim-journal-row .x{ flex:1 1 100%; order:5; }
    .fim-journal-row .by{ margin-left:auto; }
  }
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

  // Fiches d'origine. Le commandement peut les redéfinir ou ajouter des
  // unités depuis l'intranet (/api/rp/fim/units) : UNITS est alors recalculé.
  const BASE_UNITS = UNITS.map((u) => ({ ...u, facts: { ...u.facts }, match: [...u.match] }));
  const UNIT_FIELDS = ['name', 'letter', 'nick', 'color', 'callsign', 'motto', 'role', 'facts', 'body', 'commander', 'targetSize', 'discordRoleId'];
  let unitDocs = [];
  let unitsCanManage = false;
  let unitDefsAt = 0;
  function applyUnitDocs() {
    const docs = new Map(unitDocs.map((d) => [d.id, d]));
    const merged = [];
    BASE_UNITS.forEach((base, i) => {
      const doc = docs.get(base.id);
      if (doc?.archived) return;
      const u = { ...base, facts: { ...base.facts }, match: [...base.match], order: (i + 1) * 10, edited: !!doc?.name };
      if (doc?.name) {
        UNIT_FIELDS.forEach((k) => { if (doc[k] !== undefined) u[k] = doc[k]; });
        if (Array.isArray(doc.match) && doc.match.length) u.match = [...new Set([...doc.match, ...base.match])];
        if (doc.order) u.order = doc.order;
      }
      merged.push(u);
    });
    unitDocs.filter((d) => !d.archived && d.name && !BASE_UNITS.some((b) => b.id === d.id)).forEach((d) => {
      merged.push({ id: d.id, facts: {}, body: '', nick: '', motto: '', role: '', ...d, match: [...new Set([...(d.match || []), d.id])], order: d.order || 1000, custom: true });
    });
    merged.sort((a, b) => a.order - b.order);
    UNITS.splice(0, UNITS.length, ...merged);
    UNIT_OPTIONS.splice(0, UNIT_OPTIONS.length, ...UNITS.map((u) => u.id), 'INTER-UNITÉS');
  }
  // Unités archivées (pour les restaurer) : d'origine ou ajoutées.
  function archivedUnits() {
    return unitDocs.filter((d) => d.archived).map((d) => {
      const base = BASE_UNITS.find((b) => b.id === d.id);
      return { id: d.id, name: d.name || base?.name || d.id, color: d.color || base?.color || '#9297A8' };
    });
  }
  async function loadUnitDefs(force) {
    if (!force && Date.now() - unitDefsAt < 60000) return;
    try {
      const r = await window.apiFetch('/api/rp/fim/units');
      unitDocs = r.units || [];
      unitsCanManage = !!r.canManage;
      unitDefsAt = Date.now();
      applyUnitDocs();
    } catch (err) { /* garde les fiches d'origine */ }
  }

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
  // Lieux du Site-15 proposés pour la zone et le point de ralliement.
  const SITE_PLACES = ['Gate A', 'Gate B', 'Réception (Secteur 1)', 'Zone de confinement légère', 'Zone de confinement lourde', 'Bloc Classe-D', 'Cantine', 'Infirmerie', 'Poste de contrôle', 'Checkpoint', 'Zone de détention', 'Quai D-FIM', 'Métro — Secteur 1', 'Métro — Secteur 3', 'Abri', 'Salle du réacteur', 'Archives [REDACTED]', 'Héliport', 'Extérieur du site'];
  // Modèles d'ordres fournis d'office (en plus de ceux du commandement).
  const BASE_TEMPLATES = [
    { id: 'base-939', label: 'Reconfinement SCP-939', codeName: 'ÉCHO', unit: 'EPSILON-11', priority: 'critique', roe: 'RDE-2 Neutralisation', zone: 'Zone de confinement lourde', target: 'SCP-939', rallyPoint: 'Checkpoint', objective: "Phase 1 : sécuriser le sas de la ZCL.\nPhase 2 : progression en binômes, silence radio sauf contact (SCP-939 imite les voix).\nPhase 3 : repousser l'entité dans sa cellule, verrouiller, rapport de reconfinement.", team: [] },
    { id: 'base-gatea', label: 'Défense de la Gate A', codeName: 'REMPART', unit: 'NU-7', priority: 'prioritaire', roe: 'RDE-1 Riposte', zone: 'Gate A', target: 'Insurrection du Chaos', rallyPoint: 'Gate A', objective: 'Tenir la Gate A et le parking. Tireurs en hauteur, équipe de réaction au sas. Aucune sortie de Classe-D. Rapport toutes les 5 minutes.', team: [] },
    { id: 'base-raid', label: 'Contre-raid IC', codeName: 'FAUCON', unit: 'INTER-UNITÉS', priority: 'critique', roe: 'RDE-2 Neutralisation', zone: 'Secteur 2', target: 'Insurrection du Chaos', rallyPoint: 'Poste de contrôle', objective: "Repérer et neutraliser le groupe de l'IC. Priorité : protéger les objets anomaux et le personnel. Récupérer tout matériel volé.", team: [] },
    { id: 'base-evasion', label: 'Recherche de Classe-D évadés', codeName: 'BATTUE', unit: 'EPSILON-11', priority: 'prioritaire', roe: 'RDE-1 Riposte', zone: 'Extérieur du site', target: 'Classe-D évadé', rallyPoint: 'Gate A', objective: 'Ratisser les abords du site par secteurs, ramener les évadés en détention. Usage de la force létale seulement en cas de menace armée.', team: [] },
  ];
  const RSVP_META = {
    present: { label: 'Présent', color: '#4FD895' },
    retard: { label: 'En retard', color: '#F0A83C' },
    absent: { label: 'Absent', color: '#F0525A' },
    excuse: { label: 'Excusé', color: '#5AA9FF' },
  };
  const RSVP_DELAYS = [5, 10, 15, 20, 30, 45, 60];
  const attManageOpen = new Set(); // ordres dont le panneau « Gérer les présences » est ouvert
  let opTemplates = [];

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
  // Onglet regroupé (Personnel, Formation) : la section choisie est rendue
  // sous le sélecteur de sections, dans ce conteneur.
  let sectionRoot = null;
  function rootEl() {
    if (sectionRoot && document.body.contains(sectionRoot)) return sectionRoot;
    return document.getElementById('terminal-main');
  }
  function mainEl() {
    if (mainOverride && document.body.contains(mainOverride)) return mainOverride;
    return rootEl();
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
  // Onglets regroupés : chaque section garde son identifiant d'origine
  // (badges, liens profonds, goTab('fim-library')...).
  const TAB_GROUPS = {
    'fim-units': [
      { id: 'fim-units', label: 'Unités', icon: 'shield' },
      { id: 'fim-effectifs', label: 'Effectifs', icon: 'badge' },
      { id: 'fim-gestion', label: 'Gestion', icon: 'people', gestion: true },
    ],
    'fim-formation': [
      { id: 'fim-library', label: 'Savoir', icon: 'folder' },
      { id: 'fim-courses', label: 'Cours', icon: 'document' },
      { id: 'fim-evals', label: 'Évaluations', icon: 'badge' },
    ],
  };
  const groupSection = { 'fim-units': 'fim-units', 'fim-formation': 'fim-library' };
  function groupOf(id) {
    return Object.keys(TAB_GROUPS).find((g) => TAB_GROUPS[g].some((x) => x.id === id)) || id;
  }
  function goTab(id) {
    const group = groupOf(id);
    if (group !== id || TAB_GROUPS[id]) groupSection[group] = id;
    const tab = document.querySelector(`.terminal-tab[data-tab="${group}"]`);
    if (tab?.classList.contains('active')) window.FIM.load(group, currentDeptId);
    else tab?.click();
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
  // Unité d'un agent : imposée par le commandement, sinon rôle Discord,
  // sinon mot-clé de l'unité dans sa division ou son grade.
  function unitOverrideOf(agent) {
    const id = personnel.get(personKey(agent.name || agent.username))?.unitOverride;
    return id && UNITS.some((u) => u.id === id) ? id : null;
  }
  function unitFromAgent(agent) {
    const forced = unitOverrideOf(agent);
    if (forced) return forced;
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
    const [ops, debriefs, evalData, docs, agents, dirData, trData] = await Promise.all([
      safe(window.apiFetch('/api/rp/fim/operations'), { operations: [] }),
      safe(window.apiFetch('/api/rp/fim/debriefs'), { debriefs: [] }),
      safe(window.apiFetch('/api/rp/fim/evaluations'), { evaluations: [] }),
      safe(window.apiFetch('/api/rp/fim/docs'), { documents: [] }),
      loadRoster(),
      safe(window.apiFetch('/api/rp/fim/directives'), { directives: [] }),
      safe(window.apiFetch('/api/rp/fim/trainings'), { trainings: [] }),
    ]);
    if (mainEl() !== main || !main.isConnected) return;
    const upcomingTrainings = (trData.trainings || []).filter((t) => t.status === 'planifiee' && t.at > Date.now() - 3600000).sort((a, b) => a.at - b.at);
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
    const toRead = unreadDirectives(dirData.directives || [], dirData.selfKey || '', myUnit);
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
    if (isCommand && promos.length) todo.push([`${promos.length} opérateur(s) proposé(s) à la promotion`, promos.slice(0, 3).join(', '), 'fim-units', 'activite']);
    const myRsvpMissing = myMissions.filter((o) => o.status === 'planifiee' && !(o.rsvp || {})[personKey(self)]);
    if (myRsvpMissing.length) todo.push([`${myRsvpMissing.length} ordre(s) sans ta réponse`, myRsvpMissing.slice(0, 3).map((o) => o.codeName).join(', '), 'fim-ops', 'miennes']);
    const trKey = trData.selfKey || personKey(self);
    const openTr = upcomingTrainings.filter((t) => !(t.signups || {})[trKey]);
    if (openTr.length) todo.push([`${openTr.length} formation(s) ouverte(s) à l'inscription`, openTr.slice(0, 2).map((t) => t.title).join(', '), 'fim-evals', 'trainings']);
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
        <div class="fim-gsearch">
          <input type="text" id="fim-gsearch" class="fim-search" style="margin:0;" placeholder="Recherche globale : opération, opérateur, indicatif, directive, doctrine, SCP…" autocomplete="off">
          <div class="fim-gsearch-res" id="fim-gsearch-res" hidden></div>
        </div>
        <div id="fim-live"><div class="center-msg">Connexion au réseau tactique…</div></div>
        ${toRead.length ? `<div class="fim-hq-alert">
          <div><b>${toRead.length} directive${toRead.length > 1 ? 's' : ''} de la Direction à lire</b><small>${toRead.slice(0, 3).map((d) => esc(d.title)).join(' · ')}</small></div>
          <button class="btn small" type="button" id="fim-hq-read">Lire maintenant</button>
        </div>` : ''}
        <div class="fim-hq-grid">${myCard}${missionsCard}${opsCard}${todoCard}${debriefCard}${notesCard}</div>
        <div id="fim-live-servers"></div>
      </div>`;
    main.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.go === 'fim-units' && b.dataset.ops) { unitsView = b.dataset.ops; goTab('fim-units'); return; }
      if (b.dataset.go === 'fim-evals' && b.dataset.ops === 'trainings') { evalView = 'trainings'; goTab('fim-evals'); return; }
      if (b.dataset.ops) opsFilter = b.dataset.ops;
      if (b.dataset.doc) { libView = 'doctrine'; docSelected = b.dataset.doc; }
      goTab(b.dataset.go);
    }));
    document.getElementById('fim-hq-read')?.addEventListener('click', () => { unitsView = 'direction'; directionView = 'lire'; goTab('fim-units'); });
    bindGlobalSearch({ operations, debriefs: debriefList, agents, directives: dirData.directives || [], docs: docs.documents || [], trainings: trData.trainings || [] });
    await refreshLive(false);
    if (!refreshTimer) refreshTimer = setInterval(() => refreshLive(true), 30000);
  }

  // Recherche globale du QG : un champ, tous les contenus de l'intranet.
  function bindGlobalSearch(src) {
    const input = document.getElementById('fim-gsearch');
    const res = document.getElementById('fim-gsearch-res');
    if (!input) return;
    const items = [
      ...src.operations.map((o) => ({ kind: 'Opération', label: `${o.codeName} · ${unitLabel(o.unit)} · ${STATUS_META[o.status]?.label || ''}`, hay: [o.codeName, o.zone, o.target, o.leader, o.objective, ...(o.team || []).map((m) => m.name)], go: () => { opsFilter = o.status === 'terminee' || o.status === 'annulee' ? 'archives' : 'actives'; opsSearch = o.codeName; goTab('fim-ops'); } })),
      ...src.debriefs.map((d) => ({ kind: 'Débriefing', label: d.title, hay: [d.title, d.scp, d.participants, d.summary], go: () => { opsFilter = 'debriefs'; focusDebrief = d.id; goTab('fim-ops'); } })),
      ...src.agents.map((a) => { const n = a.name || a.username; return { kind: 'Opérateur', label: `${withCallsign(n)}${a.rank ? ` · ${a.rank}` : ''}`, hay: [n, a.username, a.rank, callsignOf(n)], go: () => { unitsView = 'effectifs'; staffSelected = n; goTab('fim-units'); } }; }),
      ...src.directives.map((d) => ({ kind: 'Directive', label: d.title, hay: [d.title, d.body], go: () => { unitsView = 'direction'; directionView = d.archived ? 'archives' : 'vigueur'; goTab('fim-units'); } })),
      ...src.docs.map((d) => ({ kind: 'Note', label: d.title, hay: [d.title, d.content], go: () => { libView = 'doctrine'; docSelected = d.id; goTab('fim-library'); } })),
      ...DOCTRINE.map((d) => ({ kind: 'Doctrine', label: d.title, hay: [d.title], go: () => { libView = 'doctrine'; docSelected = d.id; goTab('fim-library'); } })),
      ...SCPS.map((x) => ({ kind: 'Fiche SCP', label: `${x.id}${x.name ? ` · ${x.name}` : ''}`, hay: [x.id, x.name], go: () => { libView = 'scp'; goTab('fim-library'); } })),
      ...src.trainings.map((t) => ({ kind: 'Formation', label: `${t.title} · ${fmtDate(t.at)}`, hay: [t.title, t.instructor, t.place], go: () => { evalView = 'trainings'; goTab('fim-evals'); } })),
      ...UNITS.map((u) => ({ kind: 'Unité', label: `FIM ${u.name}${u.nick ? ` ${u.nick}` : ''}`, hay: [u.id, u.name, u.nick, u.callsign], go: () => { unitsView = 'bataille'; selectedUnit = u.id; goTab('fim-units'); } })),
    ];
    let found = [];
    const show = () => {
      const q = norm(input.value);
      if (q.length < 2) { res.hidden = true; return; }
      found = items.filter((it) => it.hay.some((h) => norm(h).includes(q))).slice(0, 14);
      res.innerHTML = found.length ? found.map((it, i) => `<button type="button" data-i="${i}"><small>${esc(it.kind.toUpperCase())}</small><span>${esc(it.label)}</span></button>`).join('') : '<div class="empty-row">Aucun résultat.</div>';
      res.hidden = false;
      res.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => { res.hidden = true; found[+b.dataset.i].go(); }));
    };
    input.addEventListener('input', show);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && found[0]) { e.preventDefault(); res.hidden = true; found[0].go(); } if (e.key === 'Escape') res.hidden = true; });
    document.addEventListener('click', (e) => { if (!e.target.closest('.fim-gsearch')) res.hidden = true; });
  }

  // Situation tactique partagée entre le bandeau du QG et le guetteur
  // d'alertes : une seule requête toutes les 20 s au plus.
  let situationCache = { at: 0, promise: null };
  function fetchSituation() {
    if (situationCache.promise && Date.now() - situationCache.at < 20000) return situationCache.promise;
    const promise = window.apiFetch('/api/rp/fim/situation');
    situationCache = { at: Date.now(), promise };
    promise.catch(() => { if (situationCache.promise === promise) situationCache = { at: 0, promise: null }; });
    return promise;
  }

  // Bandeau en direct du QG : code, brèches, unités déployées, serveurs.
  async function refreshLive(silent) {
    if (!document.getElementById('fim-live')) return stopRefresh();
    // Onglet du navigateur caché : on ne rafraîchit pas l'affichage
    if (silent && document.hidden) return;
    let data;
    try {
      data = await fetchSituation();
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
    // Effectifs et dossiers : section à part de l'onglet Personnel
    if (unitsView === 'effectifs') { unitsView = 'bataille'; goTab('fim-effectifs'); return; }
    const root = rootEl();
    mainOverride = null;
    root.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Commandement FIM · ordre de bataille</div>
        <h2>Forces d'Intervention Mobiles du Site-15</h2>
        <p>${UNITS.length} unités, chacune avec sa spécialité, son indicatif et ses règles${unitsCanManage ? ' : en tant qu’officier, tu peux modifier leurs fiches, en créer ou en archiver' : ''}. L'unité d'un opérateur vient de l'unité imposée dans son dossier, sinon de son rôle d'unité sur le Discord FIM, sinon de sa division.</p>
      </div>
      ${subTabs([['direction', 'Direction'], ['bataille', 'Ordre de bataille'], ['activite', 'Activité']], unitsView, 'data-uv')}
      <div id="fim-units-body"></div>`;
    root.querySelectorAll('[data-uv]').forEach((b) => b.addEventListener('click', () => {
      unitsView = b.dataset.uv;
      loadUnits(deptId);
    }));
    mainOverride = document.getElementById('fim-units-body');
    if (unitsView === 'direction') loadDirection();
    else if (unitsView === 'activite') loadActivity();
    else loadBattleOrder();
  }

  async function loadBattleOrder() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let agents = [];
    try {
      agents = await loadRoster();
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
      if (unitEditing) { renderUnitEditor(main, agents); return; }
      const u = UNITS.find((x) => x.id === selectedUnit) || UNITS[0];
      if (!u) { main.innerHTML = '<div class="empty-row">Aucune unité active.</div>'; return; }
      const roster = byUnit[u.id] || [];
      const archived = archivedUnits();
      const gauge = (x) => {
        const n = (byUnit[x.id] || []).length;
        if (!x.targetSize) return `<span>${n} opérateur(s)</span>`;
        const pct = Math.min(100, Math.round((n / x.targetSize) * 100));
        return `<span class="fim-gauge" title="${n} / ${x.targetSize}"><i style="width:${pct}%"></i></span><span>${n}/${x.targetSize}</span>`;
      };
      main.innerHTML = `
        ${unitsCanManage ? `<div style="display:flex; gap:8px; justify-content:flex-end; margin:-4px 0 12px; flex-wrap:wrap;">
          ${archived.length ? `<select id="fim-unit-restore" style="width:auto;"><option value="">Restaurer une unité archivée…</option>${archived.map((a) => `<option value="${esc(a.id)}">${esc(a.name)} (${esc(a.id)})</option>`).join('')}</select>` : ''}
          <button class="btn small" type="button" id="fim-unit-new">+ Nouvelle unité</button>
        </div>` : ''}
        <div class="fim-grid">
          ${UNITS.map((x) => `
            <button class="fim-unit-card${x.id === u.id ? ' active' : ''}" style="--u:${x.color}" data-unit="${x.id}" type="button">
              <div class="fim-unit-top">${crest(x.letter)}<div><div class="fim-unit-code">${esc(x.name)}</div><div class="fim-unit-nick">${esc(x.nick)}</div></div></div>
              <div class="fim-unit-role">${esc(x.role)}</div>
              ${x.commander ? `<div class="fim-unit-cmd">Chef d'unité <b>${esc(withCallsign(x.commander))}</b></div>` : ''}
              <div class="fim-unit-foot">${gauge(x)}<span>${esc(x.callsign)}</span></div>
            </button>`).join('')}
        </div>
        <div class="fim-dossier" style="--u:${u.color}">
          <div class="fim-dossier-head" style="color:${u.color}">
            ${crest(u.letter)}
            <div style="color:var(--ink); flex:1;"><h3>FIM ${esc(u.name)} <span style="color:${u.color}">${esc(u.nick)}</span></h3>${u.motto ? `<div class="fim-motto">« ${esc(u.motto)} »</div>` : ''}</div>
            ${unitsCanManage ? `<button class="btn ghost small" type="button" id="fim-unit-edit">Modifier l'unité</button>` : ''}
          </div>
          <div class="fim-facts">
            ${u.commander ? `<div class="fim-fact"><b>Chef d'unité</b><span>${esc(withCallsign(u.commander))}</span></div>` : ''}
            ${u.targetSize ? `<div class="fim-fact"><b>Effectif</b><span>${roster.length} / ${u.targetSize}</span></div>` : ''}
            ${Object.entries(u.facts || {}).map(([k, v]) => `<div class="fim-fact"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}
          </div>
          <div class="sci-body-rendered">${window.renderMarkdown(u.body || '')}</div>
          <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 4px;">Opérateurs affectés · ${roster.length}</h3>
          ${roster.length
            ? `<div class="fim-roster">${roster.map((a) => `<span class="fim-chip u">${esc(a.rank ? `${a.rank} · ` : '')}${esc(withCallsign(a.name || a.username))}</span>`).join('')}</div>`
            : `<div style="font-size:12.5px; color:var(--ink-faint);">Aucun opérateur rattaché à cette unité${unassigned ? ` (${unassigned} opérateur(s) sans unité : rôle d'unité sur le Discord FIM, unité imposée dans son dossier, ou division qui contient un mot-clé de l'unité)` : ''}.</div>`}
          ${u.updatedBy && u.edited ? `<div class="fim-op-foot">Fiche modifiée par ${esc(u.updatedBy)} · ${fmtDate(u.updatedAt)}</div>` : ''}
        </div>
        ${credit()}
      `;
      main.querySelectorAll('[data-unit]').forEach((b) => b.addEventListener('click', () => {
        selectedUnit = b.dataset.unit;
        render();
        main.querySelector('.fim-dossier')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
      document.getElementById('fim-unit-edit')?.addEventListener('click', () => { unitEditing = { ...u, factsList: Object.entries(u.facts || {}).map(([k, v]) => ({ k, v })), match: [...(u.match || [])] }; render(); });
      document.getElementById('fim-unit-new')?.addEventListener('click', () => {
        unitEditing = { isNew: true, id: '', name: '', letter: '', nick: '', color: '#6E76FF', callsign: '', motto: '', role: '', factsList: [{ k: 'Autorité', v: 'Commandement FIM' }], body: '## Mission\n\n## Au Site-15\n- \n\n## Règles propres\n- ', match: [], commander: '', targetSize: 0, discordRoleId: '', order: (UNITS.length + 1) * 10 };
        render();
      });
      document.getElementById('fim-unit-restore')?.addEventListener('change', async (e) => {
        const id = e.target.value;
        if (!id) return;
        try {
          await window.apiFetch(`/api/rp/fim/units/${encodeURIComponent(id)}/archive`, { method: 'PATCH', body: JSON.stringify({ archived: false }) });
          window.showToast('Unité restaurée.', 'success');
          await loadUnitDefs(true);
          selectedUnit = id;
          loadBattleOrder();
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      });
    };
    render();
  }

  // Éditeur d'unité (commandement) : fiche complète, mots-clés, rôle Discord.
  let unitEditing = null;
  function renderUnitEditor(main, agents) {
    const u = unitEditing;
    const names = agents.map((a) => a.name || a.username).filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr'));
    const facts = u.factsList || [];
    const isBase = BASE_UNITS.some((b) => b.id === u.id);
    main.innerHTML = `
      <div class="subsection" style="margin-top:0; --u:${esc(u.color)}">
        <h3>${u.isNew ? 'Nouvelle unité' : `Modifier FIM ${esc(u.name)}`}</h3>
        <form id="fim-unit-form">
          <div class="fim-editor-section">Identité</div>
          <div class="field-grid">
            <div class="field-row"><label>Code *</label><input id="un-id" maxlength="20" placeholder="Ex : OMEGA-7" value="${esc(u.id)}" ${u.isNew ? '' : 'disabled'}></div>
            <div class="field-row"><label>Nom *</label><input id="un-name" maxlength="40" placeholder="Ex : Oméga-7" value="${esc(u.name)}" required></div>
            <div class="field-row"><label>Surnom</label><input id="un-nick" maxlength="60" placeholder="Ex : « La Boîte de Pandore »" value="${esc(u.nick || '')}"></div>
            <div class="field-row"><label>Devise</label><input id="un-motto" maxlength="80" value="${esc(u.motto || '')}"></div>
            <div class="field-row"><label>Lettre de l'écusson</label><input id="un-letter" maxlength="2" value="${esc(u.letter || '')}"></div>
            <div class="field-row"><label>Couleur</label><div style="display:flex; gap:8px;"><input id="un-color" type="color" value="${esc(u.color || '#6E76FF')}" style="width:56px; padding:2px;"><input id="un-color-hex" maxlength="7" value="${esc(u.color || '#6E76FF')}" style="flex:1;"></div></div>
            <div class="field-row"><label>Indicatif radio</label><input id="un-callsign" maxlength="20" placeholder="Ex : PANDORE" value="${esc(u.callsign || '')}"></div>
            <div class="field-row"><label>Ordre d'affichage</label><input id="un-order" type="number" min="0" max="10000" value="${esc(u.order || 0)}"></div>
          </div>
          <div class="field-row"><label>Rôle (résumé sur la carte)</label><input id="un-role" maxlength="300" value="${esc(u.role || '')}"></div>
          <div class="fim-editor-section">Commandement et effectif</div>
          <div class="field-grid">
            <div class="field-row"><label>Chef d'unité</label><select id="un-commander"><option value="">— Aucun —</option>${names.map((n) => `<option value="${esc(n)}"${norm(n) === norm(u.commander) ? ' selected' : ''}>${esc(withCallsign(n))}</option>`).join('')}${u.commander && !names.some((n) => norm(n) === norm(u.commander)) ? `<option selected value="${esc(u.commander)}">${esc(u.commander)}</option>` : ''}</select></div>
            <div class="field-row"><label>Effectif cible</label><input id="un-target" type="number" min="0" max="500" value="${esc(u.targetSize || 0)}"></div>
          </div>
          <div class="fim-editor-section">Rattachement des opérateurs</div>
          <div class="field-grid">
            <div class="field-row"><label>ID du rôle Discord de l'unité</label><input id="un-role-id" maxlength="25" placeholder="Ex : 1470988716502679669" value="${esc(u.discordRoleId || '')}"></div>
            <div class="field-row"><label>Mots-clés (division, équipe en jeu)</label><input id="un-match" maxlength="220" placeholder="Ex : OMEGA-7, O-7, PANDORE" value="${esc((u.match || []).join(', '))}"></div>
          </div>
          <div style="font-size:11.5px; color:var(--ink-faint); margin:-6px 0 6px;">Le rôle Discord rattache automatiquement ses membres à l'unité. Les mots-clés servent pour la division du roster et pour reconnaître l'équipe en jeu (onglet QG, relevé de présence).</div>
          <div class="fim-editor-section">Fiche</div>
          <div id="un-facts">${facts.map(({ k, v }, i) => `<div class="fim-editor-row fim-fact-row" data-fact="${i}"><input maxlength="30" placeholder="Intitulé" value="${esc(k)}"><input maxlength="80" placeholder="Valeur" value="${esc(v)}"><button type="button" class="fim-x" data-fact-del="${i}">×</button></div>`).join('')}</div>
          <button type="button" class="btn ghost small" id="un-fact-add" style="margin-bottom:12px;">+ Ligne</button>
          <div class="field-row"><label>Dossier (Markdown, {{texte}} = caviardé)</label><textarea id="un-body" rows="14" maxlength="12000">${esc(u.body || '')}</textarea></div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn" type="submit">${u.isNew ? 'Créer l’unité' : 'Enregistrer'}</button>
            <button class="btn ghost" type="button" id="un-cancel">Annuler</button>
            ${!u.isNew && isBase && u.edited ? '<button class="btn ghost" type="button" id="un-reset">Revenir à la fiche d’origine</button>' : ''}
            ${!u.isNew ? '<button class="btn danger" type="button" id="un-archive" style="margin-left:auto;">Archiver l’unité</button>' : ''}
          </div>
        </form>
      </div>`;
    const readFacts = () => [...document.querySelectorAll('#un-facts [data-fact]')].map((row) => ({ k: row.children[0].value.trim(), v: row.children[1].value.trim() }));
    const color = document.getElementById('un-color');
    const hex = document.getElementById('un-color-hex');
    color.addEventListener('input', () => { hex.value = color.value; });
    hex.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) color.value = hex.value; });
    document.getElementById('un-fact-add').addEventListener('click', () => { snapshot(); unitEditing.factsList = [...readFacts(), { k: '', v: '' }]; renderUnitEditor(main, agents); });
    main.querySelectorAll('[data-fact-del]').forEach((b) => b.addEventListener('click', () => {
      snapshot();
      const list = readFacts();
      list.splice(+b.dataset.factDel, 1);
      unitEditing.factsList = list;
      renderUnitEditor(main, agents);
    }));
    // Garde la saisie en cours quand l'éditeur est redessiné.
    function snapshot() {
      const v = (id) => document.getElementById(id).value;
      Object.assign(unitEditing, {
        id: u.isNew ? v('un-id').trim().toUpperCase() : u.id, name: v('un-name'), nick: v('un-nick'), motto: v('un-motto'), letter: v('un-letter'),
        color: hex.value, callsign: v('un-callsign'), order: +v('un-order') || 0, role: v('un-role'), commander: v('un-commander'),
        targetSize: +v('un-target') || 0, discordRoleId: v('un-role-id').trim(), match: v('un-match').split(',').map((m) => m.trim()).filter(Boolean), body: v('un-body'),
      });
    }
    const done = async (msg, id) => {
      window.showToast(msg, 'success');
      unitEditing = null;
      await loadUnitDefs(true);
      if (id) selectedUnit = id;
      loadBattleOrder();
    };
    document.getElementById('un-cancel').addEventListener('click', () => { unitEditing = null; loadBattleOrder(); });
    document.getElementById('un-archive')?.addEventListener('click', async () => {
      if (!confirm(`Archiver FIM ${u.name} ? Elle disparaît des listes ; ses anciens ordres et évaluations restent consultables. Elle pourra être restaurée.`)) return;
      try {
        await window.apiFetch(`/api/rp/fim/units/${encodeURIComponent(u.id)}/archive`, { method: 'PATCH', body: JSON.stringify({ archived: true }) });
        selectedUnit = null;
        done('Unité archivée.');
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
    document.getElementById('un-reset')?.addEventListener('click', async () => {
      if (!confirm('Revenir à la fiche d’origine de cette unité ? Les modifications du commandement seront perdues.')) return;
      const base = BASE_UNITS.find((b) => b.id === u.id);
      try {
        await window.apiFetch(`/api/rp/fim/units/${encodeURIComponent(u.id)}`, { method: 'PUT', body: JSON.stringify({ ...base, facts: Object.entries(base.facts).map(([k, v]) => ({ k, v })), match: [], order: 0, discordRoleId: u.discordRoleId || '', commander: u.commander || '', targetSize: u.targetSize || 0 }) });
        done('Fiche d’origine rétablie.', u.id);
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
    document.getElementById('fim-unit-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      snapshot();
      const x = unitEditing;
      if (!x.name.trim() || (x.isNew && !x.id)) { window.showToast('Code et nom obligatoires.', 'error'); return; }
      const payload = { ...x, facts: readFacts().filter((r) => r.k && r.v), factsList: undefined };
      try {
        if (x.isNew) await window.apiFetch('/api/rp/fim/units', { method: 'POST', body: JSON.stringify(payload) });
        else await window.apiFetch(`/api/rp/fim/units/${encodeURIComponent(x.id)}`, { method: 'PUT', body: JSON.stringify(payload) });
        done(x.isNew ? 'Unité créée.' : 'Unité enregistrée.', x.id);
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Direction : organigramme, chaîne de commandement, directives
  // ---------------------------------------------------------------
  const DIRECTIVE_KIND_META = {
    directive: { label: 'Directive', color: '#6E76FF' },
    note: { label: 'Note de service', color: '#5AA9FF' },
    decision: { label: 'Décision', color: '#4FD895' },
    circulaire: { label: 'Circulaire', color: '#B07CFF' },
  };
  const DIRECTIVE_PRIORITY_META = {
    normale: { label: 'Normale', color: '#9297A8' },
    importante: { label: 'Importante', color: '#F0A83C' },
    critique: { label: 'Critique', color: '#F0525A' },
  };
  const LEVEL_LABELS = { 1: 'Direction', 2: 'Direction adjointe', 3: 'État-major' };
  const OFFICER_RE = /directeur|commandant|capitaine|lieutenant|chef|officier|major/i;
  let directionView = 'lire';
  let orgEditing = null;
  let directiveEditing = null;
  const openAcks = new Set();

  // Une directive concerne-t-elle cet opérateur (toutes les FIM ou son unité) ?
  const directiveFor = (d, unit) => !d.audience || d.audience === 'ALL' || d.audience === unit;
  const directiveExpired = (d) => !!d.expiresAt && d.expiresAt < Date.now();
  function unreadDirectives(directives, selfKey, unit) {
    return directives.filter((d) => !d.archived && !directiveExpired(d) && d.requireAck && directiveFor(d, unit) && !(d.acks || {})[selfKey]);
  }

  async function loadDirection() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let org = { positions: [] };
    let canManage = false;
    let directives = [];
    let selfKey = '';
    let agents = [];
    let evalData = {};
    let ops = [];
    let debriefs = [];
    try {
      const [dir, dv, roster, ev, o, db] = await Promise.all([
        window.apiFetch('/api/rp/fim/direction'),
        window.apiFetch('/api/rp/fim/directives').catch(() => ({ directives: [] })),
        loadRoster(),
        window.apiFetch('/api/rp/fim/evaluations').catch(() => ({})),
        window.apiFetch('/api/rp/fim/operations').catch(() => ({ operations: [] })),
        window.apiFetch('/api/rp/fim/debriefs').catch(() => ({ debriefs: [] })),
      ]);
      org = dir.org || org;
      canManage = !!dir.canManage;
      directives = dv.directives || [];
      selfKey = dv.selfKey || '';
      agents = roster;
      evalData = ev;
      ops = o.operations || [];
      debriefs = db.debriefs || [];
    } catch (err) {
      main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    if (mainEl() !== main) return;
    const self = evalData.self || '';
    const me = agents.find((a) => norm(a.name || a.username) === norm(self));
    const myUnit = me ? unitFromAgent(me) : null;
    const nameOf = (a) => a.name || a.username;
    const agentByName = (n) => agents.find((a) => norm(nameOf(a)) === norm(n));
    const holderChip = (n) => {
      if (!n) return '<span class="fim-vacant">Poste vacant</span>';
      const a = agentByName(n);
      const u = a ? unitFromAgent(a) : null;
      return `<span class="fim-holder">${esc(withCallsign(n))}</span>${a?.rank ? `<span class="fim-holder-sub">${esc(a.rank)}${u ? ` · ${esc(unitLabel(u))}` : ''}</span>` : ''}`;
    };
    const unread = unreadDirectives(directives, selfKey, myUnit);
    setSide(
      [[String(org.positions.filter((p) => p.holder).length), 'Postes pourvus'], [String(unread.length), 'À lire']],
      directives.filter((d) => !d.archived).slice(0, 5).map((d) => [(DIRECTIVE_KIND_META[d.kind] || DIRECTIVE_KIND_META.directive).label, d.title])
    );

    if (orgEditing) { renderOrgEditor(main, agents); return; }
    if (directiveEditing) { renderDirectiveForm(main); return; }

    // --- Points d'attention (commandement) ---
    let attention = '';
    if (canManage) {
      const items = [];
      const byUnit = {};
      agents.forEach((a) => { const u = unitFromAgent(a); if (u) byUnit[u] = (byUnit[u] || 0) + 1; });
      UNITS.filter((u) => u.targetSize && (byUnit[u.id] || 0) < u.targetSize).forEach((u) => items.push(['warn', `FIM ${u.name} en sous-effectif`, `${byUnit[u.id] || 0} / ${u.targetSize} opérateurs`, 'bataille']));
      UNITS.filter((u) => !u.commander).forEach((u) => items.push(['info', `FIM ${u.name} sans chef d'unité`, 'À désigner dans la fiche de l’unité', 'bataille']));
      const noUnit = agents.filter((a) => !unitFromAgent(a));
      if (noUnit.length) items.push(['warn', `${noUnit.length} opérateur(s) sans unité`, noUnit.slice(0, 4).map(nameOf).join(', '), 'effectifs']);
      const vacant = org.positions.filter((p) => !p.holder);
      if (vacant.length) items.push(['info', `${vacant.length} poste(s) vacant(s) à la Direction`, vacant.slice(0, 3).map((p) => p.title).join(', '), 'direction']);
      const evaluations = evalData.evaluations || [];
      if (evalData.canEvaluate) {
        const never = agents.filter((a) => norm(nameOf(a)) !== norm(self) && !evaluations.some((e) => norm(e.agentName) === norm(nameOf(a))));
        if (never.length) items.push(['info', `${never.length} opérateur(s) jamais évalué(s)`, never.slice(0, 4).map(nameOf).join(', '), 'evals']);
      }
      const warnings = [...personnel.values()].flatMap((p) => (p.notes || []).filter((n) => n.kind === 'avertissement' && n.at > Date.now() - 30 * 86400000).map(() => p.name));
      if (warnings.length) items.push(['bad', `${warnings.length} avertissement(s) ces 30 derniers jours`, [...new Set(warnings)].slice(0, 4).join(', '), 'effectifs']);
      const debriefed = new Set(debriefs.map((d) => d.operationId).filter(Boolean));
      const noDebrief = ops.filter((o) => o.status === 'terminee' && !debriefed.has(o.id));
      if (noDebrief.length) items.push(['warn', `${noDebrief.length} opération(s) sans débriefing`, noDebrief.slice(0, 3).map((o) => o.codeName).join(', '), 'debriefs']);
      const lowRead = directives.filter((d) => !d.archived && !directiveExpired(d) && d.requireAck).map((d) => {
        const aud = agents.filter((a) => directiveFor(d, unitFromAgent(a)));
        const read = aud.filter((a) => (d.acks || {})[personKey(nameOf(a))]).length;
        return { d, aud: aud.length, read };
      }).filter((x) => x.aud && x.read / x.aud < 0.5 && Date.now() - (x.d.createdAt || 0) > 86400000);
      lowRead.forEach((x) => items.push(['warn', `Directive peu lue : ${x.d.title}`, `${x.read} / ${x.aud} lecteurs après ${Math.round((Date.now() - x.d.createdAt) / 86400000)} j`, 'direction']));
      attention = `
        <div class="fim-hq-card" style="margin-bottom:18px;">
          <div class="fim-hq-card-head"><h3>Points d'attention de la Direction</h3><span class="count">${items.length}</span></div>
          ${items.length ? `<div class="fim-attention">${items.map(([lvl, t, sub, go]) => `<button type="button" class="fim-attn ${lvl}" data-attn="${go}"><span>${esc(t)}</span><small>${esc(sub)}</small></button>`).join('')}</div>` : '<div class="empty-row">Aucun point d’attention : effectifs, évaluations et débriefings sont à jour.</div>'}
        </div>`;
    }

    // --- Organigramme ---
    const levels = [1, 2, 3].map((lvl) => ({ lvl, list: org.positions.filter((p) => (p.level || 3) === lvl) })).filter((g) => g.list.length);
    const orgHtml = `
      <div class="record-block">
        <div class="record-block-head"><h2>Organigramme de la Direction</h2>${canManage ? '<button class="btn ghost small" type="button" id="fim-org-edit">Modifier l’organigramme</button>' : `<span class="count">${org.positions.length}</span>`}</div>
        ${org.isDefault ? `<div style="font-size:12px; color:var(--ink-faint); margin-bottom:10px;">Organigramme type : aucun titulaire n'est encore désigné.${canManage ? ' Clique sur « Modifier l’organigramme » pour nommer les titulaires et adapter les postes.' : ''}</div>` : ''}
        <div class="fim-org">
          ${levels.map((g) => `
            <div class="fim-org-level">
              <div class="fim-org-level-label">${esc(LEVEL_LABELS[g.lvl])}</div>
              <div class="fim-org-row">${g.list.map((p) => `
                <div class="fim-org-card lvl${g.lvl}${p.holder ? '' : ' vacant'}${norm(p.holder) === norm(self) ? ' me' : ''}">
                  <div class="fim-org-title">${esc(p.title)}</div>
                  <div class="fim-org-holder">${holderChip(p.holder)}</div>
                  ${p.interim ? `<div class="fim-org-interim">Intérim : <b>${esc(withCallsign(p.interim))}</b></div>` : ''}
                  ${p.description ? `<div class="fim-org-desc">${esc(p.description)}</div>` : ''}
                </div>`).join('')}</div>
            </div>`).join('')}
        </div>
        ${org.updatedBy ? `<div class="fim-op-foot">Organigramme mis à jour par ${esc(org.updatedBy)} · ${fmtDate(org.updatedAt)}</div>` : ''}
      </div>`;

    // --- Chaîne de commandement ---
    const officers = agents.filter((a) => OFFICER_RE.test(a.rank || '')).sort((a, b) => (a.rank || '').localeCompare(b.rank || '', 'fr') || nameOf(a).localeCompare(nameOf(b), 'fr'));
    const chainHtml = `
      <div class="record-block" style="margin-top:24px;">
        <div class="record-block-head"><h2>Chaîne de commandement</h2><span class="count">${UNITS.length} unités · ${officers.length} officier${officers.length > 1 ? 's' : ''}</span></div>
        <div class="fim-chain">
          ${UNITS.map((u) => `
            <div class="fim-chain-unit" style="--u:${u.color}">
              <div class="fim-chain-head">${crest(u.letter)}<div><b>FIM ${esc(u.name)}</b><small>${esc(u.callsign || '')}</small></div></div>
              <div class="fim-chain-cmd">${u.commander ? holderChip(u.commander) : '<span class="fim-vacant">Chef d’unité à désigner</span>'}</div>
            </div>`).join('')}
        </div>
        ${officers.length ? `<div class="fim-editor-section">Officiers</div><div class="fim-roster">${officers.map((a) => { const u = unitFromAgent(a); return `<span class="fim-chip u" style="--u:${u ? unitColor(u) : '#9297A8'}">${esc(a.rank)} · ${esc(withCallsign(nameOf(a)))}</span>`; }).join('')}</div>` : ''}
      </div>`;

    // --- Directives ---
    const visible = directives.filter((d) => canManage || directiveFor(d, myUnit));
    const views = {
      lire: (d) => !d.archived && !directiveExpired(d) && d.requireAck && directiveFor(d, myUnit) && !(d.acks || {})[selfKey],
      vigueur: (d) => !d.archived && !directiveExpired(d),
      archives: (d) => d.archived || directiveExpired(d),
    };
    if (directionView === 'lire' && !visible.some(views.lire)) directionView = 'vigueur';
    const shown = visible.filter(views[directionView] || views.vigueur).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.createdAt || 0) - (a.createdAt || 0));
    const directiveCard = (d) => {
      const kind = DIRECTIVE_KIND_META[d.kind] || DIRECTIVE_KIND_META.directive;
      const prio = DIRECTIVE_PRIORITY_META[d.priority] || DIRECTIVE_PRIORITY_META.normale;
      const acked = !!(d.acks || {})[selfKey];
      const concerned = directiveFor(d, myUnit);
      let ackHtml = '';
      if (d.requireAck) {
        if (canManage) {
          const aud = agents.filter((a) => directiveFor(d, unitFromAgent(a)));
          const readers = aud.filter((a) => (d.acks || {})[personKey(nameOf(a))]);
          const missing = aud.filter((a) => !(d.acks || {})[personKey(nameOf(a))]);
          const pct = aud.length ? Math.round((readers.length / aud.length) * 100) : 0;
          ackHtml = `
            <div class="fim-ack">
              <span class="fim-gauge" style="--u:${pct >= 80 ? '#4FD895' : pct >= 50 ? '#F0A83C' : '#F0525A'}; max-width:160px;"><i style="width:${pct}%"></i></span>
              <span>Lu par <b>${readers.length} / ${aud.length}</b></span>
              ${missing.length ? `<button type="button" class="fim-link" data-ack-toggle="${esc(d.id)}">${openAcks.has(d.id) ? 'Masquer' : 'Qui n’a pas lu ?'}</button>` : ''}
            </div>
            ${openAcks.has(d.id) && missing.length ? `<div class="fim-roster" style="margin-top:6px;">${missing.map((a) => `<span class="fim-chip">${esc(withCallsign(nameOf(a)))}</span>`).join('')}</div>` : ''}`;
        }
        if (concerned) ackHtml += acked
          ? `<div class="fim-ack ok">✓ Lu le ${esc(fmtDate(d.acks[selfKey].at))}</div>`
          : `<button class="btn small" type="button" data-ack="${esc(d.id)}" style="margin-top:10px;">J'ai lu et compris</button>`;
      }
      return `
        <div class="fim-op fim-directive${!acked && d.requireAck && concerned && !d.archived ? ' unread' : ''}" style="--u:${prio.color}">
          <div class="fim-op-top">
            <span class="fim-op-name" style="font-family:'Space Grotesk', sans-serif; letter-spacing:0;">${d.pinned ? '📌 ' : ''}${esc(d.title)}</span>
            ${pill(kind)} ${d.priority !== 'normale' ? pill(prio) : ''} ${directiveExpired(d) ? pill({ label: 'Expirée', color: '#565B6B' }) : ''}${d.archived ? pill({ label: 'Archivée', color: '#565B6B' }) : ''}
          </div>
          <div class="fim-op-meta">
            <span>Destinataires <b>${!d.audience || d.audience === 'ALL' ? 'Toutes les FIM' : `FIM ${esc(unitLabel(d.audience))}`}</b></span>
            <span>Par <b>${esc(d.authorCharacterName)}</b> · ${fmtDate(d.createdAt)}</span>
            ${d.expiresAt ? `<span>Jusqu'au <b>${esc(new Date(d.expiresAt).toLocaleDateString('fr-FR'))}</b></span>` : ''}
          </div>
          <div class="sci-body-rendered fim-table">${window.renderMarkdown(d.body || '')}</div>
          ${ackHtml}
          ${canManage ? `<div class="sci-card-actions">
            <button class="btn ghost small" type="button" data-dir-edit="${esc(d.id)}">Modifier</button>
            <button class="btn ghost small" type="button" data-dir-archive="${esc(d.id)}" data-v="${d.archived ? '0' : '1'}">${d.archived ? 'Désarchiver' : 'Archiver'}</button>
            <button class="btn danger small" type="button" data-dir-del="${esc(d.id)}">Supprimer</button>
          </div>` : ''}
        </div>`;
    };
    const dirHtml = `
      <div class="record-block" style="margin-top:24px;" id="fim-directives">
        <div class="record-block-head"><h2>Directives et notes de service</h2>${canManage ? '<button class="btn small" type="button" id="fim-dir-new">+ Nouvelle directive</button>' : ''}</div>
        ${subTabs([['lire', `À lire (${visible.filter(views.lire).length})`], ['vigueur', `En vigueur (${visible.filter(views.vigueur).length})`], ['archives', `Archives (${visible.filter(views.archives).length})`]], directionView, 'data-dv')}
        ${shown.length ? shown.map(directiveCard).join('') : `<div class="empty-row">${directionView === 'lire' ? 'Tu es à jour : aucune directive à lire.' : 'Aucune directive.'}</div>`}
      </div>`;

    main.innerHTML = `${attention}${orgHtml}${chainHtml}${dirHtml}<div id="fim-dir-extra"></div>`;
    loadDirectionExtra(canManage);

    main.querySelectorAll('[data-attn]').forEach((b) => b.addEventListener('click', () => {
      const go = b.dataset.attn;
      if (go === 'bataille' || go === 'effectifs') { unitsView = go; loadUnits(currentDeptId); }
      else if (go === 'evals') goTab('fim-evals');
      else if (go === 'debriefs') { opsFilter = 'debriefs'; goTab('fim-ops'); }
      else document.getElementById(go === 'direction' ? 'fim-directives' : '')?.scrollIntoView({ behavior: 'smooth' });
    }));
    document.getElementById('fim-org-edit')?.addEventListener('click', () => { orgEditing = org.positions.map((p) => ({ ...p })); loadDirection(); });
    document.getElementById('fim-dir-new')?.addEventListener('click', () => { directiveEditing = { isNew: true, kind: 'directive', priority: 'normale', audience: 'ALL', requireAck: true, pinned: false, title: '', body: '', announce: true }; loadDirection(); });
    main.querySelectorAll('[data-dv]').forEach((b) => b.addEventListener('click', () => { directionView = b.dataset.dv; loadDirection(); }));
    main.querySelectorAll('[data-ack-toggle]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.ackToggle;
      if (openAcks.has(id)) openAcks.delete(id); else openAcks.add(id);
      loadDirection();
    }));
    const call = async (url, opts, msg) => {
      try {
        await window.apiFetch(url, opts);
        if (msg) window.showToast(msg, 'success');
        loadDirection();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    };
    main.querySelectorAll('[data-ack]').forEach((b) => b.addEventListener('click', () => call(`/api/rp/fim/directives/${encodeURIComponent(b.dataset.ack)}/ack`, { method: 'POST' }, 'Lecture confirmée.')));
    main.querySelectorAll('[data-dir-archive]').forEach((b) => b.addEventListener('click', () => call(`/api/rp/fim/directives/${encodeURIComponent(b.dataset.dirArchive)}`, { method: 'PATCH', body: JSON.stringify({ archived: b.dataset.v === '1' }) }, b.dataset.v === '1' ? 'Directive archivée.' : 'Directive remise en vigueur.')));
    main.querySelectorAll('[data-dir-del]').forEach((b) => b.addEventListener('click', () => {
      if (confirm('Supprimer définitivement cette directive et ses accusés de lecture ?')) call(`/api/rp/fim/directives/${encodeURIComponent(b.dataset.dirDel)}`, { method: 'DELETE' }, 'Directive supprimée.');
    }));
    main.querySelectorAll('[data-dir-edit]').forEach((b) => b.addEventListener('click', () => {
      const d = directives.find((x) => x.id === b.dataset.dirEdit);
      if (d) { directiveEditing = { ...d }; loadDirection(); }
    }));
  }

  // Bas de la Direction : passations de postes (tous) et audit (commandement).
  let auditFilter = '';
  async function loadDirectionExtra(canManage) {
    const box = document.getElementById('fim-dir-extra');
    const [hist, audit] = await Promise.all([
      window.apiFetch('/api/rp/fim/direction/history').then((r) => r.history || []).catch(() => []),
      canManage ? window.apiFetch('/api/rp/fim/audit').then((r) => r.entries || []).catch(() => null) : Promise.resolve(null),
    ]);
    if (!box || !box.isConnected) return;
    const histHtml = `
      <div class="record-block" style="margin-top:24px;">
        <div class="record-block-head"><h2>Historique des postes</h2><span class="count">${hist.length}</span></div>
        ${hist.length ? hist.slice(0, 30).map((h) => `<div class="fim-audit-row">
          <span class="t">${esc(fmtDate(h.at))}</span>
          <span><b>${esc(h.title)}</b>${h.field === 'interim' ? ' (intérim)' : ''} : ${h.from ? `${esc(h.from)} → ` : ''}${h.to ? `<b>${esc(h.to)}</b>` : '<i>poste libéré</i>'} <span style="color:var(--ink-faint);">· par ${esc(h.by)}</span></span>
        </div>`).join('') : '<div class="empty-row">Aucune passation enregistrée.</div>'}
      </div>`;
    const renderAudit = () => {
      const q = norm(auditFilter);
      const list = (audit || []).filter((e) => !q || [e.action, e.target, e.by, e.details].some((x) => norm(x).includes(q)));
      return list.length ? list.slice(0, 150).map((e) => `<div class="fim-audit-row">
          <span class="t">${esc(fmtDate(e.at))}</span>
          <span><b>${esc(e.action)}</b>${e.target ? ` · ${esc(e.target)}` : ''} <span style="color:var(--ink-faint);">par ${esc(e.by)}</span>${e.details ? `<div style="font-size:11.5px; color:var(--ink-dim);">${esc(e.details)}</div>` : ''}</span>
        </div>`).join('') : '<div class="empty-row">Aucune entrée.</div>';
    };
    const auditHtml = audit ? `
      <div class="record-block" style="margin-top:24px;">
        <div class="record-block-head"><h2>Journal d'audit</h2><span class="count">${audit.length}</span></div>
        <p style="font-size:12px; color:var(--ink-faint); margin:0 0 10px;">Suppressions, archivages, changements d'unité, d'indicatif et de dossiers, visibles du commandement seulement.</p>
        <input type="text" id="fim-audit-search" class="fim-search" placeholder="Filtrer : action, cible, auteur…" value="${esc(auditFilter)}">
        <div id="fim-audit-list">${renderAudit()}</div>
      </div>` : '';
    box.innerHTML = histHtml + auditHtml;
    document.getElementById('fim-audit-search')?.addEventListener('input', (e) => { auditFilter = e.target.value; document.getElementById('fim-audit-list').innerHTML = renderAudit(); });
  }

  function renderOrgEditor(main, agents) {
    const names = agents.map((a) => a.name || a.username).filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr'));
    const select = (id, value, empty) => `<select data-${id}>${`<option value="">${empty}</option>`}${names.map((n) => `<option value="${esc(n)}"${norm(n) === norm(value) ? ' selected' : ''}>${esc(withCallsign(n))}</option>`).join('')}${value && !names.some((n) => norm(n) === norm(value)) ? `<option selected value="${esc(value)}">${esc(value)}</option>` : ''}</select>`;
    main.innerHTML = `
      <div class="subsection" style="margin-top:0;">
        <h3>Organigramme de la Direction</h3>
        <div style="font-size:12px; color:var(--ink-faint); margin-bottom:14px;">Chaque poste a un niveau (Direction, Direction adjointe, État-major), un titulaire, un intérim facultatif et une description des responsabilités.</div>
        <div id="fim-org-rows">${orgEditing.map((p, i) => `
          <div class="fim-org-edit" data-row="${i}">
            <div class="fim-org-edit-top">
              <input data-title maxlength="60" placeholder="Intitulé du poste" value="${esc(p.title)}">
              <select data-level>${[1, 2, 3].map((l) => `<option value="${l}"${(p.level || 3) === l ? ' selected' : ''}>${LEVEL_LABELS[l]}</option>`).join('')}</select>
              <div class="fim-icon-btns">
                <button type="button" data-up="${i}" ${i === 0 ? 'disabled' : ''}>↑</button>
                <button type="button" data-down="${i}" ${i === orgEditing.length - 1 ? 'disabled' : ''}>↓</button>
                <button type="button" data-del="${i}">×</button>
              </div>
            </div>
            <div class="field-grid" style="margin-top:8px;">
              <div class="field-row" style="margin:0;"><label>Titulaire</label>${select('holder', p.holder, '— Poste vacant —')}</div>
              <div class="field-row" style="margin:0;"><label>Intérim</label>${select('interim', p.interim, '— Aucun —')}</div>
            </div>
            <textarea data-desc rows="2" maxlength="400" placeholder="Responsabilités du poste" style="margin-top:8px;">${esc(p.description || '')}</textarea>
          </div>`).join('')}</div>
        <button class="btn ghost small" type="button" id="fim-org-add" style="margin:4px 0 16px;">+ Ajouter un poste</button>
        <div style="display:flex; gap:10px;">
          <button class="btn" type="button" id="fim-org-save">Enregistrer l'organigramme</button>
          <button class="btn ghost" type="button" id="fim-org-cancel">Annuler</button>
        </div>
      </div>`;
    const read = () => {
      orgEditing = [...document.querySelectorAll('#fim-org-rows [data-row]')].map((row, i) => ({
        ...orgEditing[i],
        title: row.querySelector('[data-title]').value,
        level: +row.querySelector('[data-level]').value,
        holder: row.querySelector('[data-holder]').value,
        interim: row.querySelector('[data-interim]').value,
        description: row.querySelector('[data-desc]').value,
      }));
    };
    const redraw = () => renderOrgEditor(main, agents);
    main.querySelectorAll('[data-up]').forEach((b) => b.addEventListener('click', () => { read(); const i = +b.dataset.up; [orgEditing[i - 1], orgEditing[i]] = [orgEditing[i], orgEditing[i - 1]]; redraw(); }));
    main.querySelectorAll('[data-down]').forEach((b) => b.addEventListener('click', () => { read(); const i = +b.dataset.down; [orgEditing[i + 1], orgEditing[i]] = [orgEditing[i], orgEditing[i + 1]]; redraw(); }));
    main.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => { read(); orgEditing.splice(+b.dataset.del, 1); redraw(); }));
    document.getElementById('fim-org-add').addEventListener('click', () => { read(); orgEditing.push({ title: '', level: 3, holder: '', interim: '', description: '' }); redraw(); });
    document.getElementById('fim-org-cancel').addEventListener('click', () => { orgEditing = null; loadDirection(); });
    document.getElementById('fim-org-save').addEventListener('click', async () => {
      read();
      try {
        await window.apiFetch('/api/rp/fim/direction', { method: 'PUT', body: JSON.stringify({ positions: orgEditing.filter((p) => p.title.trim()) }) });
        window.showToast('Organigramme enregistré.', 'success');
        orgEditing = null;
        loadDirection();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  function renderDirectiveForm(main) {
    const d = directiveEditing;
    main.innerHTML = `
      <div class="subsection" style="margin-top:0;">
        <h3>${d.isNew ? 'Nouvelle directive' : 'Modifier la directive'}</h3>
        <form id="fim-dir-form">
          <div class="field-row"><label>Titre *</label><input id="dir-title" maxlength="120" required value="${esc(d.title)}"></div>
          <div class="field-grid">
            <div class="field-row"><label>Type</label><select id="dir-kind">${Object.entries(DIRECTIVE_KIND_META).map(([k, m]) => `<option value="${k}"${d.kind === k ? ' selected' : ''}>${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Priorité</label><select id="dir-priority">${Object.entries(DIRECTIVE_PRIORITY_META).map(([k, m]) => `<option value="${k}"${d.priority === k ? ' selected' : ''}>${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Destinataires</label><select id="dir-audience"><option value="ALL">Toutes les FIM</option>${UNITS.map((u) => `<option value="${u.id}"${d.audience === u.id ? ' selected' : ''}>FIM ${esc(u.name)}</option>`).join('')}</select></div>
            <div class="field-row"><label>En vigueur jusqu'au</label><input id="dir-expires" type="date" value="${d.expiresAt ? new Date(d.expiresAt).toISOString().slice(0, 10) : ''}"></div>
          </div>
          <div class="field-row"><label>Contenu (Markdown) *</label><textarea id="dir-body" rows="12" maxlength="8000" required placeholder="Objet, consignes, entrée en vigueur…">${esc(d.body)}</textarea></div>
          <label class="fim-check"><input type="checkbox" id="dir-ack"${d.requireAck !== false ? ' checked' : ''}> Demander un accusé de lecture aux destinataires</label>
          <label class="fim-check"><input type="checkbox" id="dir-pin"${d.pinned ? ' checked' : ''}> Épingler en tête de liste</label>
          ${d.isNew ? '<label class="fim-check"><input type="checkbox" id="dir-announce" checked> Annoncer sur Discord (si le salon est configuré)</label>' : ''}
          <div style="display:flex; gap:10px; margin-top:14px;">
            <button class="btn" type="submit">${d.isNew ? 'Publier' : 'Enregistrer'}</button>
            <button class="btn ghost" type="button" id="dir-cancel">Annuler</button>
          </div>
        </form>
      </div>`;
    document.getElementById('dir-cancel').addEventListener('click', () => { directiveEditing = null; loadDirection(); });
    document.getElementById('fim-dir-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value;
      const exp = v('dir-expires');
      const payload = {
        title: v('dir-title').trim(), kind: v('dir-kind'), priority: v('dir-priority'), audience: v('dir-audience'), body: v('dir-body'),
        expiresAt: exp ? new Date(`${exp}T23:59:59`).getTime() : null,
        requireAck: document.getElementById('dir-ack').checked, pinned: document.getElementById('dir-pin').checked,
        announce: document.getElementById('dir-announce')?.checked !== false,
      };
      if (!payload.title || !payload.body.trim()) { window.showToast('Titre et contenu obligatoires.', 'error'); return; }
      try {
        if (d.isNew) await window.apiFetch('/api/rp/fim/directives', { method: 'POST', body: JSON.stringify(payload) });
        else await window.apiFetch(`/api/rp/fim/directives/${encodeURIComponent(d.id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
        window.showToast(d.isNew ? 'Directive publiée.' : 'Directive modifiée.', 'success');
        directiveEditing = null;
        directionView = 'vigueur';
        loadDirection();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // Effectifs : tous les opérateurs actifs, rangés par unité, avec leur dossier.
  let staffSearch = '';
  let staffSelected = null;
  const NOTE_META = {
    felicitation: { label: 'Félicitation', color: '#4FD895' },
    avertissement: { label: 'Avertissement', color: '#F0525A' },
    observation: { label: 'Observation', color: '#5AA9FF' },
  };
  let staffActivity = new Map();
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
    if (isCommand && !staffActivity.size) {
      window.apiFetch('/api/rp/fim/activity').then((r) => {
        staffActivity = new Map((r.people || []).map((x) => [norm(x.name), x]));
        if (staffSelected && mainEl() === main) loadStaff();
      }).catch(() => {});
    }
    const people = agents.map((a) => {
      const member = roleMemberOf(a);
      const name = a.name || a.username;
      const evals = evaluations.filter((e) => (member?.discordId && e.agentDiscordId === member.discordId) || norm(e.agentName) === norm(name));
      const missions = ops.filter((o) => roleIn(o, name) || presenceMinutes(o, name) > 0);
      const minutes = ops.reduce((acc, o) => acc + presenceMinutes(o, name), 0);
      return { name, rank: a.rank || '', unit: unitFromAgent(a), viaRole: !!member && !unitOverrideOf(a), forced: !!unitOverrideOf(a), discordName: member?.discordName || '', evals, missions, minutes, file: personnel.get(personKey(name)) || {} };
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
            ${isCommand && staffActivity.has(norm(p.name)) ? (() => { const a = staffActivity.get(norm(p.name)); return `<div class="fim-fact"><b>En jeu FIM (30 j)</b><span>${fmtHours(a.fim30)}${a.lastSeenFim ? ` · vu ${esc(relTime(a.lastSeenFim))}` : ' · pas vu'}</span></div>`; })() : ''}
            ${canSeeNotes ? `<div class="fim-fact"><b>Félicitations / avert.</b><span>${notes.filter((n) => n.kind === 'felicitation').length} / ${notes.filter((n) => n.kind === 'avertissement').length}</span></div>` : ''}
          </div>
          ${medalsRow(p.evals)}
          ${isCommand ? `
            <div class="fim-editor-section">Indicatif radio</div>
            <form id="fim-callsign-form" style="display:flex; gap:8px; max-width:420px;">
              <input type="text" id="fim-callsign" maxlength="24" placeholder="Ex : VALKYRIE-1" value="${esc(p.file.callsign || '')}" style="flex:1;">
              <button class="btn small" type="submit">Enregistrer</button>
            </form>` : ''}
          ${isCommand ? `
            <div class="fim-editor-section">Unité</div>
            <form id="fim-unit-override-form" style="display:flex; gap:8px; max-width:520px; flex-wrap:wrap;">
              <select id="fim-unit-override" style="flex:1; min-width:220px;">
                <option value="">Automatique (rôle Discord, puis division)</option>
                ${UNITS.map((x) => `<option value="${x.id}"${p.file.unitOverride === x.id ? ' selected' : ''}>Imposer : FIM ${esc(x.name)}</option>`).join('')}
              </select>
              <button class="btn small" type="submit">Appliquer</button>
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
      document.getElementById('fim-unit-override-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await window.apiFetch('/api/rp/fim/personnel/unit', { method: 'PATCH', body: JSON.stringify({ name: p.name, unit: document.getElementById('fim-unit-override').value }) });
          window.showToast('Unité mise à jour.', 'success');
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
            <td>${p.unit ? `<span class="fim-chip u" style="--u:${unitColor(p.unit)}">${esc(unitLabel(p.unit))}</span>${p.forced ? ' <span style="font-size:10.5px; color:var(--warn);">imposée</span>' : p.viaRole ? ' <span style="font-size:10.5px; color:var(--ink-faint);">rôle Discord</span>' : ''}` : '<span style="color:var(--ink-faint);">—</span>'}</td>
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

  // ---------------------------------------------------------------
  // Gestion : absences, assiduité et dossiers des opérateurs.
  // Onglet réservé aux officiers, à la direction et au BDO (vérifié par le bot).
  // ---------------------------------------------------------------
  let gestionView = 'apercu';
  let gestionSelected = null;
  let gestionSearch = '';
  let gestionPeriod = 30;
  let gestionAllowed = null; // null : pas encore vérifié
  async function checkGestionTab() {
    if (gestionAllowed === null) {
      try {
        gestionAllowed = !!(await window.apiFetch('/api/rp/fim/gestion/access')).allowed;
      } catch (e) {
        gestionAllowed = false;
      }
    }
    return gestionAllowed;
  }

  const GESTION_STATUS = {
    present: { label: 'Présent', color: '#4FD895' },
    retard: { label: 'Retard', color: '#F0A83C' },
    excuse: { label: 'Excusé', color: '#5AA9FF' },
    absent: { label: 'Absent', color: '#F0525A' },
    silence: { label: 'Sans nouvelles', color: '#E0443F' },
  };
  // Assiduité d'un opérateur sur les opérations closes de la période :
  // convoqué = dans l'équipe (chef compris) ou a répondu ; présent en jeu
  // compte comme présent même sans réponse ; convoqué sans réponse ni
  // présence = « sans nouvelles ».
  function attendanceOf(name, ops) {
    const key = personKey(name);
    const rows = [];
    for (const o of ops) {
      const r = (o.rsvp || {})[key];
      const convoked = !!roleIn(o, name) || !!r;
      const minutes = presenceMinutes(o, name);
      if (!convoked && !minutes) continue;
      const closed = o.status === 'terminee';
      let status = r?.status || null;
      if (minutes > 0 && (!status || status === 'absent' || status === 'excuse')) status = status === 'retard' ? 'retard' : 'present';
      if (!status && closed) status = 'silence';
      rows.push({ op: o, status, rsvp: r || null, minutes, closed });
    }
    const counts = Object.fromEntries(Object.keys(GESTION_STATUS).map((k) => [k, rows.filter((x) => x.status === k).length]));
    const judged = rows.filter((x) => x.closed && x.status && x.status !== 'excuse'); // une absence excusée ne pénalise pas
    const ok = judged.filter((x) => x.status === 'present' || x.status === 'retard').length;
    const rate = judged.length ? Math.round((ok / judged.length) * 100) : null;
    return { rows, counts, rate, judged: judged.length };
  }
  const rateColor = (r) => (r == null ? 'var(--ink-faint)' : r >= 80 ? '#4FD895' : r >= 60 ? '#F0A83C' : '#F0525A');
  const opDate = (o) => o.scheduledAt || o.createdAt || 0;
  const dayFr = (t) => new Date(t).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  async function loadGestion() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement du panneau de gestion…</div>';
    let data;
    try {
      [data] = await Promise.all([window.apiFetch('/api/rp/fim/gestion'), loadPersonnel()]);
    } catch (err) {
      main.innerHTML = `<div class="center-msg">${err.message === 'gestion_only' ? 'Panneau réservé aux officiers, à la direction et au Bureau des opérations.' : `Erreur : ${esc(err.message)}`}</div>`;
      return;
    }
    if (mainEl() !== main) return;
    const since = Date.now() - gestionPeriod * 86400000;
    const periodOps = data.ops.filter((o) => opDate(o) >= since && opDate(o) <= Date.now() + 60000);
    const people = data.people.map((p) => ({ ...p, att: attendanceOf(p.name, periodOps) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    const absentNow = people.filter((p) => p.absence);
    const watch = people.filter((p) => (p.att.counts.absent + p.att.counts.silence) >= 2 || (p.att.rate != null && p.att.rate < 60 && p.att.judged >= 3));
    const upcoming = data.ops.filter((o) => o.status === 'planifiee' && opDate(o) >= Date.now() - 3600000).sort((a, b) => opDate(a) - opDate(b));
    const ctx = { data, people, periodOps, absentNow, watch, upcoming, main };

    setSide(
      [[String(people.length), 'Opérateurs'], [String(absentNow.length), 'Absents'], [String(watch.length), 'À surveiller'], [String(people.filter((p) => p.bdo).length), 'BDO']],
      absentNow.slice(0, 5).map((p) => [p.absence.until ? `→ ${dayFr(p.absence.until)}` : 'Absent', p.name])
    );
    main.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Gestion du personnel · accès ${esc(data.as)}</div>
        <h2>Gestion</h2>
        <p>Absences, assiduité aux opérations et dossiers des opérateurs. Réservé aux officiers, à la direction et au Bureau des opérations. Toute action est inscrite à l'audit.</p>
      </div>
      ${subTabs([['apercu', 'Vue d’ensemble'], ['absences', `Absences (${absentNow.length})`], ['assiduite', 'Assiduité'], ['dossiers', 'Dossiers'], ['bdo', 'BDO']], gestionView, 'data-gv')}
      <div id="fim-gestion-body"></div>`;
    main.querySelectorAll('[data-gv]').forEach((b) => b.addEventListener('click', () => { gestionView = b.dataset.gv; loadGestion(); }));
    const body = document.getElementById('fim-gestion-body');
    if (gestionView === 'absences') renderGestionAbsences(body, ctx);
    else if (gestionView === 'assiduite') renderGestionAttendance(body, ctx);
    else if (gestionView === 'dossiers') renderGestionDossiers(body, ctx);
    else if (gestionView === 'bdo') renderGestionBdo(body, ctx);
    else renderGestionOverview(body, ctx);
  }

  const periodPicker = () => `<div class="fim-g-period">Période : ${[30, 90, 180].map((d) => `<button type="button" data-gp="${d}" class="${gestionPeriod === d ? 'on' : ''}">${d} j</button>`).join('')}</div>`;
  function bindPeriod(body) {
    body.querySelectorAll('[data-gp]').forEach((b) => b.addEventListener('click', () => { gestionPeriod = Number(b.dataset.gp); loadGestion(); }));
  }
  function openDossier(name) {
    gestionSelected = name;
    gestionView = 'dossiers';
    loadGestion();
  }
  function bindOpenDossier(body) {
    body.querySelectorAll('[data-gopen]').forEach((el) => el.addEventListener('click', () => openDossier(el.dataset.gopen)));
  }

  function renderGestionOverview(body, { people, absentNow, watch, upcoming, periodOps }) {
    const answered = (o) => Object.keys(o.rsvp || {}).length;
    const convoked = (o) => new Set([o.leader, ...(o.team || []).map((m) => m.name)].filter(Boolean).map(personKey));
    const missing = (o) => [...convoked(o)].filter((k) => !(o.rsvp || {})[k]).length;
    const absentAt = (o) => people.filter((p) => p.absence && (!p.absence.until || p.absence.until >= opDate(o)) && convoked(o).has(p.key));
    const closed = periodOps.filter((o) => o.status === 'terminee');
    const all = people.map((p) => p.att).filter((a) => a.judged);
    const globalRate = all.length ? Math.round(all.reduce((s, a) => s + a.rate * a.judged, 0) / all.reduce((s, a) => s + a.judged, 0)) : null;
    body.innerHTML = `
      ${periodPicker()}
      <div class="fim-g-kpis">
        <div class="fim-g-kpi"><b>${people.length}</b><span>Opérateurs actifs</span></div>
        <div class="fim-g-kpi" style="--c:#F0525A"><b>${absentNow.length}</b><span>Absents en ce moment</span></div>
        <div class="fim-g-kpi" style="--c:${rateColor(globalRate)}"><b>${globalRate == null ? '—' : `${globalRate} %`}</b><span>Assiduité (${gestionPeriod} j)</span></div>
        <div class="fim-g-kpi"><b>${closed.length}</b><span>Opérations closes (${gestionPeriod} j)</span></div>
        <div class="fim-g-kpi" style="--c:#F0A83C"><b>${watch.length}</b><span>À surveiller</span></div>
      </div>
      <div class="fim-hq-grid fim-g-grid">
        <div class="fim-hq-card">
          <div class="fim-hq-card-head"><b>Absents en ce moment</b><button class="fim-link" data-gjump="absences">Tout voir</button></div>
          <div class="fim-hq-card-body">${absentNow.length ? absentNow.slice(0, 6).map((p) => `
            <div class="fim-hq-row clickable" style="--u:#F0525A" data-gopen="${esc(p.name)}"><span class="nm">${esc(p.name)}</span><span class="meta">${p.absence.until ? `jusqu'au ${esc(dayFr(p.absence.until))}` : 'sans date'}${p.absence.reason ? ` · ${esc(p.absence.reason)}` : ''}</span></div>`).join('') : '<div class="empty-row">Personne n’est déclaré absent.</div>'}</div>
        </div>
        <div class="fim-hq-card">
          <div class="fim-hq-card-head"><b>À surveiller</b><button class="fim-link" data-gjump="assiduite">Assiduité</button></div>
          <div class="fim-hq-card-body">${watch.length ? watch.slice(0, 6).map((p) => `
            <div class="fim-hq-row clickable" style="--u:#F0A83C" data-gopen="${esc(p.name)}"><span class="nm">${esc(p.name)}</span><span class="meta">${p.att.counts.absent} absence(s), ${p.att.counts.silence} sans nouvelles · <b style="color:${rateColor(p.att.rate)}">${p.att.rate == null ? '—' : `${p.att.rate} %`}</b></span></div>`).join('') : '<div class="empty-row">Aucun opérateur à surveiller sur la période.</div>'}</div>
          <div style="font-size:11px; color:var(--ink-faint);">Au moins 2 absences non excusées ou sans nouvelles, ou moins de 60 % de présence sur 3 opérations ou plus.</div>
        </div>
        <div class="fim-hq-card">
          <div class="fim-hq-card-head"><b>Opérations à venir</b></div>
          <div class="fim-hq-card-body">${upcoming.length ? upcoming.slice(0, 6).map((o) => { const abs = absentAt(o); return `
            <div class="fim-hq-row" style="--u:${unitColor(o.unit)}"><span class="nm">${esc(o.codeName)}</span><span class="meta">${o.scheduledAt ? esc(fmtDate(o.scheduledAt)) : 'non datée'} · ${answered(o)} réponse(s)${missing(o) ? ` · <b style="color:#F0A83C">${missing(o)} sans réponse</b>` : ''}${abs.length ? ` · <b style="color:#F0525A">${abs.length} absent(s) dans l'équipe</b>` : ''}</span></div>`; }).join('') : '<div class="empty-row">Aucune opération planifiée.</div>'}</div>
        </div>
      </div>`;
    bindPeriod(body);
    bindOpenDossier(body);
    body.querySelectorAll('[data-gjump]').forEach((b) => b.addEventListener('click', () => { gestionView = b.dataset.gjump; loadGestion(); }));
  }

  function absenceForm(prefix, people, preset) {
    const todayIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    return `
      <form class="fim-g-absform" id="${prefix}-form">
        ${preset ? `<input type="hidden" id="${prefix}-name" value="${esc(preset)}">` : `
          <input type="text" id="${prefix}-name" list="${prefix}-list" placeholder="Opérateur (nom RP)" required>
          <datalist id="${prefix}-list">${people.map((p) => `<option value="${esc(p.name)}">`).join('')}</datalist>`}
        <label>Retour prévu <input type="date" id="${prefix}-until" min="${todayIso}"></label>
        <input type="text" id="${prefix}-reason" maxlength="200" placeholder="Motif (vacances, examens, suspension…)">
        <button class="btn small" type="submit">Déclarer absent</button>
      </form>`;
  }
  function bindAbsenceForm(prefix) {
    document.getElementById(`${prefix}-form`)?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById(`${prefix}-name`).value.trim();
      const date = document.getElementById(`${prefix}-until`).value;
      if (!name) return;
      try {
        await window.apiFetch('/api/rp/fim/gestion/absence', { method: 'PUT', body: JSON.stringify({ name, until: date ? new Date(`${date}T23:59:59`).getTime() : null, reason: document.getElementById(`${prefix}-reason`).value.trim() }) });
        window.showToast(`${name} est déclaré absent : il ne sera plus mentionné dans les rappels.`, 'success');
        loadGestion();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }
  async function liftAbsence(name) {
    if (!confirm(`Lever l'absence de ${name} ?`)) return;
    try {
      await window.apiFetch(`/api/rp/fim/gestion/absence?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
      window.showToast('Absence levée.', 'success');
      loadGestion();
    } catch (err) {
      window.showToast(`Erreur : ${err.message}`, 'error');
    }
  }

  function renderGestionAbsences(body, { people, absentNow, periodOps }) {
    const opAbs = [];
    periodOps.forEach((o) => Object.values(o.rsvp || {}).forEach((r) => {
      if (r.status !== 'present') opAbs.push({ o, r });
    }));
    opAbs.sort((a, b) => opDate(b.o) - opDate(a.o));
    body.innerHTML = `
      <div class="fim-editor-section">Absences déclarées en cours</div>
      <div class="fim-staff-wrap"><table class="fim-staff"><thead><tr><th>Opérateur</th><th>Unité</th><th>Depuis</th><th>Retour prévu</th><th>Motif</th><th>Déclarée par</th><th></th></tr></thead><tbody>
        ${absentNow.length ? absentNow.map((p) => `<tr>
          <td><button class="fim-link-name" data-gopen="${esc(p.name)}">${esc(p.name)}</button></td>
          <td>${p.unit ? `<span class="fim-chip u" style="--u:${unitColor(p.unit)}">${esc(unitLabel(p.unit))}</span>` : '—'}</td>
          <td>${esc(dayFr(p.absence.since))}</td>
          <td>${p.absence.until ? `${esc(dayFr(p.absence.until))} <span style="color:var(--ink-faint); font-size:11px;">(${esc(relTime(p.absence.until))})</span>` : '<span style="color:var(--ink-faint);">non précisé</span>'}</td>
          <td>${esc(p.absence.reason || '—')}</td>
          <td>${esc(p.absence.by || 'lui-même')}</td>
          <td><button class="btn ghost small" data-glift="${esc(p.name)}">Lever</button></td>
        </tr>`).join('') : '<tr><td colspan="7" class="empty-row">Aucune absence déclarée.</td></tr>'}
      </tbody></table></div>
      <div class="fim-editor-section">Déclarer une absence pour un opérateur</div>
      ${absenceForm('g-abs', people)}
      <div style="font-size:11.5px; color:var(--ink-faint); margin-top:6px;">L'opérateur n'est plus mentionné dans les rappels Discord ; l'absence se lève seule à la date de retour.</div>
      <div class="fim-editor-section" style="display:flex; align-items:center; gap:12px;">Absences et retards aux opérations ${periodPicker()}</div>
      <div class="fim-staff-wrap"><table class="fim-staff"><thead><tr><th>Date</th><th>Opération</th><th>Opérateur</th><th>Statut</th><th>Motif</th><th>Saisi par</th></tr></thead><tbody>
        ${opAbs.length ? opAbs.map(({ o, r }) => { const m = GESTION_STATUS[r.status] || GESTION_STATUS.absent; return `<tr>
          <td>${esc(dayFr(opDate(o)))}</td>
          <td><span style="font-family:'JetBrains Mono', monospace;">${esc(o.codeName)}</span></td>
          <td><button class="fim-link-name" data-gopen="${esc(r.name)}">${esc(r.name)}</button></td>
          <td>${pill(m)}${r.status === 'retard' && r.delay ? ` <span style="font-size:11px; color:var(--ink-dim);">+${r.delay} min</span>` : ''}</td>
          <td>${esc(r.reason || '—')}</td>
          <td>${esc(r.by || 'lui-même')}</td>
        </tr>`; }).join('') : '<tr><td colspan="6" class="empty-row">Aucune absence ni retard sur la période.</td></tr>'}
      </tbody></table></div>`;
    bindAbsenceForm('g-abs');
    bindPeriod(body);
    bindOpenDossier(body);
    body.querySelectorAll('[data-glift]').forEach((b) => b.addEventListener('click', () => liftAbsence(b.dataset.glift)));
  }

  function renderGestionAttendance(body, { people }) {
    const rows = people.filter((p) => p.att.rows.length).sort((a, b) => (a.att.rate ?? 101) - (b.att.rate ?? 101) || b.att.counts.silence - a.att.counts.silence);
    const idle = people.filter((p) => !p.att.rows.length);
    body.innerHTML = `
      ${periodPicker()}
      <div class="fim-staff-wrap"><table class="fim-staff"><thead><tr><th>Opérateur</th><th>Unité</th>${Object.values(GESTION_STATUS).map((m) => `<th style="color:${m.color}">${m.label}</th>`).join('')}<th>Assiduité</th></tr></thead><tbody>
        ${rows.length ? rows.map((p) => `<tr class="clickable" data-gopen="${esc(p.name)}">
          <td><b>${esc(p.name)}</b>${p.absence ? ' <span class="fim-chip" style="color:#F0525A">absent</span>' : ''}</td>
          <td>${p.unit ? `<span class="fim-chip u" style="--u:${unitColor(p.unit)}">${esc(unitLabel(p.unit))}</span>` : '—'}</td>
          ${Object.keys(GESTION_STATUS).map((k) => `<td style="font-family:'JetBrains Mono', monospace;${p.att.counts[k] ? '' : ' color:var(--ink-faint);'}">${p.att.counts[k]}</td>`).join('')}
          <td><div class="fim-g-rate"><div style="width:${p.att.rate ?? 0}%; background:${rateColor(p.att.rate)}"></div></div><span style="font-family:'JetBrains Mono', monospace; color:${rateColor(p.att.rate)}">${p.att.rate == null ? '—' : `${p.att.rate} %`}</span></td>
        </tr>`).join('') : `<tr><td colspan="${Object.keys(GESTION_STATUS).length + 3}" class="empty-row">Aucune opération sur la période.</td></tr>`}
      </tbody></table></div>
      <div style="font-size:11.5px; color:var(--ink-faint); margin-top:8px; line-height:1.6;">
        Calculé sur les opérations closes de la période où l'opérateur était convoqué (dans l'équipe) ou a répondu. Présent en jeu = présent, même sans réponse. « Sans nouvelles » : convoqué, aucune réponse, jamais vu en jeu. Une absence excusée ne fait pas baisser le taux.
      </div>
      ${idle.length ? `<div class="fim-editor-section">Aucune opération sur la période (${idle.length})</div>
        <div class="fim-roster">${idle.map((p) => `<button class="fim-chip" data-gopen="${esc(p.name)}" style="cursor:pointer;">${esc(p.name)}</button>`).join('')}</div>` : ''}`;
    bindPeriod(body);
    bindOpenDossier(body);
  }

  function renderGestionDossiers(body, { data, people }) {
    const p = people.find((x) => personKey(x.name) === personKey(gestionSelected));
    const list = () => {
      const q = norm(gestionSearch);
      const shown = q ? people.filter((x) => [x.name, x.rank, x.callsign, x.unit && unitLabel(x.unit)].some((v) => norm(v).includes(q))) : people;
      document.getElementById('g-dos-body').innerHTML = shown.map((x) => `<tr class="clickable${p && x.key === p.key ? ' sel' : ''}" data-gopen="${esc(x.name)}">
        <td><b>${esc(x.name)}</b>${x.bdo ? ' <span class="fim-chip" style="color:var(--accent-2)">BDO</span>' : ''}</td>
        <td style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">${esc(x.callsign || '—')}</td>
        <td>${esc(x.rank || '—')}</td>
        <td>${x.unit ? `<span class="fim-chip u" style="--u:${unitColor(x.unit)}">${esc(unitLabel(x.unit))}</span>` : '—'}</td>
        <td>${x.absence ? '<span style="color:#F0525A">Absent</span>' : '<span style="color:#4FD895">Disponible</span>'}</td>
        <td style="font-family:'JetBrains Mono', monospace; color:${rateColor(x.att.rate)}">${x.att.rate == null ? '—' : `${x.att.rate} %`}</td>
        <td style="font-family:'JetBrains Mono', monospace;">${(x.notes || []).length}</td>
      </tr>`).join('') || '<tr><td colspan="7" class="empty-row">Aucun opérateur.</td></tr>';
      bindOpenDossier(document.getElementById('g-dos-body'));
    };
    body.innerHTML = `
      <div id="g-dossier"></div>
      <input type="text" id="g-dos-search" class="fim-search" placeholder="Rechercher un opérateur, un indicatif, un grade, une unité…" value="${esc(gestionSearch)}">
      <div class="fim-staff-wrap"><table class="fim-staff"><thead><tr><th>Opérateur</th><th>Indicatif</th><th>Grade</th><th>Unité</th><th>Statut</th><th>Assiduité ${gestionPeriod} j</th><th>Notes</th></tr></thead><tbody id="g-dos-body"></tbody></table></div>`;
    document.getElementById('g-dos-search').addEventListener('input', (e) => { gestionSearch = e.target.value; list(); });
    list();
    if (!p) return;

    const color = p.unit ? unitColor(p.unit) : '#6E76FF';
    const notes = [...(p.notes || [])].sort((a, b) => b.at - a.at);
    const isSelf = personKey(p.name) === personKey(data.self);
    const hist = [...p.att.rows].sort((a, b) => opDate(b.op) - opDate(a.op));
    const box = document.getElementById('g-dossier');
    box.innerHTML = `
      <div class="fim-dossier" style="--u:${color}; margin:0 0 18px;">
        <div class="fim-dossier-head" style="color:${color}">
          ${p.unit ? crest((UNITS.find((u) => u.id === p.unit) || {}).letter || '?') : ''}
          <div style="color:var(--ink); flex:1;">
            <h3>${esc(p.name)}${p.callsign ? ` <span style="color:${color}">« ${esc(p.callsign)} »</span>` : ''}</h3>
            <div class="fim-motto">${esc(p.rank || 'Opérateur')} · ${p.unit ? `FIM ${esc(unitLabel(p.unit))}` : 'sans unité'}${p.bdo ? ' · Bureau des opérations' : ''}${p.linked ? '' : ' · compte Discord non lié'}</div>
          </div>
          <button class="btn ghost small" type="button" id="g-dos-full">Dossier complet</button>
          <button class="btn ghost small" type="button" id="g-dos-close">Fermer</button>
        </div>
        <div class="fim-facts">
          <div class="fim-fact"><b>Statut</b><span style="color:${p.absence ? '#F0525A' : '#4FD895'}">${p.absence ? `Absent${p.absence.until ? ` → ${esc(dayFr(p.absence.until))}` : ''}` : 'Disponible'}</span></div>
          <div class="fim-fact"><b>Assiduité (${gestionPeriod} j)</b><span style="color:${rateColor(p.att.rate)}">${p.att.rate == null ? '—' : `${p.att.rate} %`} · ${p.att.judged} op.</span></div>
          ${Object.entries(GESTION_STATUS).map(([k, m]) => `<div class="fim-fact"><b>${m.label}</b><span style="color:${p.att.counts[k] ? m.color : 'var(--ink-faint)'}">${p.att.counts[k]}</span></div>`).join('')}
          <div class="fim-fact"><b>Félicitations / avert.</b><span>${notes.filter((n) => n.kind === 'felicitation').length} / ${notes.filter((n) => n.kind === 'avertissement').length}</span></div>
        </div>

        <div class="fim-editor-section">Absence</div>
        ${p.absence ? `
          <div class="fim-g-abs-now">
            <span><b style="color:#F0525A">Absent</b>${p.absence.until ? ` jusqu'au ${esc(dayFr(p.absence.until))}` : ', sans date de retour'}${p.absence.reason ? ` · « ${esc(p.absence.reason)} »` : ''} · déclarée ${p.absence.by ? `par ${esc(p.absence.by)}` : 'par lui-même'} le ${esc(dayFr(p.absence.since))}</span>
            <button class="btn ghost small" id="g-dos-lift">Lever l'absence</button>
          </div>` : absenceForm('g-dos-abs', people, p.name)}

        <div class="fim-editor-section">Historique des opérations (${gestionPeriod} j)</div>
        ${hist.length ? hist.map((x) => { const m = GESTION_STATUS[x.status]; return `
          <div class="fim-hq-row" style="--u:${unitColor(x.op.unit)}; margin-bottom:6px;">
            <span class="nm">${esc(x.op.codeName)}</span>
            <span class="meta">${esc(dayFr(opDate(x.op)))} · ${esc(roleIn(x.op, p.name) || 'hors équipe')}${x.minutes ? ` · ${fr(x.minutes, 0)} min en jeu` : ''}${x.rsvp?.reason ? ` · « ${esc(x.rsvp.reason)} »` : ''}${x.rsvp?.status === 'retard' && x.rsvp.delay ? ` · +${x.rsvp.delay} min` : ''}</span>
            ${m ? pill(m) : pill({ label: x.closed ? '—' : 'À venir', color: '#9297A8' })}
          </div>`; }).join('') : '<div class="empty-row" style="padding:12px;">Aucune opération sur la période.</div>'}

        <div class="fim-editor-section">Notes au dossier</div>
        ${notes.length ? notes.map((n) => `
          <div class="fim-note" style="--c:${(NOTE_META[n.kind] || NOTE_META.observation).color}">
            <div class="fim-note-head">${pill(NOTE_META[n.kind] || NOTE_META.observation)}<span>${esc(n.by)} · ${fmtDate(n.at)}</span></div>
            <div class="fim-note-text">${esc(n.text)}</div>
          </div>`).join('') : '<div class="empty-row" style="padding:12px;">Aucune note au dossier.</div>'}
        ${isSelf ? '' : `
          <form id="g-note-form" style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
            <select id="g-note-kind" style="width:auto;">${Object.entries(NOTE_META).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}</select>
            <input type="text" id="g-note-text" maxlength="1000" placeholder="Motif, contexte, opération concernée…" style="flex:1; min-width:220px;">
            <button class="btn small" type="submit">Ajouter au dossier</button>
          </form>`}

        ${data.canEditBdo ? `
          <div class="fim-editor-section">Bureau des opérations</div>
          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <span style="font-size:13px; color:var(--ink-dim);">${p.bdo ? 'Membre du BDO : accès au panneau Gestion.' : 'Pas membre du BDO.'}</span>
            <button class="btn ${p.bdo ? 'ghost' : ''} small" id="g-dos-bdo">${p.bdo ? 'Retirer du BDO' : 'Ajouter au BDO'}</button>
          </div>` : ''}
      </div>`;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('g-dos-close').addEventListener('click', () => { gestionSelected = null; loadGestion(); });
    document.getElementById('g-dos-full').addEventListener('click', () => { unitsView = 'effectifs'; staffSelected = p.name; goTab('fim-units'); });
    document.getElementById('g-dos-lift')?.addEventListener('click', () => liftAbsence(p.name));
    bindAbsenceForm('g-dos-abs');
    document.getElementById('g-note-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = document.getElementById('g-note-text').value.trim();
      if (!text) return;
      try {
        await window.apiFetch('/api/rp/fim/gestion/notes', { method: 'POST', body: JSON.stringify({ name: p.name, kind: document.getElementById('g-note-kind').value, text }) });
        window.showToast('Note ajoutée au dossier.', 'success');
        loadGestion();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
    document.getElementById('g-dos-bdo')?.addEventListener('click', () => setBdoMember(p.name, !p.bdo));
  }

  async function setBdoMember(name, member) {
    try {
      await window.apiFetch('/api/rp/fim/gestion/bdo', { method: 'POST', body: JSON.stringify({ name, member }) });
      window.showToast(member ? `${name} rejoint le Bureau des opérations.` : `${name} quitte le Bureau des opérations.`, 'success');
      loadGestion();
    } catch (err) {
      window.showToast(`Erreur : ${err.message}`, 'error');
    }
  }
  function renderGestionBdo(body, { data, people }) {
    const members = people.filter((p) => p.bdo);
    body.innerHTML = `
      <div style="font-size:13px; color:var(--ink-dim); line-height:1.6; margin-bottom:14px;">
        Les membres du <b>Bureau des opérations</b> accèdent au panneau Gestion sans être officiers. Les officiers et la direction y ont accès d'office.
        Voir le cours « Le Bureau des opérations : rôle et organisation » dans l'onglet Cours.
      </div>
      <div class="fim-staff-wrap"><table class="fim-staff"><thead><tr><th>Membre</th><th>Grade</th><th>Unité</th><th>Statut</th>${data.canEditBdo ? '<th></th>' : ''}</tr></thead><tbody>
        ${members.length ? members.map((p) => `<tr>
          <td><button class="fim-link-name" data-gopen="${esc(p.name)}">${esc(p.name)}</button></td>
          <td>${esc(p.rank || '—')}</td>
          <td>${p.unit ? `<span class="fim-chip u" style="--u:${unitColor(p.unit)}">${esc(unitLabel(p.unit))}</span>` : '—'}</td>
          <td>${p.absence ? '<span style="color:#F0525A">Absent</span>' : '<span style="color:#4FD895">Disponible</span>'}</td>
          ${data.canEditBdo ? `<td><button class="btn ghost small" data-gbdo-rm="${esc(p.name)}">Retirer</button></td>` : ''}
        </tr>`).join('') : `<tr><td colspan="${data.canEditBdo ? 5 : 4}" class="empty-row">Aucun membre désigné.</td></tr>`}
      </tbody></table></div>
      ${data.canEditBdo ? `
        <form id="g-bdo-form" style="display:flex; gap:8px; margin-top:12px; max-width:520px;">
          <input type="text" id="g-bdo-name" list="g-bdo-list" placeholder="Ajouter un opérateur (nom RP)" style="flex:1;" required>
          <datalist id="g-bdo-list">${people.filter((p) => !p.bdo).map((p) => `<option value="${esc(p.name)}">`).join('')}</datalist>
          <button class="btn small" type="submit">Ajouter au BDO</button>
        </form>` : '<div style="font-size:11.5px; color:var(--ink-faint); margin-top:8px;">Seuls les officiers et la direction peuvent modifier la liste.</div>'}`;
    bindOpenDossier(body);
    body.querySelectorAll('[data-gbdo-rm]').forEach((b) => b.addEventListener('click', () => {
      if (confirm(`Retirer ${b.dataset.gbdoRm} du BDO ?`)) setBdoMember(b.dataset.gbdoRm, false);
    }));
    document.getElementById('g-bdo-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('g-bdo-name').value.trim();
      const p = people.find((x) => personKey(x.name) === personKey(name));
      if (!p) { window.showToast('Opérateur introuvable dans le roster FIM.', 'error'); return; }
      setBdoMember(p.name, true);
    });
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
    const durationOf = (o) => {
      const log = o.statusLog || [];
      const a = log.find((l) => l.status === 'en_cours')?.at;
      const b = [...log].reverse().find((l) => l.status === 'terminee')?.at;
      return a && b && b > a ? (b - a) / 60000 : null;
    };
    const topTarget = (list) => {
      const c = {};
      list.forEach((o) => { if (o.target) c[o.target] = (c[o.target] || 0) + 1; });
      return Object.entries(c).sort((x, y) => y[1] - x[1])[0]?.[0] || '—';
    };
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
              <div><b>${(() => { const d = uo.map(durationOf).filter((x) => x != null); return d.length ? `${Math.round(avgOf(d))} min` : '—'; })()}</b><span>Durée moy.</span></div>
              <div><b style="color:${uo.some((o) => (o.casualties || []).length) ? '#F0525A' : 'inherit'}">${uo.reduce((a, o) => a + (o.casualties || []).length, 0)}</b><span>Pertes</span></div>
              <div><b style="font-size:12px;">${esc(topTarget(uo))}</b><span>Cible fréquente</span></div>
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
      </div>
      <div class="sci-card-actions" style="margin-top:16px;">
        <button class="btn ghost small" type="button" id="fim-csv-ops">Exporter les opérations (CSV)</button>
        <button class="btn ghost small" type="button" id="fim-csv-debriefs">Exporter les débriefings (CSV)</button>
        <button class="btn ghost small" type="button" id="fim-csv-evals" style="display:none;">Exporter les évaluations (CSV)</button>
      </div>
      <div id="fim-activity-cmd"></div>`;
    main.querySelectorAll('[data-period]').forEach((b) => b.addEventListener('click', () => { activityPeriod = +b.dataset.period; loadActivity(); }));
    const period = activityPeriod ? `${activityPeriod}j` : 'tout';
    document.getElementById('fim-csv-ops').addEventListener('click', () => downloadCsv(`fim-operations-${period}.csv`,
      ['Nom de code', 'Unité', 'Statut', 'Priorité', 'Heure prévue', 'Chef', 'Équipe', 'Zone', 'Cible', 'Durée (min)', 'Pertes', 'Émis par', 'Créé le'],
      pOps.map((o) => [o.codeName, unitLabel(o.unit), STATUS_META[o.status]?.label || o.status, PRIORITY_META[o.priority]?.label || o.priority, o.scheduledAt ? fmtDate(o.scheduledAt) : '', o.leader || '', (o.team || []).map((m) => m.name).join(' / '), o.zone || '', o.target || '', durationOf(o) != null ? Math.round(durationOf(o)) : '', (o.casualties || []).length, o.authorCharacterName || '', fmtDate(o.createdAt)])));
    document.getElementById('fim-csv-debriefs').addEventListener('click', () => downloadCsv(`fim-debriefings-${period}.csv`,
      ['Titre', 'Unité', 'Résultat', 'Entité', 'Pertes', 'Participants', 'Auteur', 'Date'],
      pDebriefs.map((d) => [d.title, unitLabel(d.unit), OUTCOME_META[d.outcome]?.label || d.outcome, d.scp || '', d.losses || '', d.participants || '', d.authorCharacterName || '', fmtDate(d.createdAt)])));
    loadActivityCommand(since, period);
  }

  // CSV lisible par Excel (séparateur ; et BOM UTF-8).
  function downloadCsv(filename, header, rows) {
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '\ufeff' + [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  // Partie commandement de l'onglet Activité : inactivité, suggestions de
  // promotion, rapport de la semaine, export des évaluations.
  const fmtHours = (sec) => (sec ? `${fr(sec / 3600, 1)} h` : '—');
  async function loadActivityCommand(since, period) {
    const box = document.getElementById('fim-activity-cmd');
    let act;
    let weekly;
    let evals = [];
    let ops = [];
    try {
      [act, weekly, evals, ops] = await Promise.all([
        window.apiFetch('/api/rp/fim/activity'),
        window.apiFetch('/api/rp/fim/weekly').catch(() => null),
        window.apiFetch('/api/rp/fim/evaluations').then((r) => r.evaluations || []).catch(() => []),
        window.apiFetch('/api/rp/fim/operations').then((r) => r.operations || []).catch(() => []),
      ]);
    } catch (err) {
      return; // pas du commandement : rien à afficher
    }
    if (!box || !box.isConnected) return;
    const evBtn = document.getElementById('fim-csv-evals');
    if (evBtn) {
      evBtn.style.display = '';
      evBtn.addEventListener('click', () => downloadCsv(`fim-evaluations-${period}.csv`,
        ['Opérateur', 'Grille', 'Unité', 'Contexte', 'Score (%)', 'Avis', 'Recommandation', 'Brevet', 'Évaluateur', 'Date'],
        evals.filter((e) => (e.createdAt || 0) >= since).map((e) => [e.agentName, e.grid?.name || 'Standard FIM', unitLabel(e.unit), CONTEXT_LABELS[e.context] || e.context || '', e.percent != null ? fr(e.percent, 1) : '', VERDICT_META[e.verdict]?.label || e.verdict || '', RECO_META[e.recommendation]?.label || e.recommendation || '', e.certified ? 'oui' : '', e.evaluatorName || '', fmtDate(e.createdAt)])));
    }
    const now = act.now || Date.now();
    const days = (t) => (t ? Math.floor((now - t) / 86400000) : null);
    const people = act.people || [];
    const inactive = people.filter((p) => !p.lastSeenFim || days(p.lastSeenFim) >= 14).sort((a, b) => (a.lastSeenFim || 0) - (b.lastSeenFim || 0));
    // Suggestions : au moins 5 missions et 75 % de moyenne, ou recommandation explicite.
    const promo = people.map((p) => {
      const ev = evals.filter((e) => norm(e.agentName) === norm(p.name));
      const avg = avgOf(ev.map((e) => e.percent).filter((v) => v != null));
      const missions = ops.filter((o) => roleIn(o, p.name) || presenceMinutes(o, p.name) > 0).length;
      const reco = ev.some((e) => e.recommendation === 'promotion');
      return { ...p, avg, missions, reco, evals: ev.length };
    }).filter((p) => p.reco || (p.missions >= 5 && p.avg != null && p.avg >= 75)).sort((a, b) => (b.avg || 0) - (a.avg || 0));
    box.innerHTML = `
      <div class="record-block" style="margin-top:24px;">
        <div class="record-block-head"><h2>Suivi d'inactivité</h2><span class="count">${inactive.length}</span></div>
        <p style="font-size:12px; color:var(--ink-faint); margin:0 0 10px;">Temps passé en jeu dans une équipe FIM (relevé par le jeu). Inactif = aucune présence FIM depuis 14 jours ou plus.</p>
        <div class="fim-staff-wrap"><table class="fim-staff"><thead><tr><th>Opérateur</th><th>Unité</th><th>FIM 7 j</th><th>FIM 30 j</th><th>Tout le jeu 30 j</th><th>Dernière présence FIM</th></tr></thead><tbody>
          ${[...people].sort((a, b) => (a.lastSeenFim || 0) - (b.lastSeenFim || 0)).map((p) => {
            const d = days(p.lastSeenFim);
            const c = d == null ? '#F0525A' : d >= 14 ? '#F0525A' : d >= 7 ? '#F0A83C' : '#4FD895';
            return `<tr>
              <td><b>${esc(withCallsign(p.name))}</b>${p.linked ? '' : ' <span style="font-size:10.5px; color:var(--warn);" title="Pas de compte Roblox lié à Discord">non lié</span>'}<div style="font-size:11px; color:var(--ink-faint);">${esc(p.rank || '')}</div></td>
              <td>${p.unit ? `<span class="fim-chip u" style="--u:${unitColor(p.unit)}">${esc(unitLabel(p.unit))}</span>` : '—'}</td>
              <td style="font-family:'JetBrains Mono', monospace;">${fmtHours(p.fim7)}</td>
              <td style="font-family:'JetBrains Mono', monospace;">${fmtHours(p.fim30)}</td>
              <td style="font-family:'JetBrains Mono', monospace; color:var(--ink-faint);">${fmtHours(p.total30)}</td>
              <td style="font-family:'JetBrains Mono', monospace; color:${c};">${d == null ? 'plus de 30 j' : d === 0 ? "aujourd'hui" : `il y a ${d} j`}</td>
            </tr>`;
          }).join('') || '<tr><td colspan="6" class="empty-row">Aucun opérateur.</td></tr>'}
        </tbody></table></div>
      </div>
      <div class="record-block" style="margin-top:24px;">
        <div class="record-block-head"><h2>Promotions à étudier</h2><span class="count">${promo.length}</span></div>
        <p style="font-size:12px; color:var(--ink-faint); margin:0 0 10px;">Proposés par une évaluation, ou au moins 5 missions avec 75 % de moyenne.</p>
        ${promo.length ? promo.map((p) => `<div class="fim-hq-row" style="--u:${p.unit ? unitColor(p.unit) : 'var(--accent)'}; margin-bottom:6px;">
          <span class="nm" style="font-family:'Space Grotesk', sans-serif; letter-spacing:0;">${esc(withCallsign(p.name))}</span>
          <span class="meta">${esc(p.rank || '')} · ${p.missions} mission${p.missions > 1 ? 's' : ''} · moyenne ${fmtPct(p.avg)} sur ${p.evals} éval.</span>
          ${p.reco ? pill({ label: 'Proposé', color: '#4FD895' }) : pill({ label: 'Critères atteints', color: '#5AA9FF' })}
        </div>`).join('') : '<div class="empty-row">Aucun opérateur ne remplit les critères pour le moment.</div>'}
      </div>
      ${weekly ? `<div class="record-block" style="margin-top:24px;">
        <div class="record-block-head"><h2>Rapport de la semaine</h2><span class="count">7 j</span></div>
        <p style="font-size:12px; color:var(--ink-faint); margin:0 0 10px;">Posté automatiquement chaque lundi à 10 h dans le salon des ordres du Discord.</p>
        <div class="fim-hq-kpis" style="grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));">
          <div><b>${weekly.created}</b><span>Ordres émis</span></div>
          <div><b>${weekly.closed}</b><span>Clôturées</span></div>
          <div><b>${weekly.debriefs}</b><span>Débriefings</span></div>
          <div><b>${weekly.debriefs ? `${Math.round((weekly.success / weekly.debriefs) * 100)} %` : '—'}</b><span>Succès</span></div>
          <div><b>${weekly.evaluations}</b><span>Évaluations</span></div>
          <div><b>${weekly.certs.length}</b><span>Brevets</span></div>
        </div>
        ${weekly.certs.length ? `<div class="fim-roster" style="margin-top:10px;">${weekly.certs.map((c) => `<span class="fim-chip">🎖 ${esc(c.name)} — ${esc(c.title)}</span>`).join('')}</div>` : ''}
        ${weekly.top.length ? `<div class="fim-roster" style="margin-top:8px;">${weekly.top.map((t) => `<span class="fim-chip">${esc(t.name)} · ${t.minutes} min</span>`).join('')}</div>` : ''}
      </div>` : ''}`;
  }

  // ---------------------------------------------------------------
  // Onglet Opérations
  // ---------------------------------------------------------------
  let opsFilter = 'actives';
  let opsSearch = '';
  let editingOp = null;
  let copyOp = null;
  const openJournals = new Set();
  const JOURNAL_META = {
    info: { label: 'Info', color: '#9297A8' },
    contact: { label: 'Contact', color: '#F0525A' },
    objectif: { label: 'Objectif', color: '#4FD895' },
    perte: { label: 'Perte', color: '#E0443F' },
    renfort: { label: 'Renfort', color: '#5AA9FF' },
    repli: { label: 'Repli', color: '#F0A83C' },
  };
  // Ma disponibilité : un opérateur absent n'est plus mentionné dans les
  // rappels Discord des ordres de mission (l'absence se lève à la date prévue).
  async function renderAvailability(el, editing = false) {
    if (!el) return;
    let absence = null;
    try {
      absence = (await window.apiFetch('/api/rp/fim/me/availability')).absence;
    } catch (e) {
      el.innerHTML = '';
      return;
    }
    if (!el.isConnected) return;
    const day = (t) => new Date(t).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const todayIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    let html;
    if (absence) {
      html = `
        <div class="fim-dispo-state"><i></i><div>
          <b>Absent${absence.until ? ` jusqu'au ${esc(day(absence.until))}` : ''}</b>
          <span>Tu n'es pas mentionné dans les rappels des opérations.${absence.reason ? ` Motif : ${esc(absence.reason)}` : ''}</span>
        </div></div>
        <button class="btn small" id="fim-dispo-back">Je suis de retour</button>`;
    } else if (editing) {
      html = `
        <div class="fim-dispo-form">
          <div class="field-row"><label>Retour prévu (facultatif)</label><input id="fim-dispo-until" type="date" min="${todayIso}"></div>
          <div class="field-row"><label>Motif (facultatif)</label><input id="fim-dispo-reason" type="text" maxlength="200" placeholder="Vacances, examens…"></div>
        </div>
        <div class="fim-dispo-actions">
          <button class="btn ghost small" id="fim-dispo-cancel">Annuler</button>
          <button class="btn small" id="fim-dispo-ok">Confirmer</button>
        </div>`;
    } else {
      html = `
        <div class="fim-dispo-state"><i></i><div>
          <b>Disponible</b>
          <span>Tu es mentionné dans les rappels Discord des opérations, 30 min avant l'heure prévue.</span>
        </div></div>
        <button class="btn ghost small" id="fim-dispo-away">Je serai absent</button>`;
    }
    el.className = `fim-dispo${absence ? ' away' : ''}${editing && !absence ? ' editing' : ''}`;
    el.innerHTML = `<div class="fim-dispo-title">Ma disponibilité</div>${html}`;

    el.querySelector('#fim-dispo-away')?.addEventListener('click', () => renderAvailability(el, true));
    el.querySelector('#fim-dispo-cancel')?.addEventListener('click', () => renderAvailability(el));
    el.querySelector('#fim-dispo-ok')?.addEventListener('click', async (e) => {
      const date = el.querySelector('#fim-dispo-until').value;
      const until = date ? new Date(`${date}T23:59:59`).getTime() : null; // fin de journée, heure locale
      e.currentTarget.disabled = true;
      try {
        await window.apiFetch('/api/rp/fim/me/absence', { method: 'PUT', body: JSON.stringify({ until, reason: el.querySelector('#fim-dispo-reason').value.trim() }) });
        window.showToast('Absence enregistrée : tu ne seras plus mentionné dans les rappels.', 'success');
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
      renderAvailability(el);
    });
    el.querySelector('#fim-dispo-back')?.addEventListener('click', async (e) => {
      e.currentTarget.disabled = true;
      try {
        await window.apiFetch('/api/rp/fim/me/absence', { method: 'DELETE' });
        window.showToast('Bon retour parmi nous !', 'success');
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
      renderAvailability(el);
    });
  }

  async function loadOperations() {
    const root = rootEl();
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
      <div id="fim-dispo"></div>
      ${subTabs(tabs, opsFilter, 'data-f')}
      <div id="fim-ops-body"></div>
    `;
    renderAvailability(document.getElementById('fim-dispo'));
    root.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.f !== 'nouvelle') { editingOp = null; copyOp = null; }
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
      opTemplates = await window.apiFetch('/api/rp/fim/op-templates').then((r) => r.templates || []).catch(() => []);
      const op = editingOp ? ops.find((o) => o.id === editingOp) : null;
      const tpl = !op && copyOp ? ops.find((o) => o.id === copyOp) || [...BASE_TEMPLATES, ...opTemplates].find((t) => t.id === copyOp) : null;
      copyOp = null;
      body.innerHTML = opForm(op, agents, tpl);
      bindOpForm(op, agents);
      return;
    }
    const ctx = { canCommand, self, debriefOf, agents };
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
      bindOpCards(document.getElementById('fim-ops-list'), ops);
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

  // Ordre de mission au format papier (nouvelle fenêtre + impression).
  function printOrder(o) {
    const w = window.open('', '_blank');
    if (!w) { window.showToast('Autorise les fenêtres surgissantes pour imprimer.', 'error'); return; }
    const row = (k, v) => (v ? `<tr><th>${k}</th><td>${esc(v)}</td></tr>` : '');
    const team = (o.team || []).map((m) => `<li>${esc(withCallsign(m.name))}${m.role ? ` — <i>${esc(m.role)}</i>` : ''}</li>`).join('');
    w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Ordre ${esc(o.codeName)}</title>
      <style>
        body{font-family:Georgia,serif;color:#111;max-width:760px;margin:32px auto;padding:0 24px;line-height:1.5}
        .head{display:flex;justify-content:space-between;border-bottom:3px double #111;padding-bottom:10px;font-family:'Courier New',monospace;font-size:12px;letter-spacing:.08em}
        h1{font-size:26px;letter-spacing:.06em;margin:22px 0 4px}
        .cls{display:inline-block;border:2px solid #a00;color:#a00;font-family:'Courier New',monospace;font-weight:bold;padding:2px 10px;letter-spacing:.15em;font-size:12px}
        table{border-collapse:collapse;width:100%;margin:18px 0}
        th{text-align:left;width:190px;font-family:'Courier New',monospace;font-size:12px;text-transform:uppercase;padding:6px 8px;border-bottom:1px solid #ccc;vertical-align:top}
        td{padding:6px 8px;border-bottom:1px solid #ccc}
        h2{font-family:'Courier New',monospace;font-size:13px;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid #111;margin-top:26px}
        .obj{white-space:pre-wrap}
        .sign{margin-top:48px;display:flex;justify-content:space-between;font-size:13px}
        .sign div{border-top:1px solid #111;padding-top:6px;width:42%}
      </style></head><body>
      <div class="head"><span>FONDATION SCP · SITE-15 · FORCES D'INTERVENTION MOBILES</span><span>${esc(fmtDate(o.createdAt))}</span></div>
      <h1>ORDRE DE MISSION — OPÉRATION ${esc(o.codeName)}</h1>
      <span class="cls">CONFIDENTIEL · ${esc((PRIORITY_META[o.priority] || PRIORITY_META.routine).label.toUpperCase())}</span>
      <table>
        ${row('Unité', unitLabel(o.unit))}
        ${row('Statut', STATUS_META[o.status]?.label || o.status)}
        ${row("Chef d'opération", o.leader ? withCallsign(o.leader) : '')}
        ${row('Heure prévue', o.scheduledAt ? fmtDate(o.scheduledAt) : '')}
        ${row('Point de ralliement', o.rallyPoint)}
        ${row('Zone', o.zone)}
        ${row('Cible / entité', o.target)}
        ${row("Règles d'engagement", o.roe)}
      </table>
      <h2>Objectif et déroulé</h2>
      <div class="obj">${esc(o.objective)}</div>
      ${team ? `<h2>Équipe (${(o.team || []).length})</h2><ul>${team}</ul>` : o.assigned ? `<h2>Affectés</h2><p>${esc(o.assigned)}</p>` : ''}
      <div class="sign"><div>Émis par ${esc(o.authorCharacterName)}</div><div>Visa du chef d'opération</div></div>
      <script>window.onload = () => window.print();<\/script>
      </body></html>`);
    w.document.close();
  }

  function bindOpCards(box, ops) {
    box._ops = ops || box._ops || [];
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
    if (!box._attBound) {
      box._attBound = true;
      box.addEventListener('click', (e) => onAttendanceClick(e, box));
    }
    box.querySelectorAll('[data-op-copy]').forEach((b) => b.addEventListener('click', () => {
      editingOp = null;
      copyOp = b.dataset.id;
      opsFilter = 'nouvelle';
      loadOperations();
    }));
    box.querySelectorAll('[data-op-print]').forEach((b) => b.addEventListener('click', () => {
      const o = (box._ops || []).find((x) => x.id === b.dataset.id);
      if (o) printOrder(o);
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

  // Présences à un ordre : chaque opérateur donne sa réponse (présent, en
  // retard de X min, absent, excusé) avec un motif ; le commandement peut
  // fixer celle de n'importe qui, y compris après l'opération (appel).
  const rsvpDetail = (r) => [
    r.status === 'retard' && r.delay ? `+${r.delay} min` : '',
    r.reason ? `« ${esc(r.reason)} »` : '',
    r.by ? `<i>fixé par ${esc(r.by)}</i>` : '',
  ].filter(Boolean).join(' · ');
  function rsvpForm(o, prefix, current) {
    const st = current?.status || '';
    return `
      <div class="fim-att-form" data-att-form="${prefix}">
        <div class="fim-roll-opts">${Object.entries(RSVP_META).map(([k, m]) => `<button type="button" style="--c:${m.color}" class="${st === k ? 'on' : ''}" data-att-status="${k}">${m.label}</button>`).join('')}</div>
        <select data-att-delay ${st === 'retard' ? '' : 'hidden'}>
          <option value="">Retard prévu…</option>
          ${RSVP_DELAYS.map((d) => `<option value="${d}" ${current?.delay === d ? 'selected' : ''}>${d} min</option>`).join('')}
        </select>
        <input type="text" data-att-reason maxlength="200" placeholder="Motif (facultatif)" value="${esc(current?.reason || '')}" ${st && st !== 'present' ? '' : 'hidden'}>
        <button type="button" class="btn small" data-att-save data-id="${esc(o.id)}" ${st ? '' : 'disabled'}>Enregistrer</button>
      </div>`;
  }
  // Clics du bloc Présences (délégués : les lignes ajoutées sont dynamiques)
  async function onAttendanceClick(e, box) {
    const t = e.target.closest('button');
    if (!t || !box.contains(t)) return;
    if (t.dataset.sheetSt) {
      const tr = t.closest('tr');
      const st = tr.dataset.st === t.dataset.sheetSt ? '' : t.dataset.sheetSt;
      tr.dataset.st = st;
      tr.classList.toggle('dirty', st !== tr.dataset.orig);
      tr.querySelectorAll('[data-sheet-st]').forEach((b) => {
        const on = b.dataset.sheetSt === st;
        b.classList.toggle('on', on);
        b.textContent = on ? SHEET_COLS.find(([k]) => k === st)[2] : '';
      });
      tr.querySelector('[data-att-delay]').hidden = st !== 'retard';
      tr.querySelector('[data-att-reason]').hidden = !st;
      return;
    }
    if (t.hasAttribute('data-sheet-validate')) {
      const sheet = t.closest('.fim-sheet');
      const live = !!sheet.dataset.live;
      const changes = [...sheet.querySelectorAll('tbody tr[data-att-name]')].map((tr) => {
        const reason = tr.querySelector('[data-att-reason]').value.trim();
        const delay = Number(tr.querySelector('[data-att-delay]').value) || null;
        let status = tr.dataset.st;
        if (!status && live) status = 'present';
        const touched = status !== tr.dataset.orig || tr.querySelector('[data-att-reason]').defaultValue !== reason
          || String(tr.querySelector('[data-att-delay] option[selected]')?.value || '') !== String(delay || '');
        return touched ? { name: tr.dataset.attName, status, reason: status === 'present' ? '' : reason, delay: status === 'retard' ? delay : null } : null;
      }).filter(Boolean);
      if (!changes.length) { window.showToast('Aucune modification.'); return; }
      t.disabled = true;
      let failed = 0;
      for (const c of changes) {
        try {
          await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(t.dataset.id)}/rsvp/manage`, { method: 'POST', body: JSON.stringify(c) });
        } catch (err) {
          failed += 1;
        }
      }
      if (failed) window.showToast(`${failed} ligne(s) non enregistrée(s), réessaie.`, 'error');
      else window.showToast(live ? `Appel validé (${changes.length} ligne(s)).` : `${changes.length} ligne(s) enregistrée(s).`, 'success');
      loadOperations();
      return;
    }
    const form = t.closest('[data-att-form]');
    if (t.dataset.attStatus !== undefined && form) {
      form.dataset.status = t.dataset.attStatus;
      form.querySelectorAll('[data-att-status]').forEach((b) => b.classList.toggle('on', b === t));
      form.querySelector('[data-att-delay]').hidden = t.dataset.attStatus !== 'retard';
      form.querySelector('[data-att-reason]').hidden = t.dataset.attStatus === 'present';
      form.querySelector('[data-att-save]').disabled = false;
      return;
    }
    const opId = t.dataset.id;
    const send = async (path, body, ok) => {
      t.disabled = true;
      try {
        await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(opId)}/${path}`, { method: 'POST', body: JSON.stringify(body) });
        window.showToast(ok, 'success');
        loadOperations();
      } catch (err) {
        t.disabled = false;
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    };
    if (t.hasAttribute('data-att-save') && form) {
      const status = form.dataset.status || form.querySelector('[data-att-status].on')?.dataset.attStatus;
      if (!status) return;
      const body = { status, delay: Number(form.querySelector('[data-att-delay]').value) || null, reason: form.querySelector('[data-att-reason]').value.trim() };
      const row = t.closest('[data-att-name]');
      if (row) await send('rsvp/manage', { ...body, name: row.dataset.attName }, `Présence de ${row.dataset.attName} enregistrée.`);
      else await send('rsvp', body, 'Réponse enregistrée.');
    } else if (t.hasAttribute('data-att-clear')) {
      const row = t.closest('[data-att-name]');
      await send('rsvp/manage', { name: row.dataset.attName, status: '' }, 'Réponse effacée.');
    } else if (t.hasAttribute('data-att-manage')) {
      if (attManageOpen.has(opId)) attManageOpen.delete(opId); else attManageOpen.add(opId);
      loadOperations();
    } else if (t.hasAttribute('data-att-add-btn')) {
      const input = t.parentElement.querySelector('[data-att-add]');
      const name = input.value.trim();
      const panel = t.closest('.fim-att-manage');
      if (!name) return;
      if ([...panel.querySelectorAll('[data-att-name]')].some((r) => personKey(r.dataset.attName) === personKey(name))) {
        window.showToast('Déjà dans la liste.', 'error');
        return;
      }
      const o = (box._ops || []).find((x) => x.id === opId) || { id: opId };
      const body = panel.querySelector('tbody');
      body.querySelector('tr.empty')?.remove();
      body.insertAdjacentHTML('beforeend', sheetRow(o, { agents: box._agents || [] }, name, null, body.children.length));
      body.lastElementChild.classList.add('dirty');
      input.value = '';
    }
  }

  // Feuille d'appel du commandement (façon Pronote) : une ligne par opérateur,
  // on ne coche que les absents, retards et excusés ; « Valider l'appel »
  // marque présents tous ceux qui ne sont pas cochés.
  const SHEET_COLS = [['absent', 'Abs.', 'A'], ['retard', 'Ret.', 'R'], ['excuse', 'Exc.', 'E']];
  function sheetRow(o, ctx, name, r, i) {
    const st = r?.status || '';
    const agent = (ctx.agents || []).find((a) => norm(a.name || a.username) === norm(name));
    const role = name === o.leader ? 'Chef d’opération' : (o.team || []).find((m) => norm(m.name) === norm(name))?.role || (r ? 'Hors équipe' : '');
    const mins = presenceMinutes(o, name);
    const initials = String(name).split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase();
    const tag = st && st !== 'present' ? `<span class="fim-sheet-tag" style="--c:${RSVP_META[st].color}">${RSVP_META[st].label.toUpperCase()}</span>` : '';
    return `
      <tr data-att-name="${esc(name)}" data-st="${st}" data-orig="${st}">
        <td class="num">${i + 1}</td>
        <td><div class="fim-sheet-who"><span class="fim-sheet-ava">${esc(initials)}</span><div><b>${esc(withCallsign(name))}${tag}</b><small>${esc([agent?.rank, role].filter(Boolean).join(' · '))}</small></div></div></td>
        <td><span class="fim-sheet-ig ${mins ? 'on' : ''}">${mins ? `● ${mins} min` : '—'}</span></td>
        ${SHEET_COLS.map(([k, , letter]) => `<td class="c"><button type="button" class="fim-sheet-box ${st === k ? 'on' : ''}" style="--c:${RSVP_META[k].color}" data-sheet-st="${k}" title="${RSVP_META[k].label}">${st === k ? letter : ''}</button></td>`).join('')}
        <td><div class="fim-sheet-motif">
          <select data-att-delay ${st === 'retard' ? '' : 'hidden'}><option value="">Minutes…</option>${RSVP_DELAYS.map((d) => `<option value="${d}" ${r?.delay === d ? 'selected' : ''}>${d} min</option>`).join('')}</select>
          <input type="text" data-att-reason maxlength="200" placeholder="Motif" value="${esc(r?.reason || '')}" ${st && st !== 'present' ? '' : 'hidden'}>
          ${r?.by ? `<span class="by">par ${esc(r.by)}</span>` : ''}
        </div></td>
      </tr>`;
  }
  function callSheet(o, ctx) {
    const rsvp = o.rsvp || {};
    const people = new Map();
    [o.leader, ...(o.team || []).map((m) => m.name)].filter(Boolean).forEach((n) => people.set(personKey(n), n));
    Object.entries(rsvp).forEach(([k, r]) => { if (!people.has(k)) people.set(k, r.name); });
    const roster = (ctx.agents || []).map((a) => a.name || a.username).filter(Boolean);
    const rows = [...people];
    const live = o.status === 'en_cours' || o.status === 'terminee';
    const done = rows.length > 0 && rows.every(([k]) => rsvp[k]);
    const lastAt = Math.max(0, ...Object.values(rsvp).filter((r) => r.by).map((r) => r.at || 0));
    const lastBy = Object.values(rsvp).find((r) => r.by && r.at === lastAt)?.by;
    const state = done
      ? `<span class="fim-sheet-state" style="--c:#4FD895">Appel fait${lastBy ? ` · ${esc(lastBy)}` : ''}${lastAt ? ` · ${fmtDate(lastAt)}` : ''}</span>`
      : `<span class="fim-sheet-state" style="--c:#F0A83C">${live ? 'Appel non fait' : 'Avant opération'}</span>`;
    const n = (k) => rows.filter(([key]) => rsvp[key]?.status === k).length;
    const counts = [['present', 'Présents'], ['absent', 'Absents'], ['retard', 'Retards'], ['excuse', 'Excusés']]
      .map(([k, l]) => `<span style="--c:${RSVP_META[k].color}">${l} <b>${n(k)}</b></span>`).join('')
      + `<span>Non renseignés <b style="--c:var(--ink)">${rows.filter(([k]) => !rsvp[k]).length}</b></span>`;
    return `
      <div class="fim-sheet fim-att-manage" data-live="${live ? 1 : ''}">
        <div class="fim-sheet-head">
          <h4>Feuille d'appel<small>${esc(o.codeName || '')} · ${fmtDate(o.scheduledAt || o.createdAt)}</small></h4>
          ${state}
          <div class="fim-sheet-count">${counts}</div>
        </div>
        <div class="fim-sheet-scroll"><table>
          <thead><tr><th class="num">N°</th><th>Opérateur</th><th>En jeu</th>${SHEET_COLS.map(([k, l]) => `<th class="c" title="${RSVP_META[k].label}">${l}</th>`).join('')}<th>Motif / retard</th></tr></thead>
          <tbody>${rows.map(([key, name], i) => sheetRow(o, ctx, name, rsvp[key], i)).join('') || `<tr class="empty"><td colspan="${4 + SHEET_COLS.length}" style="text-align:center;color:var(--ink-faint);padding:14px;">Aucune équipe prévue : ajoute un opérateur ci-dessous.</td></tr>`}</tbody>
        </table></div>
        <div class="fim-sheet-foot">
          <input type="text" list="fim-att-roster-${esc(o.id)}" data-att-add placeholder="Ajouter un opérateur à l'appel (nom RP)…">
          <datalist id="fim-att-roster-${esc(o.id)}">${roster.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
          <button type="button" class="btn ghost small" data-att-add-btn data-id="${esc(o.id)}">Ajouter</button>
          <button type="button" class="btn small" data-sheet-validate data-id="${esc(o.id)}">${live ? 'Valider l’appel' : 'Enregistrer'}</button>
          <span class="hint">${live ? 'Coche uniquement les absents, retards et excusés : à la validation, toute ligne non cochée est marquée présente.' : 'Avant l’opération : seules les lignes modifiées sont enregistrées (absences et retards annoncés).'}</span>
        </div>
      </div>`;
  }

  function rsvpBlock(o, ctx, mine) {
    const rsvp = o.rsvp || {};
    const answers = Object.values(rsvp);
    const open = o.status === 'planifiee' || o.status === 'en_cours';
    const canManage = ctx.canCommand && o.status !== 'annulee';
    const selfKey = personKey(ctx.self);
    if (!answers.length && !open && !canManage) return '';
    const count = (k) => answers.filter((a) => a.status === k).length;
    const order = Object.keys(RSVP_META);
    const sorted = Object.entries(rsvp).sort((a, b) => order.indexOf(a[1].status) - order.indexOf(b[1].status) || String(a[1].name).localeCompare(b[1].name));
    const managing = canManage && attManageOpen.has(o.id);
    const manage = managing ? callSheet(o, ctx) : '';
    return `<div class="fim-att" data-att-op="${esc(o.id)}">
      <div class="fim-rsvp">
        <span>Présences</span>
        ${order.map((k) => (count(k) ? `<span class="fim-chip" style="color:${RSVP_META[k].color}">${RSVP_META[k].label} · ${count(k)}</span>` : '')).join('') || '<span class="fim-chip">Aucune réponse</span>'}
        ${canManage ? `<button type="button" class="fim-link" style="margin-left:auto;" data-att-manage data-id="${esc(o.id)}">${managing ? 'Fermer' : 'Gérer les présences'}</button>` : ''}
      </div>
      ${sorted.length && !managing ? `
        <details class="fim-att-list">
          <summary>Détail des réponses (${sorted.length})</summary>
          ${sorted.map(([, r]) => `<div class="fim-att-line"><span class="fim-chip" style="--c:${RSVP_META[r.status]?.color};color:var(--c)">${RSVP_META[r.status]?.label || r.status}</span><b>${esc(withCallsign(r.name))}</b><span>${rsvpDetail(r)}</span></div>`).join('')}
        </details>` : ''}
      ${open && !managing ? `<div class="fim-att-mine"><span>Ma réponse${mine ? '' : ' (hors équipe)'}</span>${rsvpForm(o, 'self', rsvp[selfKey])}</div>` : ''}
      ${manage}
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
    actions.push(`<button class="btn ghost small" data-op-print data-id="${esc(o.id)}">Imprimer</button>`);
    if (ctx.canCommand) actions.push(`<button class="btn ghost small" data-op-copy data-id="${esc(o.id)}">Dupliquer</button>`);
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
        ${rsvpBlock(o, ctx, mine)}
        ${(o.casualties || []).length ? `<div class="fim-loss">PERTES · ${o.casualties.map((c) => `${esc(c.name)} ${c.kind === 'death' ? '✝' : '(à terre)'}`).join(' · ')}</div>` : ''}
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
  // tpl : ordre recopié (Dupliquer) — mêmes champs, mais création d'un nouvel ordre.
  function opForm(editOp, agents, tpl) {
    const op = editOp || (tpl ? { ...tpl, codeName: tpl.label ? tpl.codeName : `${tpl.codeName} II`.slice(0, 60), scheduledAt: null } : null);
    const allTemplates = [...BASE_TEMPLATES, ...opTemplates];
    formTeam = op ? (op.team || []).map((m) => ({ ...m })) : [];
    const names = agents.map((a) => a.name || a.username).filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr'));
    const roes = ['RDE-0 Observation', 'RDE-1 Riposte', 'RDE-2 Neutralisation', 'RDE-3 Feu libre', 'RDE-Ω Omega'];
    return `
      <div class="subsection" style="margin-top:0;">
        <h3>${editOp ? `Modifier l'ordre ${esc(editOp.codeName)}` : tpl ? (tpl.label ? `Nouvel ordre · modèle « ${esc(tpl.label)} »` : `Nouvel ordre d'après ${esc(tpl.codeName)}`) : 'Émettre un ordre de mission'}</h3>
        <form id="fim-op-form">
          ${editOp ? '' : `<div class="field-row" style="display:flex; gap:8px; align-items:flex-end; flex-wrap:wrap;">
            <div style="flex:1; min-width:220px;"><label>Partir d'un modèle</label><select id="op-template"><option value="">— Ordre vierge —</option>${allTemplates.map((t) => `<option value="${esc(t.id)}"${tpl && tpl.id === t.id ? ' selected' : ''}>${esc(t.label)}${t.createdBy ? ` · ${esc(t.createdBy)}` : ''}</option>`).join('')}</select></div>
            ${opTemplates.length ? '<button class="btn ghost small" type="button" id="op-template-del">Supprimer ce modèle</button>' : ''}
          </div>`}
          <div class="fim-editor-section">Mission</div>
          <div class="field-grid">
            <div class="field-row"><label>Nom de code *</label><input id="op-code" maxlength="60" placeholder="Ex : RENARD NOIR" required value="${op ? esc(op.codeName) : ''}"></div>
            <div class="field-row"><label>Unité</label><select id="op-unit">${UNIT_OPTIONS.map((u) => `<option value="${u}"${op && op.unit === u ? ' selected' : ''}>${esc(unitLabel(u))}</option>`).join('')}</select></div>
            <div class="field-row"><label>Priorité</label><select id="op-priority">${Object.entries(PRIORITY_META).map(([k, m]) => `<option value="${k}"${op && op.priority === k ? ' selected' : ''}>${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Règles d'engagement</label><select id="op-roe">${roes.map((r, i) => `<option${op ? (op.roe === r ? ' selected' : '') : i === 1 ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
            <div class="field-row"><label>Zone</label><input id="op-zone" maxlength="80" list="fim-places" placeholder="Ex : Zone de confinement lourde" value="${op ? esc(op.zone || '') : ''}"></div>
            <div class="field-row"><label>Cible / entité</label><input id="op-target" maxlength="80" placeholder="Ex : SCP-939, cellule IC…" list="fim-scp-list" value="${op ? esc(op.target || '') : ''}"></div>
            <div class="field-row"><label>Heure prévue</label><input id="op-time" type="datetime-local" value="${op ? toLocalInput(op.scheduledAt) : ''}"></div>
            <div class="field-row"><label>Point de ralliement</label><input id="op-rally" maxlength="120" list="fim-places" placeholder="Ex : quai D-FIM, Gate A" value="${op ? esc(op.rallyPoint || '') : ''}"></div>
          </div>
          <datalist id="fim-places">${SITE_PLACES.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
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
            <button class="btn" type="submit">${editOp ? 'Enregistrer les modifications' : 'Émettre l’ordre'}</button>
            ${op ? '<button class="btn ghost" type="button" id="op-cancel">Annuler</button>' : ''}
            <button class="btn ghost" type="button" id="op-save-template" style="margin-left:auto;">Enregistrer comme modèle</button>
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
    document.getElementById('op-template')?.addEventListener('change', (e) => { copyOp = e.target.value || null; loadOperations(); });
    document.getElementById('op-template-del')?.addEventListener('click', async () => {
      const id = document.getElementById('op-template').value;
      if (!opTemplates.some((t) => t.id === id)) { window.showToast('Choisis un modèle enregistré par le commandement (les modèles fournis ne se suppriment pas).', 'error'); return; }
      if (!confirm('Supprimer ce modèle d’ordre ?')) return;
      try {
        await window.apiFetch(`/api/rp/fim/op-templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
        window.showToast('Modèle supprimé.', 'success');
        copyOp = null;
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
    document.getElementById('op-save-template').addEventListener('click', async () => {
      const label = prompt('Nom du modèle (ex : Reconfinement SCP-096) :');
      if (!label || !label.trim()) return;
      const v = (id) => document.getElementById(id).value.trim();
      try {
        await window.apiFetch('/api/rp/fim/op-templates', { method: 'POST', body: JSON.stringify({
          label: label.trim(), codeName: v('op-code'), unit: v('op-unit'), priority: v('op-priority'), roe: v('op-roe'), zone: v('op-zone'), target: v('op-target'),
          objective: v('op-objective'), leader: v('op-leader'), rallyPoint: v('op-rally'), team: formTeam.map((m) => ({ name: m.name, role: (m.role || '').trim() })),
        }) });
        window.showToast('Modèle enregistré.', 'success');
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
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
  let editingDebrief = null;
  let focusDebrief = null;
  let debriefSearch = '';
  // Déroulé proposé d'après le journal de bord et le relevé du jeu.
  function autoSummary(o) {
    const log = o.statusLog || [];
    const start = log.find((l) => l.status === 'en_cours')?.at;
    const end = [...log].reverse().find((l) => l.status === 'terminee')?.at;
    const lines = [];
    if (start) lines.push(`Lancée le ${fmtDate(start)}${end ? `, clôturée le ${fmtDate(end)} (${Math.max(1, Math.round((end - start) / 60000))} min)` : ''}.`);
    if (o.objective) lines.push(`Objectif : ${o.objective.split('\n')[0]}`);
    const journal = [...(o.journal || [])].sort((a, b) => a.at - b.at);
    if (journal.length) {
      lines.push('', 'Chronologie :');
      journal.forEach((e) => lines.push(`- ${new Date(e.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} [${(JOURNAL_META[e.kind] || JOURNAL_META.info).label}] ${e.text}`));
    }
    return lines.join('\n');
  }
  function autoLosses(o) {
    const list = o.casualties || [];
    if (!list.length) return '';
    const deaths = list.filter((c) => c.kind === 'death').length;
    const downs = list.length - deaths;
    return [deaths ? `${deaths} tué${deaths > 1 ? 's' : ''}` : '', downs ? `${downs} à terre` : ''].filter(Boolean).join(', ') + ` (${[...new Set(list.map((c) => c.name))].join(', ')})`;
  }

  function renderDebriefs(body, debriefs, ops) {
    const success = debriefs.filter((d) => d.outcome === 'succes').length;
    setSide(
      [[String(debriefs.length), 'Débriefings'], [debriefs.length ? `${Math.round((success / debriefs.length) * 100)}%` : '—', 'Succès']],
      debriefs.slice(0, 5).map((d) => [new Date(d.createdAt).toLocaleDateString('fr-FR'), d.title])
    );
    const ed = editingDebrief ? debriefs.find((d) => d.id === editingDebrief) : null;
    editingDebrief = null;
    const preOp = ed ? null : ops.find((o) => o.id === pendingDebriefOp);
    pendingDebriefOp = null;
    const formOpen = !!(preOp || ed);
    const val = (k) => (ed ? esc(ed[k] || '') : '');
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
        <button class="btn small" type="button" id="fim-db-toggle">${formOpen ? 'Fermer le formulaire' : '+ Rédiger un débriefing'}</button>
      </div>
      <div class="subsection" id="fim-db-formbox" style="margin:0 0 24px;${formOpen ? '' : ' display:none;'}">
        <h3>${ed ? `Modifier le débriefing « ${esc(ed.title)} »` : preOp ? `Débriefing de l'opération ${esc(preOp.codeName)}` : 'Rédiger un débriefing'}</h3>
        <form id="fim-db-form">
          <div class="field-grid">
            <div class="field-row"><label>Titre *</label><input id="db-title" maxlength="120" required value="${ed ? val('title') : preOp ? `Opération ${esc(preOp.codeName)}` : ''}"></div>
            <div class="field-row"><label>Opération liée</label><select id="db-op"><option value="">— Aucune —</option>${ops.map((o) => `<option value="${esc(o.id)}"${(preOp && preOp.id === o.id) || (ed && ed.operationId === o.id) ? ' selected' : ''}>${esc(o.codeName)} (${esc(STATUS_META[o.status]?.label || o.status)})</option>`).join('')}</select></div>
            <div class="field-row"><label>Unité</label><select id="db-unit">${UNIT_OPTIONS.map((u) => `<option value="${u}"${(preOp && preOp.unit === u) || (ed && ed.unit === u) ? ' selected' : ''}>${esc(unitLabel(u))}</option>`).join('')}</select></div>
            <div class="field-row"><label>Résultat</label><select id="db-outcome">${Object.entries(OUTCOME_META).map(([k, m]) => `<option value="${k}"${ed && ed.outcome === k ? ' selected' : ''}>${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Entité / adversaire</label><input id="db-scp" maxlength="60" list="fim-scp-list2" value="${ed ? val('scp') : preOp ? esc(preOp.target || '') : ''}"></div>
            <div class="field-row"><label>Pertes et blessés</label><input id="db-losses" maxlength="200" placeholder="Ex : 1 blessé léger, aucun mort" value="${ed ? val('losses') : preOp ? esc(autoLosses(preOp).slice(0, 200)) : ''}"></div>
          </div>
          <datalist id="fim-scp-list2">${SCPS.map((s) => `<option value="${s.id}">`).join('')}<option value="Insurrection du Chaos"></datalist>
          <div class="field-row"><label>Participants${preOp && presenceList(preOp).length ? ' (pré-rempli : présents en jeu)' : ''}</label><textarea id="db-participants" rows="2" maxlength="1000" placeholder="Ex : RENARD-1 (chef), RENARD-2…">${ed ? val('participants') : preOp ? esc(presenceText(preOp)) : ''}</textarea></div>
          <div class="field-row"><label>Déroulé *</label><textarea id="db-summary" rows="8" maxlength="6000" required>${ed ? val('summary') : preOp ? esc(autoSummary(preOp).slice(0, 6000)) : ''}</textarea></div>
          <div class="field-row"><label>Leçons et recommandations</label><textarea id="db-lessons" rows="3" maxlength="3000">${val('lessons')}</textarea></div>
          <button class="btn" type="submit">${ed ? 'Enregistrer les modifications' : 'Enregistrer le débriefing'}</button>
          ${ed ? '<button class="btn ghost" type="button" id="db-cancel-edit">Annuler</button>' : ''}
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
          ${d.updatedBy ? `<div class="fim-op-meta"><span>Modifié par ${esc(d.updatedBy)} · ${fmtDate(d.updatedAt)}</span></div>` : ''}
          ${d.canEdit ? `<div class="sci-card-actions"><button class="btn ghost small" type="button" data-db-edit="${esc(d.id)}">Modifier</button><button class="btn danger small" type="button" data-db-del="${esc(d.id)}">Supprimer</button></div>` : ''}
        </div>`).join('') : '<div class="empty-row">Aucun débriefing.</div>';
    };
    renderList();
    document.getElementById('fim-db-list').addEventListener('click', async (e) => {
      const edit = e.target.closest('[data-db-edit]');
      const del = e.target.closest('[data-db-del]');
      if (edit) {
        editingDebrief = edit.dataset.dbEdit;
        renderDebriefs(body, debriefs, ops);
        document.getElementById('fim-db-formbox')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (del) {
        if (!confirm('Supprimer définitivement ce débriefing ?')) return;
        try {
          await window.apiFetch(`/api/rp/fim/debriefs/${encodeURIComponent(del.dataset.dbDel)}`, { method: 'DELETE' });
          window.showToast('Débriefing supprimé.', 'success');
          opsFilter = 'debriefs';
          loadOperations();
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      }
    });
    document.getElementById('db-cancel-edit')?.addEventListener('click', () => renderDebriefs(body, debriefs, ops));
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
      if (op && !document.getElementById('db-summary').value.trim()) document.getElementById('db-summary').value = autoSummary(op);
      if (op && op.target && !document.getElementById('db-scp').value.trim()) document.getElementById('db-scp').value = op.target;
      if (op && !document.getElementById('db-losses').value.trim()) document.getElementById('db-losses').value = autoLosses(op).slice(0, 200);
    });
    document.getElementById('fim-db-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const payload = { title: v('db-title'), operationId: v('db-op'), unit: v('db-unit'), outcome: v('db-outcome'), scp: v('db-scp'), losses: v('db-losses'), participants: v('db-participants'), summary: v('db-summary'), lessons: v('db-lessons') };
      if (!payload.title || !payload.summary) { window.showToast('Titre et déroulé obligatoires.', 'error'); return; }
      try {
        if (ed) await window.apiFetch(`/api/rp/fim/debriefs/${encodeURIComponent(ed.id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
        else await window.apiFetch('/api/rp/fim/debriefs', { method: 'POST', body: JSON.stringify(payload) });
        window.showToast(ed ? 'Débriefing modifié.' : 'Débriefing enregistré.', 'success');
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
    const root = rootEl();
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
  // Onglet Cours (supports déposés par le commandement, rangés comme les
  // grilles d'évaluation : formation, combat, unités, passages de grade)
  // ---------------------------------------------------------------
  let courseSel = null; // { kind: 'grid' | 'course' | 'new' | 'edit', id }
  let courseView = 'read'; // 'read' (cours) ou 'trainer' (espace formateur)
  let trainerSel = null; // id du cours ouvert dans l'espace formateur
  let courseData = { courses: [], grids: [], canManage: false };
  const COURSE_GROUPS = [
    { key: 'grade', label: 'Passages de grade', test: (id) => id.startsWith('grade_') },
    { key: 'form', label: 'Formation de base', test: (id) => id.startsWith('form_') },
    { key: 'combat', label: 'Combat rapproché', test: (id) => id === 'cqc' || id === 'cqb' },
    { key: 'unit', label: "Qualifications d'unité", test: (id) => id.startsWith('unit_') },
    { key: 'other', label: 'Autres grilles', test: () => true },
  ];
  const courseGroupOf = (gridId) => COURSE_GROUPS.find((g) => g.test(gridId));

  async function loadCourses() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    try {
      const d = await window.apiFetch('/api/rp/fim/courses');
      courseData = { courses: d.courses || [], grids: d.grids || [], canManage: !!d.canManage };
    } catch (err) {
      main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    const live = courseData.courses.filter((c) => !c.archived);
    setSide([[String(live.length), 'Cours'], [String(courseData.grids.length), 'Dossiers']], live.slice(0, 5).map((c) => [new Date(c.updatedAt || c.createdAt).toLocaleDateString('fr-FR'), c.title]));
    if (!courseSel) courseSel = { kind: 'grid', id: courseData.grids.find((g) => g.id.startsWith('grade_'))?.id || courseData.grids[0]?.id };

    main.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Commandement FIM · centre de formation</div>
        <h2>Cours</h2>
        <p>Les supports de cours rangés comme les évaluations : chaque dossier reprend le programme de sa grille (ce sur quoi tu seras évalué) et les cours déposés par le commandement.</p>
      </div>
      ${courseData.canManage ? subTabs([['read', 'Cours'], ['trainer', 'Espace formateur']], courseView, 'data-cview') : ''}
      <div id="fim-trainer-body"></div>
      <div class="wiki-layout" id="fim-course-layout">
        <div class="wiki-toc">
          <div class="wiki-toc-head"><span class="record-block-head-title">Cours FIM</span><span class="count">${live.length}</span></div>
          ${courseData.canManage ? '<button class="btn small" id="fim-course-new" type="button" style="width:100%; margin-top:10px;">+ Déposer un cours</button>' : ''}
          <input type="text" id="fim-course-search" class="fim-search" placeholder="Rechercher un cours…" style="width:100%; margin-top:10px;">
          <div class="wiki-toc-list" id="fim-course-toc"></div>
        </div>
        <div class="wiki-article" id="fim-course-article"></div>
      </div>`;
    document.getElementById('fim-course-new')?.addEventListener('click', () => {
      courseSel = { kind: 'new', id: courseSel?.kind === 'grid' ? courseSel.id : '' };
      renderCourseToc();
      renderCourseArticle();
    });
    document.getElementById('fim-course-search').addEventListener('input', (e) => renderCourseToc(e.target.value));
    main.querySelectorAll('[data-cview]').forEach((b) => b.addEventListener('click', () => { courseView = b.dataset.cview; loadCourses(); }));
    if (courseView === 'trainer' && courseData.canManage) {
      document.getElementById('fim-course-layout').style.display = 'none';
      renderTrainer(document.getElementById('fim-trainer-body'));
      return;
    }
    renderCourseToc();
    renderCourseArticle();
  }

  function renderCourseToc(query = '') {
    const list = document.getElementById('fim-course-toc');
    if (!list) return;
    const q = norm(query);
    const visible = courseData.courses.filter((c) => !q || norm(`${c.title} ${c.summary || ''} ${c.category || ''}`).includes(q));
    const head = (label) => `<div style="font-family:'JetBrains Mono', monospace; font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); padding:10px 10px 4px;">${esc(label)}</div>`;
    const item = (sel, title, meta, extra = '') => `<button class="wiki-toc-item${courseSel?.kind === sel.kind && courseSel?.id === sel.id ? ' active' : ''}" data-csel="${sel.kind}:${esc(sel.id)}" type="button"${extra}><span class="wiki-toc-title">${esc(title)}</span><span class="wiki-toc-meta">${esc(meta)}</span></button>`;
    let html = '';
    for (const group of COURSE_GROUPS) {
      const grids = courseData.grids.filter((g) => courseGroupOf(g.id) === group);
      const rows = grids.map((g) => {
        const cs = visible.filter((c) => c.gridId === g.id);
        if (q && !cs.length && !norm(g.name).includes(q)) return '';
        return item({ kind: 'grid', id: g.id }, g.name.replace(/^[^·]*·\s*/, ''), `${cs.filter((c) => !c.hidden).length} cours`)
          + cs.map((c) => item({ kind: 'course', id: c.id }, `↳ ${c.title}`, c.hidden ? 'Masqué' : '', ' style="padding-left:22px;"')).join('');
      }).join('');
      if (rows) html += head(group.label) + rows;
    }
    const gridIds = new Set(courseData.grids.map((g) => g.id));
    const free = {};
    visible.filter((c) => !c.gridId || !gridIds.has(c.gridId)).forEach((c) => (free[c.category || 'Cours libres'] = free[c.category || 'Cours libres'] || []).push(c));
    Object.entries(free).forEach(([cat, cs]) => { html += head(cat) + cs.map((c) => item({ kind: 'course', id: c.id }, c.title, c.hidden ? 'Masqué' : c.authorName)).join(''); });
    list.innerHTML = html || '<div class="empty-row">Aucun résultat.</div>';
    list.querySelectorAll('[data-csel]').forEach((b) => b.addEventListener('click', () => {
      const [kind, ...rest] = b.dataset.csel.split(':');
      courseSel = { kind, id: rest.join(':') };
      renderCourseToc(document.getElementById('fim-course-search')?.value || '');
      renderCourseArticle();
    }));
  }

  // Markdown du site + liens internes [[Titre d'un cours ou d'un dossier]]
  // ou [[Titre|texte affiché]].
  function courseMarkdown(md) {
    return window.renderMarkdown(md).replace(/\[\[([^\]<>]{1,160})\]\]/g, (all, inner) => {
      const [raw, label = raw] = inner.split('|');
      const q = norm(raw.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
      const c = courseData.courses.find((x) => norm(x.title) === q);
      const g = !c && courseData.grids.find((x) => norm(x.name) === q || norm(x.name.replace(/^[^·]*·\s*/, '')) === q);
      if (!c && !g) return `<span title="Aucun cours ou dossier ne porte ce titre" style="border-bottom:1px dashed var(--ink-faint);">${label}</span>`;
      return `<a href="#" data-clink="${c ? 'course' : 'grid'}:${esc(c ? c.id : g.id)}" style="color:var(--accent-2); font-weight:600;">${label}</a>`;
    });
  }
  function bindCourseLinks(root) {
    root.querySelectorAll('[data-clink]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const [kind, ...rest] = a.dataset.clink.split(':');
      courseSel = { kind, id: rest.join(':') };
      renderCourseToc(document.getElementById('fim-course-search')?.value || '');
      renderCourseArticle();
      document.getElementById('fim-course-article')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  function courseCard(c) {
    return `<button type="button" class="fim-grid-card" data-copen="${esc(c.id)}" style="text-align:left; cursor:pointer;">
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;"><h4 style="margin-right:auto;">${esc(c.title)}</h4>${c.hidden ? '<span class="fim-pill" style="--c:var(--warn)">Masqué</span>' : ''}${c.duration ? `<span class="fim-pill">${c.duration} min</span>` : ''}</div>
      ${c.summary ? `<p>${esc(c.summary)}</p>` : ''}
      <div class="fim-op-meta" style="margin:0;"><span>Par <b>${esc(c.authorName || '—')}</b></span><span>${fmtDate(c.updatedAt || c.createdAt)}</span>${(c.links || []).length ? `<span><b>${c.links.length}</b> lien(s)</span>` : ''}</div>
    </button>`;
  }

  function renderCourseArticle() {
    const article = document.getElementById('fim-course-article');
    if (!article) return;
    const sel = courseSel || {};
    if (sel.kind === 'new' || sel.kind === 'edit') { renderCourseEditor(article, sel.kind === 'edit' ? courseData.courses.find((c) => c.id === sel.id) : null, sel.kind === 'new' ? sel.id : ''); return; }
    const bindCards = () => article.querySelectorAll('[data-copen]').forEach((b) => b.addEventListener('click', () => { courseSel = { kind: 'course', id: b.dataset.copen }; renderCourseToc(); renderCourseArticle(); }));

    if (sel.kind === 'grid') {
      const g = courseData.grids.find((x) => x.id === sel.id);
      if (!g) { article.innerHTML = '<div class="wiki-empty"><div class="wiki-empty-title">Cours FIM</div><p>Sélectionne un dossier.</p></div>'; return; }
      const cs = courseData.courses.filter((c) => c.gridId === g.id);
      const total = g.criteria.reduce((a, c) => a + c.weight, 0) || 1;
      article.innerHTML = `
        <div class="wiki-article-head"><span class="fim-pill" style="--c:var(--accent-2)">${esc(courseGroupOf(g.id).label)}</span>${g.pathway ? '<span class="fim-pill" style="--c:#B07CFF">Parcours ERI</span>' : ''}</div>
        <h2 class="wiki-article-title">${esc(g.name)}</h2>
        ${g.description ? `<p style="color:var(--ink-dim); font-size:13px; line-height:1.6; margin-bottom:16px;">${esc(g.description)}</p>` : ''}
        <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:8px 0 10px;">Programme de l'évaluation</h3>
        <div class="sci-body-rendered fim-table">${window.renderMarkdown(`| Point évalué | Ce qui est attendu | Poids |\n|---|---|---|\n${g.criteria.map((c) => `| **${c.label.replace(/\|/g, '/')}** | ${(c.hint || '—').replace(/\|/g, '/')} | ${Math.round((c.weight / total) * 100)} % |`).join('\n')}`)}</div>
        <p style="font-size:12px; color:var(--ink-faint); margin:8px 0 22px;">Avis « Conforme » à partir de <b>${esc(String(g.thresholds?.conforme ?? 55))} %</b>, « Excellent » à partir de <b>${esc(String(g.thresholds?.excellent ?? 80))} %</b>.</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px;">Cours (${cs.filter((c) => !c.hidden).length})</h3>
          ${courseData.canManage ? '<button class="btn small" id="fim-course-add" type="button">+ Déposer un cours ici</button>' : ''}
        </div>
        <div class="fim-grid">${cs.length ? cs.map(courseCard).join('') : '<div class="empty-row">Aucun cours déposé pour ce dossier.</div>'}</div>`;
      document.getElementById('fim-course-add')?.addEventListener('click', () => { courseSel = { kind: 'new', id: g.id }; renderCourseToc(); renderCourseArticle(); });
      bindCards();
      return;
    }

    const c = courseData.courses.find((x) => x.id === sel.id);
    if (!c) { article.innerHTML = '<div class="wiki-empty"><div class="wiki-empty-title">Cours FIM</div><p>Sélectionne un cours.</p></div>'; return; }
    const g = courseData.grids.find((x) => x.id === c.gridId);
    // Fiches liées dans les deux sens (ce cours vers d'autres, d'autres vers lui)
    const related = courseData.courses.filter((x) => x.id !== c.id && ((c.related || []).includes(x.id) || (x.related || []).includes(c.id)));
    article.innerHTML = `
      <div class="wiki-article-head">
        ${g ? `<span class="fim-pill" style="--c:var(--accent-2)">${esc(courseGroupOf(g.id).label)}</span>` : `<span class="fim-pill">${esc(c.category || 'Cours libre')}</span>`}
        ${c.duration ? `<span class="fim-pill">${c.duration} min</span>` : ''}
        ${c.hidden ? '<span class="fim-pill" style="--c:var(--warn)">Masqué aux FIM</span>' : ''}
      </div>
      <h2 class="wiki-article-title">${esc(c.title)}</h2>
      <div class="post-card-meta" style="margin-bottom:${c.summary ? 10 : 20}px;">${esc(c.authorName || '—')} — ${fmtDate(c.createdAt)}${c.updatedBy ? ` · modifié par ${esc(c.updatedBy)} le ${fmtDate(c.updatedAt)}` : ''}</div>
      ${c.summary ? `<p style="color:var(--ink-dim); font-size:13px; line-height:1.6; margin-bottom:18px;">${esc(c.summary)}</p>` : ''}
      ${g ? `<button type="button" class="btn ghost small" id="fim-course-grid" style="margin-bottom:18px;">Évaluation associée : ${esc(g.name)} →</button>` : ''}
      ${c.content ? `<div class="sci-body-rendered fim-table">${courseMarkdown(c.content)}</div>` : ''}
      ${(c.links || []).length ? `<h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 10px;">Documents et liens</h3>
        <div style="display:flex; flex-direction:column; gap:6px;">${c.links.map((l) => `<a class="btn ghost small" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" style="justify-content:flex-start;">↗ ${esc(l.label)}</a>`).join('')}</div>` : ''}
      ${related.length ? `<h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 10px;">Voir aussi</h3><div class="fim-grid">${related.map(courseCard).join('')}</div>` : ''}
      ${courseData.canManage ? `<div class="sci-card-actions" style="margin-top:24px;">
        <button class="btn small" id="fim-course-present">▶ Présenter</button>
        <button class="btn ghost small" id="fim-course-seance">Fiche de séance</button>
        <button class="btn ghost small" id="fim-course-edit">Modifier</button>
        <button class="btn ghost small" id="fim-course-arch">${c.hidden ? 'Afficher aux FIM' : 'Masquer aux FIM'}</button>
        <button class="btn danger small" id="fim-course-del">Supprimer</button></div>` : ''}`;
    bindCards();
    bindCourseLinks(article);
    document.getElementById('fim-course-grid')?.addEventListener('click', () => { courseSel = { kind: 'grid', id: g.id }; renderCourseToc(); renderCourseArticle(); });
    document.getElementById('fim-course-edit')?.addEventListener('click', () => { courseSel = { kind: 'edit', id: c.id }; renderCourseArticle(); });
    document.getElementById('fim-course-present')?.addEventListener('click', () => openPresentation(c, 'slides'));
    document.getElementById('fim-course-seance')?.addEventListener('click', () => { courseView = 'trainer'; trainerSel = c.id; loadCourses(); });
    document.getElementById('fim-course-arch')?.addEventListener('click', async () => {
      try {
        await window.apiFetch(`/api/rp/fim/courses/${encodeURIComponent(c.id)}`, { method: 'PUT', body: JSON.stringify({ hidden: !c.hidden }) });
        window.showToast(c.hidden ? 'Cours affiché aux FIM.' : 'Cours masqué : seul le commandement le voit.', 'success');
        loadCourses();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
    document.getElementById('fim-course-del')?.addEventListener('click', async () => {
      if (!confirm('Supprimer définitivement ce cours ?')) return;
      try {
        await window.apiFetch(`/api/rp/fim/courses/${encodeURIComponent(c.id)}`, { method: 'DELETE' });
        window.showToast('Cours supprimé.', 'success');
        courseSel = g ? { kind: 'grid', id: g.id } : null;
        loadCourses();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  function renderCourseEditor(article, c, presetGrid) {
    const gridId = c ? c.gridId || '' : presetGrid || '';
    const options = COURSE_GROUPS.map((group) => {
      const gs = courseData.grids.filter((g) => courseGroupOf(g.id) === group);
      return gs.length ? `<optgroup label="${esc(group.label)}">${gs.map((g) => `<option value="${esc(g.id)}"${g.id === gridId ? ' selected' : ''}>${esc(g.name)}</option>`).join('')}</optgroup>` : '';
    }).join('');
    const cats = [...new Set(courseData.courses.map((x) => x.category).filter(Boolean))];
    const others = courseData.courses.filter((x) => x.id !== c?.id);
    article.innerHTML = `
      <h3 style="font-family:'Space Grotesk', sans-serif; font-size:16px; margin-bottom:16px;">${c ? 'Modifier le cours' : 'Déposer un cours'}</h3>
      <form id="fim-course-form">
        <div class="field-row"><label>Titre *</label><input id="fc-title" maxlength="120" required value="${c ? esc(c.title) : ''}"></div>
        <div class="field-grid">
          <div class="field-row"><label>Dossier (évaluation associée)</label><select id="fc-grid"><option value="">Aucun : cours libre</option>${options}</select></div>
          <div class="field-row"><label>Durée (minutes)</label><input id="fc-duration" type="number" min="0" max="600" value="${c?.duration || ''}" placeholder="facultatif"></div>
        </div>
        <div class="field-row" id="fc-cat-row"><label>Catégorie (cours libre)</label><input id="fc-cat" maxlength="40" list="fc-cats" value="${c ? esc(c.category || '') : ''}" placeholder="Ex : Recrues, Officiers, Culture SCP…"><datalist id="fc-cats">${cats.map((x) => `<option value="${esc(x)}">`).join('')}</datalist></div>
        <div class="field-row"><label>Résumé</label><input id="fc-summary" maxlength="300" value="${c ? esc(c.summary || '') : ''}" placeholder="Une phrase affichée sur la carte du cours"></div>
        <div class="field-row"><label style="display:flex; justify-content:space-between; align-items:center;">Contenu (Markdown, {{texte}} = caviardé)<button type="button" class="btn ghost small" id="fc-preview-btn">Aperçu</button></label>
          <textarea id="fc-content" rows="16">${c ? esc(c.content || '') : ''}</textarea>
          <div id="fc-preview" class="sci-body-rendered fim-table" style="display:none; border:1px solid var(--line); padding:14px; min-height:120px;"></div>
        </div>
        <div class="field-row"><label>Notes du formateur (Markdown, visibles du commandement seulement : déroulé oral, démonstrations, pièges)</label><textarea id="fc-notes" rows="6" placeholder="Accroche, déroulé minuté, démonstration à faire, questions à poser…">${c ? esc(c.trainerNotes || '') : ''}</textarea></div>
        <div class="field-row"><label>Fiches liées (« Voir aussi », affichées dans les deux cours)</label>
          <input type="text" id="fc-rel-search" class="fim-search" placeholder="Filtrer les cours…" style="width:100%; margin-bottom:6px;">
          <div id="fc-related" style="max-height:180px; overflow:auto; border:1px solid var(--line); padding:6px 10px;">${others.length ? others.map((x) => `<label style="display:flex; gap:8px; align-items:center; padding:3px 0; font-size:12.5px; text-transform:none; letter-spacing:0;" data-rel-hay="${esc(norm(x.title))}"><input type="checkbox" value="${esc(x.id)}"${(c?.related || []).includes(x.id) ? ' checked' : ''}> ${esc(x.title)}${x.hidden ? ' <span style="color:var(--ink-faint);">(masqué)</span>' : ''}</label>`).join('') : '<span style="font-size:12px; color:var(--ink-faint);">Aucun autre cours pour le moment.</span>'}</div>
          <span style="font-size:11.5px; color:var(--ink-faint);">Dans le texte, <b>[[Titre d'un cours]]</b> ou <b>[[Passage · Caporal]]</b> crée un lien cliquable vers ce cours ou ce dossier.</span>
        </div>
        <div class="field-row"><label style="display:flex; gap:8px; align-items:center; text-transform:none; letter-spacing:0;"><input type="checkbox" id="fc-visible"${c?.hidden ? '' : ' checked'}> Afficher ce cours aux FIM (décoché : visible du commandement seulement)</label></div>
        <div class="field-row"><label>Documents et liens (un par ligne : Libellé | https://…)</label><textarea id="fc-links" rows="4" placeholder="Support PDF | https://drive.google.com/…&#10;Vidéo de démonstration | https://youtube.com/…">${c ? esc((c.links || []).map((l) => `${l.label} | ${l.url}`).join('\n')) : ''}</textarea></div>
        <div style="display:flex; gap:10px;"><button class="btn" type="submit">${c ? 'Enregistrer' : 'Déposer'}</button><button class="btn ghost" type="button" id="fc-cancel">Annuler</button></div>
      </form>`;
    const gridSel = document.getElementById('fc-grid');
    const syncCat = () => { document.getElementById('fc-cat-row').style.display = gridSel.value ? 'none' : ''; };
    gridSel.addEventListener('change', syncCat);
    syncCat();
    document.getElementById('fc-rel-search').addEventListener('input', (e) => {
      const q = norm(e.target.value);
      article.querySelectorAll('[data-rel-hay]').forEach((l) => { l.style.display = !q || l.dataset.relHay.includes(q) ? '' : 'none'; });
    });
    document.getElementById('fc-preview-btn').addEventListener('click', (e) => {
      const ta = document.getElementById('fc-content');
      const pv = document.getElementById('fc-preview');
      const show = pv.style.display === 'none';
      if (show) { pv.innerHTML = courseMarkdown(ta.value || '*Rien à afficher.*'); bindCourseLinks(pv); }
      pv.style.display = show ? '' : 'none';
      ta.style.display = show ? 'none' : '';
      e.target.textContent = show ? 'Modifier' : 'Aperçu';
    });
    document.getElementById('fc-cancel').addEventListener('click', () => {
      courseSel = c ? { kind: 'course', id: c.id } : (gridId ? { kind: 'grid', id: gridId } : null);
      loadCourses();
    });
    document.getElementById('fim-course-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const links = document.getElementById('fc-links').value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
        const i = line.lastIndexOf('|');
        return i >= 0 ? { label: line.slice(0, i).trim(), url: line.slice(i + 1).trim() } : { label: '', url: line };
      });
      const bad = links.filter((l) => !/^https:\/\/\S+$/i.test(l.url));
      if (bad.length) { window.showToast(`Lien invalide (https obligatoire) : ${bad[0].url || bad[0].label}`, 'error'); return; }
      const payload = {
        title: document.getElementById('fc-title').value.trim(),
        gridId: gridSel.value || null,
        category: gridSel.value ? '' : document.getElementById('fc-cat').value.trim(),
        duration: Number(document.getElementById('fc-duration').value) || 0,
        summary: document.getElementById('fc-summary').value.trim(),
        content: document.getElementById('fc-content').value.trim(),
        trainerNotes: document.getElementById('fc-notes').value.trim(),
        links,
        related: [...article.querySelectorAll('#fc-related input:checked')].map((x) => x.value),
        hidden: !document.getElementById('fc-visible').checked,
      };
      try {
        if (c) {
          await window.apiFetch(`/api/rp/fim/courses/${encodeURIComponent(c.id)}`, { method: 'PUT', body: JSON.stringify(payload) });
          courseSel = { kind: 'course', id: c.id };
        } else {
          const r = await window.apiFetch('/api/rp/fim/courses', { method: 'POST', body: JSON.stringify(payload) });
          courseSel = { kind: 'course', id: r.id };
        }
        window.showToast(c ? 'Cours modifié.' : 'Cours déposé.', 'success');
        loadCourses();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Espace formateur : fiches de séance, présentation plein écran et quiz
  // projeté, à partir du contenu des cours (sections « ## » et réponses {{ }}).
  // ---------------------------------------------------------------
  const NON_TALK = /quiz|questions de révision|exercice|à retenir|auto-évaluation|barème/i;

  // Découpe un cours en sections « ## » (hors blocs de code).
  function courseSections(md) {
    const sections = [];
    let cur = { title: '', lines: [] };
    let fence = false;
    for (const line of String(md || '').split('\n')) {
      if (/^```/.test(line.trim())) fence = !fence;
      if (!fence && /^##\s+/.test(line)) {
        if (cur.title || cur.lines.join('').trim()) sections.push(cur);
        cur = { title: line.replace(/^##\s+/, '').trim(), lines: [] };
      } else cur.lines.push(line);
    }
    if (cur.title || cur.lines.join('').trim()) sections.push(cur);
    return sections.map((x) => ({ title: x.title || 'Introduction', body: x.lines.join('\n').trim() }));
  }

  // Questions / réponses : toute ligne avec {{réponse}} ; si la réponse est
  // seule sur sa ligne, la question est le paragraphe qui précède.
  function courseQuiz(md) {
    const out = [];
    let para = [];
    let fence = false;
    for (const raw of String(md || '').split('\n')) {
      const line = raw.trim();
      if (/^```/.test(line)) { fence = !fence; para = []; continue; }
      if (fence) continue;
      if (!line || /^#/.test(line) || /^\|/.test(line)) { para = []; continue; }
      const answers = [...line.matchAll(/\{\{(.+?)\}\}/g)].map((m) => m[1]);
      if (!answers.length) { para.push(line.replace(/^[-*]\s+|^\d+\.\s+/, '')); continue; }
      const before = line.replace(/\{\{.+?\}\}/g, '').replace(/^[-*]\s+|^\d+\.\s+/, '').trim();
      const q = before || para.join(' ');
      if (q) out.push({ q, a: answers.join(' ') });
      para = [];
    }
    return out;
  }

  // Une section avec des sous-parties « ### » donne une diapositive par
  // sous-partie (plus l'introduction de la section si elle existe).
  function splitSubsections(sec) {
    const parts = [];
    let cur = { title: sec.title, lines: [] };
    let fence = false;
    for (const line of sec.body.split('\n')) {
      if (/^```/.test(line.trim())) fence = !fence;
      if (!fence && /^###\s+/.test(line)) {
        if (cur.lines.join('').trim()) parts.push(cur);
        cur = { title: `${sec.title} — ${line.replace(/^###\s+/, '').trim()}`, lines: [] };
      } else cur.lines.push(line);
    }
    if (cur.lines.join('').trim() || !parts.length) parts.push(cur);
    return parts.map((x) => ({ title: x.title, body: x.lines.join('\n').trim() }));
  }

  function seancePlan(c) {
    const talk = courseSections(c.content).filter((s) => !NON_TALK.test(s.title));
    const quiz = courseQuiz(c.content);
    const total = Math.max(10, c.duration || 20);
    const quizMin = quiz.length ? Math.max(3, Math.round(total * 0.15)) : 0;
    const weight = talk.reduce((a, s) => a + Math.max(200, s.body.length), 0) || 1;
    const rows = talk.map((s) => ({ title: s.title, min: Math.max(1, Math.round(((total - quizMin) * Math.max(200, s.body.length)) / weight)) }));
    if (quizMin) rows.push({ title: `Quiz (${quiz.length} questions)`, min: quizMin });
    return rows;
  }

  function seanceHtml(c, forPrint) {
    const g = courseData.grids.find((x) => x.id === c.gridId);
    const plan = seancePlan(c);
    const exercises = courseSections(c.content).filter((s) => /exercice/i.test(s.title));
    const quiz = courseQuiz(c.content);
    const md = (t) => (forPrint ? window.renderMarkdown(t) : courseMarkdown(t));
    let at = 0;
    return `
      <div class="wiki-article-head"><span class="fim-pill" style="--c:#D4AF55">Fiche de séance</span>${c.duration ? `<span class="fim-pill">${c.duration} min</span>` : ''}${g ? `<span class="fim-pill" style="--c:var(--accent-2)">${esc(g.name)}</span>` : ''}</div>
      <h2 class="wiki-article-title">${esc(c.title)}</h2>
      ${c.summary ? `<p style="color:var(--ink-dim); font-size:13px; line-height:1.6;"><b>Objectif :</b> ${esc(c.summary)}</p>` : ''}
      <h3 class="fim-seance-h">Plan minuté</h3>
      <div class="sci-body-rendered fim-table">${window.renderMarkdown(`| Début | Durée | Séquence |\n|---|---|---|\n${plan.map((r) => { const line = `| ${at} min | ${r.min} min | ${r.title.replace(/\|/g, '/')} |`; at += r.min; return line; }).join('\n')}`)}</div>
      <h3 class="fim-seance-h">Notes du formateur</h3>
      ${c.trainerNotes ? `<div class="sci-body-rendered fim-table">${md(c.trainerNotes)}</div>` : '<p style="font-size:12.5px; color:var(--ink-faint);">Aucune note. Ajoute ton déroulé oral dans « Modifier » → Notes du formateur.</p>'}
      ${g ? `<h3 class="fim-seance-h">Ce qui sera évalué</h3><div class="sci-body-rendered fim-table">${window.renderMarkdown(g.criteria.map((x) => `- **${x.label}**${x.weight !== 1 ? ` (×${x.weight})` : ''} : ${x.hint || ''}`).join('\n'))}</div>` : ''}
      ${exercises.map((s) => `<h3 class="fim-seance-h">${esc(s.title)}</h3><div class="sci-body-rendered fim-table">${md(s.body)}</div>`).join('')}
      ${quiz.length ? `<h3 class="fim-seance-h">Questions à poser (${quiz.length})</h3>
        <ol class="fim-seance-quiz">${quiz.map((x) => `<li><span>${window.renderMarkdown(x.q).replace(/^<p>|<\/p>\s*$/g, '')}</span><em>→ ${esc(x.a)}</em></li>`).join('')}</ol>` : ''}`;
  }

  async function renderTrainer(body) {
    ensureTrainerStyle();
    body.innerHTML = '<div class="center-msg">Chargement…</div>';
    const tr = await window.apiFetch('/api/rp/fim/trainings').catch(() => ({ trainings: [] }));
    const now = Date.now();
    const upcoming = (tr.trainings || []).filter((t) => t.status === 'planifiee' && (t.at || 0) > now - 86400000).sort((a, b) => a.at - b.at).slice(0, 6);
    const courses = courseData.courses;
    if (!trainerSel || !courses.some((c) => c.id === trainerSel)) trainerSel = (courses.find((c) => upcoming.some((t) => t.gridId && t.gridId === c.gridId)) || courses[0])?.id || null;
    const groupLabel = (c) => { const g = courseData.grids.find((x) => x.id === c.gridId); return g ? courseGroupOf(g.id).label : (c.category || 'Cours libres'); };
    const groups = {};
    courses.forEach((c) => (groups[groupLabel(c)] = groups[groupLabel(c)] || []).push(c));

    body.innerHTML = `
      <div class="fim-trainer-sessions">
        <h3 class="fim-seance-h" style="margin-top:0;">Prochaines formations</h3>
        ${upcoming.length ? `<div class="fim-grid">${upcoming.map((t) => {
          const cs = courses.filter((c) => t.gridId && c.gridId === t.gridId);
          return `<div class="fim-grid-card">
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;"><h4 style="margin-right:auto;">${esc(t.title)}</h4><span class="fim-pill">${Object.keys(t.signups || {}).length} inscrit(s)</span></div>
            <div class="fim-op-meta" style="margin:0;"><span>${fmtDate(t.at)}</span>${t.place ? `<span>${esc(t.place)}</span>` : ''}${t.instructor ? `<span>Instructeur <b>${esc(t.instructor)}</b></span>` : ''}</div>
            ${cs.length ? `<div class="sci-card-actions" style="margin-top:6px;">${cs.map((c) => `<button class="btn ghost small" data-tsel="${esc(c.id)}">Préparer : ${esc(c.title)}</button>`).join('')}</div>` : '<p style="font-size:12px; color:var(--ink-faint);">Aucun cours rattaché à la grille de cette session.</p>'}
          </div>`;
        }).join('')}</div>` : '<div class="empty-row">Aucune formation planifiée (onglet Évaluations → Formations).</div>'}
      </div>
      <div class="wiki-layout" style="margin-top:18px;">
        <div class="wiki-toc">
          <div class="wiki-toc-head"><span class="record-block-head-title">Séances</span><span class="count">${courses.length}</span></div>
          <div class="wiki-toc-list">${Object.entries(groups).map(([label, cs]) => `
            <div style="font-family:'JetBrains Mono', monospace; font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); padding:10px 10px 4px;">${esc(label)}</div>
            ${cs.map((c) => `<button class="wiki-toc-item${c.id === trainerSel ? ' active' : ''}" data-tsel="${esc(c.id)}" type="button"><span class="wiki-toc-title">${esc(c.title)}</span><span class="wiki-toc-meta">${c.duration ? `${c.duration} min · ` : ''}${courseQuiz(c.content).length} questions${c.trainerNotes ? ' · notes' : ''}</span></button>`).join('')}`).join('')}
          </div>
        </div>
        <div class="wiki-article" id="fim-trainer-article"></div>
      </div>`;
    body.querySelectorAll('[data-tsel]').forEach((b) => b.addEventListener('click', () => { trainerSel = b.dataset.tsel; renderTrainer(body); }));

    const article = document.getElementById('fim-trainer-article');
    const c = courses.find((x) => x.id === trainerSel);
    if (!c) { article.innerHTML = '<div class="wiki-empty"><div class="wiki-empty-title">Espace formateur</div><p>Aucun cours pour le moment.</p></div>'; return; }
    const nQuiz = courseQuiz(c.content).length;
    article.innerHTML = `
      <div class="sci-card-actions" style="margin-bottom:16px;">
        <button class="btn small" id="ft-present">▶ Présenter</button>
        ${nQuiz ? `<button class="btn ghost small" id="ft-quiz">Quiz projeté (${nQuiz})</button>` : ''}
        <button class="btn ghost small" id="ft-print">Imprimer la fiche</button>
        <button class="btn ghost small" id="ft-open">Ouvrir le cours</button>
        <button class="btn ghost small" id="ft-edit">Modifier / notes</button>
      </div>
      ${seanceHtml(c, false)}`;
    bindCourseLinks(article);
    document.getElementById('ft-present').addEventListener('click', () => openPresentation(c, 'slides'));
    document.getElementById('ft-quiz')?.addEventListener('click', () => openPresentation(c, 'quiz'));
    document.getElementById('ft-print').addEventListener('click', () => printSeance(c));
    document.getElementById('ft-open').addEventListener('click', () => { courseView = 'read'; courseSel = { kind: 'course', id: c.id }; loadCourses(); });
    document.getElementById('ft-edit').addEventListener('click', () => { courseView = 'read'; courseSel = { kind: 'edit', id: c.id }; loadCourses(); });
  }

  function printSeance(c) {
    const w = window.open('', '_blank');
    if (!w) { window.showToast('Autorise les fenêtres pop-up pour imprimer.', 'error'); return; }
    w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><base href="${esc(location.href)}"><title>Fiche de séance — ${esc(c.title)}</title>
      <style>
        body{ font-family:Arial, sans-serif; color:#111; max-width:780px; margin:24px auto; padding:0 16px; font-size:13px; line-height:1.55; }
        h2{ font-size:20px; margin:6px 0 10px; } h3{ font-size:14px; margin:20px 0 6px; border-bottom:1px solid #999; padding-bottom:3px; text-transform:uppercase; letter-spacing:.04em; }
        table{ border-collapse:collapse; width:100%; margin:6px 0; } th, td{ border:1px solid #aaa; padding:4px 7px; text-align:left; vertical-align:top; }
        pre{ background:#f3f3f3; padding:8px; font-size:11px; white-space:pre; overflow:hidden; }
        .fim-pill{ display:inline-block; border:1px solid #999; padding:1px 7px; margin-right:6px; font-size:11px; }
        .redacted-text{ background:none; color:#111; }
        ol li em{ display:block; color:#444; font-size:12px; } ol li{ margin-bottom:6px; }
        .foot{ margin-top:28px; font-size:10.5px; color:#666; border-top:1px solid #ccc; padding-top:6px; }
      </style></head><body>${seanceHtml(c, true)}<div class="foot">Commandement FIM · Site-15 · document de formation – diffusion interne</div></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }

  function ensureTrainerStyle() {
    if (document.getElementById('fim-present-style')) return;
    const st = document.createElement('style');
    st.id = 'fim-present-style';
    st.textContent = `
      .fim-present{ position:fixed; inset:0; z-index:9999; background:var(--void, #0B0C10); display:flex; flex-direction:column; color:var(--ink, #E8EAF0); user-select:none; }
      .fim-present.laser, .fim-present.laser *{ cursor:none !important; }
      .fim-present-progress{ height:3px; background:var(--line); }
      .fim-present-progress i{ display:block; height:100%; background:var(--accent-2); transition:width .25s; }
      .fim-present-bar{ display:flex; align-items:center; gap:8px; padding:8px 16px; border-bottom:1px solid var(--line); font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--ink-faint); flex-wrap:wrap; }
      .fim-present-bar b{ color:var(--ink); font-family:'Space Grotesk', sans-serif; font-size:14px; margin-right:auto; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:40vw; }
      .fim-present-bar .late{ color:var(--bad, #F0525A); }
      .fim-present-bar .score{ color:var(--good, #4FD895); }
      .fim-present-main{ flex:1; display:flex; min-height:0; position:relative; }
      .fim-present-slide{ flex:1; overflow:auto; padding:4.5vh 7vw; animation:fimSlideIn .25s ease-out; }
      @keyframes fimSlideIn{ from{ opacity:0; transform:translateX(14px); } to{ opacity:1; transform:none; } }
      .fim-present-slide h1{ font-family:'Space Grotesk', sans-serif; font-size:clamp(24px, 3.6vw, 44px); margin:0 0 6px; line-height:1.15; }
      .fim-present-slide .part{ font-family:'JetBrains Mono', monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent-2); margin-bottom:16px; }
      .fim-present-slide .sci-body-rendered{ font-size:clamp(15px, 1.6vw, 22px); line-height:1.65; }
      .fim-present-slide .sci-body-rendered pre{ font-size:clamp(11px, 1.1vw, 15px); }
      .fim-present-slide .sci-body-rendered img{ max-width:100%; max-height:66vh; margin:8px auto; border:none; cursor:zoom-in; }
      .fim-present-slide .sci-body-rendered img.zoom{ max-height:none; width:100%; cursor:zoom-out; }
      .fim-present-slide .sci-body-rendered img + em, .fim-present-slide .sci-body-rendered p > em:only-child{ display:block; text-align:center; color:var(--ink-faint); font-size:.8em; }
      .fim-frag{ opacity:.08; transition:opacity .25s; }
      .fim-frag.on{ opacity:1; }
      .fim-present-cover{ display:flex; flex-direction:column; justify-content:center; min-height:100%; }
      .fim-present-cover .eyebrow{ font-family:'JetBrains Mono', monospace; letter-spacing:.14em; text-transform:uppercase; color:var(--accent-2); font-size:13px; margin-bottom:14px; }
      .fim-present-cover h1{ font-size:clamp(30px, 5vw, 62px); }
      .fim-present-cover p{ font-size:clamp(16px, 1.8vw, 22px); color:var(--ink-dim); max-width:900px; }
      .fim-present-cover .meta{ display:flex; gap:10px; flex-wrap:wrap; margin-top:22px; }
      .fim-present-agenda{ columns:2 320px; column-gap:40px; padding:0; list-style:none; counter-reset:ag; font-size:clamp(15px, 1.6vw, 21px); }
      .fim-present-agenda li{ counter-increment:ag; break-inside:avoid; padding:7px 0 7px 46px; position:relative; border-bottom:1px solid var(--line); }
      .fim-present-agenda li::before{ content:counter(ag, decimal-leading-zero); position:absolute; left:0; font-family:'JetBrains Mono', monospace; color:var(--accent-2); }
      .fim-present-q{ font-size:clamp(20px, 2.6vw, 34px); line-height:1.4; font-family:'Space Grotesk', sans-serif; }
      .fim-present-a{ margin-top:4vh; font-size:clamp(18px, 2.2vw, 28px); color:var(--good, #4FD895); border-left:3px solid currentColor; padding-left:16px; }
      .fim-present-big{ font-family:'Space Grotesk', sans-serif; font-size:clamp(40px, 7vw, 90px); font-weight:700; line-height:1.05; }
      .fim-present-notes{ width:min(380px, 34vw); border-left:1px solid var(--line); overflow:auto; padding:18px; background:var(--void-2); }
      .fim-present-notes h4{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); margin:0 0 10px; }
      .fim-present-nav{ display:flex; justify-content:space-between; align-items:center; padding:8px 16px; border-top:1px solid var(--line); gap:10px; }
      .fim-present-nav .help{ font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint); text-align:center; }
      .fim-present-black{ position:absolute; inset:0; background:#000; z-index:3; display:flex; align-items:center; justify-content:center; color:#333; font-family:'JetBrains Mono', monospace; font-size:12px; }
      .fim-present-overview{ position:absolute; inset:0; z-index:4; background:var(--void, #0B0C10); overflow:auto; padding:24px; display:grid; grid-template-columns:repeat(auto-fill, minmax(190px, 1fr)); gap:10px; align-content:start; }
      .fim-present-overview button{ text-align:left; background:var(--void-2); border:1px solid var(--line); color:var(--ink); padding:12px; min-height:84px; font-family:'Space Grotesk', sans-serif; font-size:13px; cursor:pointer; }
      .fim-present-overview button.on{ border-color:var(--accent-2); }
      .fim-present-overview button span{ display:block; font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--accent-2); margin-bottom:6px; }
      .fim-present-laser{ position:fixed; width:16px; height:16px; margin:-8px 0 0 -8px; border-radius:50%; background:#F0525A; box-shadow:0 0 14px 4px rgba(240,82,90,.7); pointer-events:none; z-index:10000; display:none; }
      .fim-seance-h{ font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 10px; }
      .fim-seance-quiz{ padding-left:20px; font-size:13px; color:var(--ink-dim); }
      .fim-seance-quiz li{ margin-bottom:8px; }
      .fim-seance-quiz em{ display:block; color:var(--good, #4FD895); font-style:normal; font-size:12.5px; }
      @media (max-width: 760px){
        .fim-present-notes{ position:absolute; inset:auto 0 0 0; width:auto; max-height:45vh; border-left:none; border-top:1px solid var(--line); z-index:2; }
        .fim-present-nav .help{ display:none; }
        .fim-present-slide{ padding:3vh 5vw; }
      }`;
    document.head.appendChild(st);
  }

  // Découpe le corps d'une section trop longue en plusieurs diapositives, aux
  // lignes vides, sans couper un schéma ; une image a sa diapositive à elle.
  function chunkBody(body, max = 1000) {
    const blocks = [];
    let cur = [];
    let fence = false;
    for (const line of body.split('\n')) {
      if (/^```/.test(line.trim())) fence = !fence;
      if (!fence && !line.trim()) { if (cur.length) { blocks.push(cur.join('\n')); cur = []; } continue; }
      cur.push(line);
    }
    if (cur.length) blocks.push(cur.join('\n'));
    const chunks = [];
    let acc = '';
    for (const b of blocks) {
      const isImg = /^!\[/.test(b.trim());
      if (acc && (isImg || acc.length + b.length > max)) { chunks.push(acc); acc = ''; }
      if (isImg) { chunks.push(b); continue; }
      acc = acc ? `${acc}\n\n${b}` : b;
    }
    if (acc.trim()) chunks.push(acc);
    return chunks.length ? chunks : [body];
  }

  function buildSlides(c, mode) {
    if (mode === 'quiz') {
      const qs = courseQuiz(c.content);
      if (!qs.length) return [];
      return [
        { kind: 'quizcover', title: 'Quiz' },
        ...qs.map((x, i) => ({ kind: 'quiz', title: `Question ${i + 1} / ${qs.length}`, q: x.q, a: x.a, n: i })),
        { kind: 'score', title: 'Résultat' },
      ];
    }
    // Les exercices d'instructeur restent dans la fiche de séance et le quiz
    // a son propre mode (proposé sur la dernière diapositive).
    const sections = courseSections(c.content).filter((s) => (s.title !== 'Introduction' || s.body) && !/instructeur|quiz|questions de révision/i.test(s.title));
    const slides = [{ kind: 'cover', title: c.title }];
    const agenda = sections.map((s) => s.title).filter((t) => t !== 'Introduction');
    if (agenda.length > 2) slides.push({ kind: 'agenda', title: 'Au programme', items: agenda });
    for (const s of sections) {
      for (const sub of splitSubsections(s)) {
        const parts = chunkBody(sub.body);
        parts.forEach((body, k) => slides.push({ kind: 'section', title: sub.title, body, part: parts.length > 1 ? `${k + 1} / ${parts.length}` : '' }));
      }
    }
    const keep = (c.content.match(/^> \*\*À retenir\s*:\*\*(.+)$/m) || [])[1];
    slides.push({ kind: 'end', title: 'Questions ?', keep: keep ? keep.trim() : '' });
    return slides;
  }

  // Présentation plein écran. Diaporama : une diapositive par section (les
  // longues sont découpées), points révélés un par un. Quiz : question, réponse,
  // score du groupe. Clavier : ← → Espace · P progressif · O vue d'ensemble ·
  // V vue présentateur · N notes · B écran noir · L pointeur laser · F plein
  // écran · 1/2 bonne/mauvaise réponse (quiz) · Échap quitter.
  function openPresentation(c, mode) {
    let slides = buildSlides(c, mode);
    if (!slides.length) { window.showToast('Rien à présenter dans ce cours.', 'error'); return; }
    ensureTrainerStyle();
    const ov = document.createElement('div');
    ov.className = 'fim-present';
    document.body.appendChild(ov);
    const laserDot = document.createElement('div');
    laserDot.className = 'fim-present-laser';
    document.body.appendChild(laserDot);
    const st = { i: 0, shown: 0, revealed: false, notes: false, progressive: true, black: false, overview: false, laser: false, score: {}, started: Date.now() };
    let presenter = null;
    const fmt = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
    const target = (c.duration || 0) * 60000;
    const clockHtml = () => {
      const el = Date.now() - st.started;
      return `<span data-pv-clock class="${target && el > target ? 'late' : ''}">${fmt(el)}${target ? ` / ${fmt(target)}` : ''}</span>`;
    };
    const scoreText = () => { const v = Object.values(st.score); return `${v.filter(Boolean).length} / ${v.length}`; };
    const frags = () => [...ov.querySelectorAll('.fim-frag')];

    const slideHtml = (s) => {
      if (s.kind === 'cover') {
        const g = courseData.grids.find((x) => x.id === c.gridId);
        return `<div class="fim-present-cover"><div class="eyebrow">Formation FIM · Site-15${g ? ` · ${esc(courseGroupOf(g.id).label)}` : ''}</div><h1>${esc(c.title)}</h1>${c.summary ? `<p>${esc(c.summary)}</p>` : ''}
          <div class="meta">${c.duration ? `<span class="fim-pill">${c.duration} min</span>` : ''}${g ? `<span class="fim-pill" style="--c:var(--accent-2)">Évaluation : ${esc(g.name)}</span>` : ''}${courseQuiz(c.content).length ? `<span class="fim-pill" style="--c:var(--good)">${courseQuiz(c.content).length} questions de quiz</span>` : ''}</div></div>`;
      }
      if (s.kind === 'agenda') return `<h1>${esc(s.title)}</h1><div class="part">${s.items.length} parties</div><ol class="fim-present-agenda">${s.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`;
      if (s.kind === 'end') return `<div class="fim-present-cover"><div class="eyebrow">Fin de la séance</div><div class="fim-present-big">Questions ?</div>${s.keep ? `<p style="margin-top:26px; border-left:3px solid var(--accent-2); padding-left:16px;"><b>À retenir :</b> ${esc(s.keep.replace(/\*\*/g, ''))}</p>` : ''}
        <div class="meta">${courseQuiz(c.content).length ? '<button class="btn" data-pv="toquiz">Lancer le quiz</button>' : ''}<button class="btn ghost" data-pv="close">Terminer</button></div></div>`;
      if (s.kind === 'quizcover') return `<div class="fim-present-cover"><div class="eyebrow">${esc(c.title)}</div><div class="fim-present-big">Quiz</div><p>${slides.length - 2} questions. Répondez à voix haute, le formateur révèle la réponse puis compte les points (1 = juste, 2 = faux).</p></div>`;
      if (s.kind === 'score') {
        const v = Object.values(st.score);
        const ok = v.filter(Boolean).length;
        const pct = v.length ? Math.round((ok / v.length) * 100) : 0;
        return `<div class="fim-present-cover"><div class="eyebrow">Résultat du quiz</div><div class="fim-present-big" style="color:${pct >= 80 ? 'var(--good)' : pct >= 55 ? 'var(--warn)' : 'var(--bad)'}">${ok} / ${v.length}</div><p>${v.length ? `${pct} % de bonnes réponses.` : 'Aucune réponse notée.'} ${pct >= 80 ? 'Prêt pour l’évaluation.' : pct >= 55 ? 'Quelques points à revoir.' : 'Reprendre le cours avant l’évaluation.'}</p>
          <div class="meta"><button class="btn ghost" data-pv="restart">Recommencer</button><button class="btn" data-pv="close">Terminer</button></div></div>`;
      }
      if (s.kind === 'quiz') {
        const mark = st.score[s.n];
        return `<h1 style="font-size:clamp(16px, 1.8vw, 24px); color:var(--ink-faint);">${esc(s.title)}</h1><div class="fim-present-q">${window.renderMarkdown(s.q)}</div>
          ${st.revealed ? `<div class="fim-present-a">${esc(s.a)}</div>
            <div class="sci-card-actions" style="margin-top:3vh;"><button class="btn ${mark === true ? '' : 'ghost'}" data-pv="ok">✓ Juste (1)</button><button class="btn ${mark === false ? 'danger' : 'ghost'}" data-pv="ko">✗ Faux (2)</button></div>`
            : '<button class="btn" data-pv="reveal" style="margin-top:4vh;">Révéler la réponse (Espace)</button>'}`;
      }
      return `<h1>${esc(s.title)}</h1>${s.part ? `<div class="part">Partie ${esc(s.part)}</div>` : '<div class="part"></div>'}<div class="sci-body-rendered fim-table">${courseMarkdown(s.body)}</div>`;
    };

    const renderPresenter = () => {
      if (!presenter || presenter.closed) { presenter = null; return; }
      const s = slides[st.i];
      const n = slides[st.i + 1];
      const left = frags().filter((f) => !f.classList.contains('on')).length;
      presenter.document.getElementById('pv').innerHTML = `
        <div class="top"><b>${st.i + 1} / ${slides.length}</b> · ${clockHtml()}${mode === 'quiz' ? ` · score ${scoreText()}` : ''}</div>
        <h2>${esc(s.title || '')}</h2>
        ${s.kind === 'quiz' ? `<p class="ans">Réponse : ${esc(s.a)}</p>` : ''}
        ${left ? `<p class="dim">${left} point(s) encore masqué(s) sur cette diapositive</p>` : ''}
        <p class="dim">Suivante : <b>${esc(n ? n.title || n.kind : 'fin')}</b></p>
        <div class="btns"><button data-k="ArrowLeft">← Précédent</button><button data-k="ArrowRight">Suivant →</button><button data-k="b">Écran noir</button></div>
        <h3>Notes du formateur</h3>
        <div class="notes">${c.trainerNotes ? window.renderMarkdown(c.trainerNotes) : '<p class="dim">Aucune note pour ce cours.</p>'}</div>`;
    };

    const render = () => {
      const s = slides[st.i];
      ov.classList.toggle('laser', st.laser);
      ov.innerHTML = `
        <div class="fim-present-progress"><i style="width:${((st.i + 1) / slides.length) * 100}%"></i></div>
        <div class="fim-present-bar"><b>${esc(c.title)}</b><span>${st.i + 1} / ${slides.length}</span>${clockHtml()}${mode === 'quiz' ? `<span class="score">Score ${scoreText()}</span>` : ''}
          <button class="btn ghost small" data-pv="overview" title="Vue d'ensemble (O)">Plan</button>
          ${mode === 'quiz' ? '' : `<button class="btn ghost small" data-pv="progressive" title="Révélation progressive (P)">${st.progressive ? 'Progressif ✓' : 'Progressif'}</button>`}
          ${c.trainerNotes ? `<button class="btn ghost small" data-pv="notes" title="Notes (N)">${st.notes ? 'Notes ✓' : 'Notes'}</button>` : ''}
          <button class="btn ghost small" data-pv="presenter" title="Vue présentateur dans une autre fenêtre (V)">Présentateur</button>
          <button class="btn ghost small" data-pv="laser" title="Pointeur laser (L)">${st.laser ? 'Laser ✓' : 'Laser'}</button>
          <button class="btn ghost small" data-pv="full" title="Plein écran (F)">Plein écran</button>
          <button class="btn ghost small" data-pv="close" title="Quitter (Échap)">✕</button></div>
        <div class="fim-present-main">
          <div class="fim-present-slide">${slideHtml(s)}</div>
          ${st.notes && c.trainerNotes ? `<div class="fim-present-notes"><h4>Notes du formateur</h4><div class="sci-body-rendered">${window.renderMarkdown(c.trainerNotes)}</div></div>` : ''}
          ${st.black ? '<div class="fim-present-black" data-pv="black">Écran noir · B pour reprendre</div>' : ''}
          ${st.overview ? `<div class="fim-present-overview">${slides.map((x, k) => `<button data-go="${k}" class="${k === st.i ? 'on' : ''}"><span>${String(k + 1).padStart(2, '0')}${x.part ? ` · ${esc(x.part)}` : ''}</span>${esc(x.kind === 'cover' ? 'Couverture' : x.title || '')}</button>`).join('')}</div>` : ''}
        </div>
        <div class="fim-present-nav"><button class="btn ghost small" data-pv="prev"${st.i === 0 ? ' disabled' : ''}>← Précédent</button>
          <span class="help">← → / Espace · P progressif · O plan · V présentateur · N notes · B noir · L laser · F plein écran · Échap</span>
          <button class="btn small" data-pv="next">${st.i === slides.length - 1 ? 'Terminer' : 'Suivant →'}</button></div>`;
      ov.querySelectorAll('.fim-present-slide a[href="#"]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
      ov.querySelectorAll('.fim-present-slide .sci-body-rendered img').forEach((img) => img.addEventListener('click', () => img.classList.toggle('zoom')));
      // Révélation progressive : éléments de premier niveau (listes, lignes de tableau)
      if (s.kind === 'section' && st.progressive) {
        const items = ov.querySelectorAll('.fim-present-slide .sci-body-rendered > ul > li, .fim-present-slide .sci-body-rendered > ol > li, .fim-present-slide .sci-body-rendered > table > tbody > tr');
        if (items.length > 1) items.forEach((el, k) => { el.classList.add('fim-frag'); if (k < st.shown) el.classList.add('on'); });
      }
      renderPresenter();
    };

    const go = (k, opts = {}) => {
      st.i = Math.max(0, Math.min(slides.length - 1, k));
      st.revealed = false;
      st.overview = false;
      st.shown = opts.all ? 999 : 0;
      render();
    };
    const close = () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousemove', onMove);
      clearInterval(timer);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (presenter && !presenter.closed) presenter.close();
      laserDot.remove();
      ov.remove();
    };
    const next = () => {
      const s = slides[st.i];
      if (st.overview) { st.overview = false; render(); return; }
      const hidden = frags().filter((f) => !f.classList.contains('on'));
      if (hidden.length) { st.shown += 1; hidden[0].classList.add('on'); renderPresenter(); return; }
      if (s.kind === 'quiz' && !st.revealed) { st.revealed = true; render(); return; }
      if (st.i === slides.length - 1) { close(); return; }
      go(st.i + 1);
    };
    const prev = () => { if (st.i > 0) go(st.i - 1, { all: true }); };
    const mark = (v) => { const s = slides[st.i]; if (s.kind === 'quiz' && st.revealed) { st.score[s.n] = v; render(); } };
    const openPresenter = () => {
      if (presenter && !presenter.closed) { presenter.focus(); return; }
      presenter = window.open('', 'fim-presenter', 'width=560,height=720');
      if (!presenter) { window.showToast('Autorise les fenêtres pop-up pour la vue présentateur.', 'error'); return; }
      presenter.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Vue présentateur — ${esc(c.title)}</title><style>
        body{ background:#0E1016; color:#E8EAF0; font-family:'Segoe UI', Arial, sans-serif; margin:0; padding:18px; font-size:15px; line-height:1.5; }
        .top{ font-family:Consolas, monospace; color:#9297A8; } .top b{ color:#E8EAF0; } .late{ color:#F0525A; }
        h2{ font-size:22px; margin:10px 0; } h3{ font-size:12px; text-transform:uppercase; letter-spacing:.1em; color:#9297A8; border-top:1px solid #2A2E3A; padding-top:12px; margin-top:16px; }
        .dim{ color:#9297A8; } .ans{ color:#4FD895; font-size:18px; } .btns{ display:flex; gap:8px; margin:12px 0; }
        button{ background:#151821; color:#E8EAF0; border:1px solid #2A2E3A; padding:10px 14px; font-size:14px; cursor:pointer; flex:1; }
        .notes{ background:#151821; border:1px solid #2A2E3A; padding:12px; } .notes p{ margin:6px 0; }
      </style></head><body><div id="pv"></div></body></html>`);
      presenter.document.close();
      presenter.document.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) onKey({ key: b.dataset.k, preventDefault() {}, target: {} }); });
      presenter.document.addEventListener('keydown', onKey);
      renderPresenter();
    };
    const act = (a) => {
      if (a === 'next' || a === 'reveal') next();
      else if (a === 'prev') prev();
      else if (a === 'close') close();
      else if (a === 'ok') mark(true);
      else if (a === 'ko') mark(false);
      else if (a === 'notes') { st.notes = !st.notes; render(); }
      else if (a === 'progressive') { st.progressive = !st.progressive; st.shown = 0; render(); }
      else if (a === 'overview') { st.overview = !st.overview; render(); }
      else if (a === 'black') { st.black = !st.black; render(); }
      else if (a === 'laser') { st.laser = !st.laser; laserDot.style.display = 'none'; render(); }
      else if (a === 'presenter') openPresenter();
      else if (a === 'restart') { st.score = {}; go(0); }
      else if (a === 'toquiz') { mode = 'quiz'; slides = buildSlides(c, 'quiz'); st.score = {}; go(0); }
      else if (a === 'full') { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else ov.requestFullscreen?.().catch(() => {}); }
    };
    ov.addEventListener('click', (e) => {
      const g = e.target.closest('[data-go]');
      if (g) { go(Number(g.dataset.go)); return; }
      const b = e.target.closest('[data-pv]');
      if (b) act(b.dataset.pv);
    });
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      const k = e.key;
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
      else if (k === 'Home') go(0);
      else if (k === 'End') go(slides.length - 1, { all: true });
      else if (k === 'Escape') { if (st.overview) act('overview'); else if (st.black) act('black'); else if (!document.fullscreenElement) close(); }
      else if (/^[nN]$/.test(k)) act('notes');
      else if (/^[fF]$/.test(k)) act('full');
      else if (/^[pP]$/.test(k) && mode !== 'quiz') act('progressive');
      else if (/^[oOgG]$/.test(k)) act('overview');
      else if (/^[bB.]$/.test(k)) act('black');
      else if (/^[lL]$/.test(k)) act('laser');
      else if (/^[vV]$/.test(k)) act('presenter');
      else if (k === '1') mark(true);
      else if (k === '2') mark(false);
    };
    const onMove = (e) => {
      if (!st.laser) return;
      laserDot.style.display = 'block';
      laserDot.style.left = `${e.clientX}px`;
      laserDot.style.top = `${e.clientY}px`;
    };
    // Balayage tactile (tablette) : gauche = suivant, droite = précédent
    let touchX = null;
    ov.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    ov.addEventListener('touchend', (e) => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 60) { if (dx < 0) next(); else prev(); }
    });
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousemove', onMove);
    const timer = setInterval(() => {
      const html = clockHtml();
      const el = ov.querySelector('[data-pv-clock]');
      if (el) el.outerHTML = html;
      const pel = presenter && !presenter.closed && presenter.document.querySelector('[data-pv-clock]');
      if (pel) pel.outerHTML = html;
    }, 1000);
    render();
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

  function evalCard(e, canDelete, opts = {}) {
    const v = VERDICT_META[e.verdict] || VERDICT_META.conforme;
    const r = RECO_META[e.recommendation] || RECO_META.aucune;
    const g = e.grid;
    const cert = certOf(e);
    if (cert) diplomaRegistry.set(e.id, e);
    return `
      <div class="fim-eval-card" data-eval-id="${esc(e.id)}">
        ${cert ? `<div class="fim-cert-ribbon">${emblemSvg(cert.emblem)}<span>Brevet décerné : <b>${esc(cert.title)}</b> · mention ${esc(certMention(e))}</span><button class="btn small" type="button" data-diploma="${esc(e.id)}" style="background:#D4AF55; border-color:#D4AF55; white-space:nowrap;">Voir le diplôme</button></div>` : ''}
        <div class="fim-eval-card-top">
          <span class="fim-score" style="color:${pctColor(e.percent)}; text-align:left; min-width:0;">${esc(pctInScale(g.scale, e.percent))}</span>
          <span style="font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--ink-faint);">${fmtPct(e.percent)}</span>
          ${pill(v)} ${e.recommendation && e.recommendation !== 'aucune' ? pill(r) : ''}
          <span class="fim-pill">${esc(g.name)}</span>
          <span class="fim-pill">${esc(CONTEXT_LABELS[e.context] || e.context)}</span>
          ${e.public ? pill({ label: 'Publique', color: '#4FD895' }) : ''}
          <span class="post-card-meta" style="margin-left:auto;">${opts.showAgent ? `<b>${esc(e.agentName)}</b> · ` : ''}${esc(e.evaluatorName)} · ${fmtDate(e.createdAt)}</span>
        </div>
        <div class="fim-mini-scores">${g.criteria.map((c) => `<span>${esc(c.label)}${c.weight !== 1 ? ` ×${fr(c.weight, 2)}` : ''} <b style="color:${pctColor(rawPercent(g.scale, e.scores?.[c.id]))}">${esc(rawLabel(g.scale, e.scores?.[c.id]))}</b></span>`).join('')}</div>
        ${e.strengths || e.improvements ? `<div class="fim-eval-text">${e.strengths ? `<strong>POINTS FORTS</strong>${esc(e.strengths)}` : ''}${e.improvements ? `<strong>AXES DE PROGRÈS</strong>${esc(e.improvements)}` : ''}</div>` : ''}
        <div class="sci-card-actions">
          ${e.public || canDelete ? `<button class="btn ghost small" type="button" data-eval-link="${esc(e.id)}">Copier le lien</button>` : ''}
          ${canDelete || opts.canPublish ? `<button class="btn ghost small" type="button" data-eval-pub="${e.public ? '0' : '1'}" data-id="${esc(e.id)}">${e.public ? 'Rendre privée' : e.publishedAt ? 'Rendre publique' : 'Rendre publique et publier'}</button>` : ''}
          ${canDelete ? `<button class="btn danger small" data-eval-del="${esc(e.id)}">Supprimer</button>` : ''}
        </div>
      </div>`;
  }
  // Lien direct vers une évaluation ou une formation (/rp/?eval=…, /rp/?formation=…)
  const deepLink = (kind, id) => `${location.origin}/rp/?${kind}=${encodeURIComponent(id)}`;
  // Liens partageables : le bot publie /f/<id>/ et /e/<id>/ sur le site avec l'aperçu
  // Discord (Open Graph) ; sans page publiée, le 404 du site redirige vers le portail
  const trainingShareLink = (id) => `${location.origin}/f/${encodeURIComponent(id)}/`;
  const evalShareLink = (id) => `${location.origin}/e/${encodeURIComponent(id)}/`;
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); window.showToast('Lien copié.', 'success'); } catch (e) { window.prompt('Copie ce lien :', text); }
  }
  function bindEvalCards(root, reload, api = '/api/rp/fim') {
    root.querySelectorAll('[data-eval-link]').forEach((b) => b.addEventListener('click', () => copyText(evalShareLink(b.dataset.evalLink))));
    root.querySelectorAll('[data-eval-pub]').forEach((b) => b.addEventListener('click', async () => {
      const pub = b.dataset.evalPub === '1';
      if (pub && !confirm('Rendre cette évaluation publique ? Le résultat sera visible de toute la FIM et annoncé sur Discord (une seule fois).')) return;
      try {
        await window.apiFetch(`${api}/evaluations/${encodeURIComponent(b.dataset.id)}/visibility`, { method: 'PATCH', body: JSON.stringify({ public: pub }) });
        window.showToast(pub ? 'Évaluation rendue publique.' : 'Évaluation rendue privée.', 'success');
        reload();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
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

  // Liens directs /rp/?eval=… et /rp/?formation=… : cible à mettre en avant une fois affichée
  let deepEvalId = null;
  let deepTrainingId = null;
  function focusTarget(el) {
    if (!el) return false;
    el.style.outline = '2px solid var(--accent)';
    el.style.outlineOffset = '3px';
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    return true;
  }
  function focusDeepEval(root) {
    if (deepEvalId && focusTarget(root.querySelector(`[data-eval-id="${CSS.escape(deepEvalId)}"]`))) deepEvalId = null;
  }
  function focusDeepTraining(root) {
    if (deepTrainingId && focusTarget(root.querySelector(`[data-training-id="${CSS.escape(deepTrainingId)}"]`))) deepTrainingId = null;
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
        loadPersonnel(),
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

    if (evalView === 'trainings') {
      main.innerHTML = `
        <div class="fim-hero">
          <div class="fim-hero-eyebrow">Commandement FIM · centre de formation</div>
          <h2>Formations</h2>
          <p>Sessions publiées par le commandement : inscris-toi, puis l'instructeur évalue les inscrits avec la grille de la session (les brevets sont délivrés automatiquement).</p>
        </div>
        <div class="fim-subnav">
          <button type="button" data-ev-view="people">${data.canEvaluate ? 'Opérateurs' : 'Mes évaluations'}</button>
          ${data.canEvaluate ? `<button type="button" data-ev-view="grids">Grilles & barèmes (${grids.filter((g) => !g.archived).length})</button>` : ''}
          <button type="button" data-ev-view="trainings" class="active">Formations</button>
        </div>
        <div id="fim-eval-body"></div>`;
      main.querySelectorAll('[data-ev-view]').forEach((b) => b.addEventListener('click', () => { evalView = b.dataset.evView; gridEditing = null; loadEvaluations(deptId); }));
      renderTrainings(document.getElementById('fim-eval-body'), grids, data, deptId);
      return;
    }

    // Vue opérateur : ses propres évaluations uniquement.
    if (!data.canEvaluate) {
      const me = agents.find((a) => norm(a.name || a.username) === norm(data.self));
      const unitId = me ? unitFromAgent(me) : null;
      const color = unitId ? unitColor(unitId) : '#6E76FF';
      const choices = gridsFromEvals(evaluations);
      const publicEvals = data.publicEvaluations || [];
      if (deepEvalId && !evaluations.some((e) => e.id === deepEvalId) && publicEvals.some((e) => e.id === deepEvalId)) evalView = 'public';
      const render = () => {
        const gv = choices.find((g) => g.id === evalGridView.self) || choices[0] || null;
        setSide([[String(evaluations.length), 'Évaluations'], [fmtPct(avgOf(evaluations.map((e) => e.percent).filter((v) => v != null))), 'Moyenne']], evaluations.slice(0, 4).map((e) => [new Date(e.createdAt).toLocaleDateString('fr-FR'), (VERDICT_META[e.verdict] || {}).label || '']));
        main.innerHTML = `
          <div class="fim-hero">
            <div class="fim-hero-eyebrow">Dossier personnel · lecture seule</div>
            <h2>Mes évaluations</h2>
            <p>Les évaluations rédigées par tes officiers après les opérations, exercices et revues périodiques. Seul le commandement peut en rédiger.</p>
          </div>
          <div class="fim-subnav">
            <button type="button" class="${evalView !== 'public' ? 'active' : ''}" data-ev-own>Mes évaluations</button>
            <button type="button" class="${evalView === 'public' ? 'active' : ''}" data-ev-public>Résultats publics (${publicEvals.length})</button>
            <button type="button" data-ev-view="trainings">Formations</button>
          </div>
          ${evalView === 'public' ? `<div class="fim-eval-profile">
            <p class="post-card-meta" style="margin:0 0 12px;">Résultats rendus publics par les instructeurs. Tes évaluations restent visibles de toi seul et du commandement, sauf si l'instructeur les rend publiques.</p>
            ${publicEvals.length ? publicEvals.map((e) => evalCard(e, false, { showAgent: true })).join('') : '<div class="empty-row">Aucun résultat public pour le moment.</div>'}
          </div>` : `<div class="fim-eval-profile" style="--u:${color}">
            <div style="display:flex; justify-content:flex-end; margin:-8px 0 6px;"><button class="btn ghost small" id="fim-export-btn" type="button">Exporter ma fiche</button></div>
            ${profileBlock(data.self || '—', unitId, evaluations, gv, color, choices)}
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 12px;">Historique</h3>
            ${evaluations.length ? evaluations.map((e) => evalCard(e, false)).join('') : '<div class="empty-row">Aucune évaluation pour le moment.</div>'}
          </div>`}`;
        main.querySelector('[data-ev-own]').addEventListener('click', () => { evalView = 'people'; render(); });
        main.querySelector('[data-ev-public]').addEventListener('click', () => { evalView = 'public'; render(); });
        bindEvalCards(main, () => loadEvaluations(deptId));
        focusDeepEval(main);
        document.getElementById('fim-profile-grid')?.addEventListener('change', (ev) => { evalGridView.self = ev.target.value; render(); });
        document.getElementById('fim-export-btn')?.addEventListener('click', () => exportFiche({ name: data.self, unit: unitId, tags: [] }, evaluations, null, []));
        main.querySelector('[data-ev-view="trainings"]').addEventListener('click', () => { evalView = 'trainings'; loadEvaluations(deptId); });
      };
      render();
      return;
    }

    if (evalView === 'public') evalView = 'people';
    const deepEval = deepEvalId && evaluations.find((e) => e.id === deepEvalId);
    if (deepEval) { evalView = 'people'; evalSelected = deepEval.agentName; evalFormOpen = false; }
    main.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Commandement FIM · réservé aux officiers</div>
        <h2>Évaluation des opérateurs</h2>
        <p>Note les opérateurs avec la grille de ton choix. Chaque grille définit ses critères, leurs coefficients, son barème (1 à 5, sur 20, lettres, acquis / non acquis…) et les seuils de l'avis automatique. Les moyennes entre grilles sont ramenées en pourcentage.</p>
      </div>
      <div class="fim-subnav">
        <button type="button" data-ev-view="people" class="${evalView === 'people' ? 'active' : ''}">Opérateurs</button>
        <button type="button" data-ev-view="grids" class="${evalView === 'grids' ? 'active' : ''}">Grilles & barèmes (${grids.filter((g) => !g.archived).length})</button>
        <button type="button" data-ev-view="trainings">Formations</button>
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

  // ---------------- Formations ----------------
  let trainingEditing = null;
  let trainingRoll = null; // { id, marks: { clé: statut }, extras: [noms] } pendant un appel
  const ATTENDANCE = {
    present: { label: 'Présent', color: '#4FD895' },
    retard: { label: 'Retard', color: '#F0A83C' },
    absent: { label: 'Absent', color: '#F0525A' },
    excuse: { label: 'Excusé', color: '#5AA9FF' },
  };
  const TRAINING_AUDIENCE = {
    fim: { label: 'FIM uniquement', color: '#9297A8' },
    eri: { label: 'FIM et candidats ERI', color: '#B07CFF' },
    dept: { label: 'Département organisateur', color: '#F0A83C' },
    all: { label: 'Tous les départements', color: '#5AA9FF' },
  };
  const audienceOf = (t) => (TRAINING_AUDIENCE[t.audience] ? t.audience : t.openToERI === false ? 'fim' : 'eri');
  const TRAINING_STATUS = {
    planifiee: { label: 'Inscriptions ouvertes', color: '#4FD895' },
    terminee: { label: 'Terminée', color: '#9297A8' },
    annulee: { label: 'Annulée', color: '#F0525A' },
  };
  // opts.portal : même écran pour le portail interdépartemental (API /api/rp/portal,
  // droits de gestion par formation, département organisateur au lieu de la grille)
  async function renderTrainings(body, grids, data, deptId, opts = {}) {
    const api = opts.portal ? '/api/rp/portal' : '/api/rp/fim';
    body.innerHTML = '<div class="center-msg">Chargement…</div>';
    let r;
    try {
      r = await window.apiFetch(`${api}/trainings`);
    } catch (err) {
      body.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    const canManage = !!r.canManage;
    const canManageT = (t) => (t.canManage === undefined ? canManage : !!t.canManage);
    const organizers = r.organizers || [];
    const selfKey = r.selfKey || personKey(data.self);
    const list = r.trainings || [];
    const now = Date.now();
    const upcoming = list.filter((t) => t.status === 'planifiee' && (t.at || 0) > now - 86400000).sort((a, b) => a.at - b.at);
    const past = list.filter((t) => !upcoming.includes(t));
    const gridName = (id) => grids.find((g) => g.id === id)?.name || (id === 'standard' ? 'Standard FIM' : '');
    if (!opts.portal) setSide([[String(upcoming.length), 'À venir'], [String(upcoming.filter((t) => (t.signups || {})[selfKey]).length), 'Inscrit']], upcoming.slice(0, 5).map((t) => [new Date(t.at).toLocaleDateString('fr-FR'), t.title]));
    if (trainingEditing) {
      const t = trainingEditing;
      body.innerHTML = `
        <div class="subsection" style="margin-top:0;">
          <h3>${t.id ? `Modifier « ${esc(t.title)} »` : 'Publier une formation'}</h3>
          <form id="fim-tr-form">
            <div class="field-grid">
              <div class="field-row"><label>Intitulé *</label><input id="tr-title" maxlength="100" required value="${esc(t.title || '')}" placeholder="Ex : Formation tireur d'élite — session 3"></div>
              <div class="field-row"><label>Date et heure *</label><input id="tr-at" type="datetime-local" required value="${t.at ? toLocalInput(t.at) : ''}"></div>
              ${opts.portal ? `<div class="field-row"><label>Organisateur</label><select id="tr-dept"${t.id ? ' disabled' : ''}>${organizers.map((o) => `<option value="${esc(o.id)}"${(t.deptId || organizers[0]?.id) === o.id ? ' selected' : ''}>${esc(o.name)}</option>`).join('')}</select></div>` : ''}
              ${opts.portal ? '' : `<div class="field-row"><label>Grille d'évaluation</label><select id="tr-grid"><option value="">— Aucune —</option>${grids.filter((g) => !g.archived).map((g) => `<option value="${esc(g.id)}"${t.gridId === g.id ? ' selected' : ''}>${esc(g.name)}${g.certificate?.enabled ? ' · brevet' : ''}</option>`).join('')}</select></div>`}
              <div class="field-row"><label>Lieu</label><input id="tr-place" maxlength="120" list="fim-places" value="${esc(t.place || '')}" placeholder="Ex : stand de tir"></div>
              <div class="field-row"><label>Instructeur</label><input id="tr-instructor" maxlength="80" value="${esc(t.instructor || data.self || '')}"></div>
              <div class="field-row"><label>Places (0 = illimité)</label><input id="tr-seats" type="number" min="0" max="100" value="${t.seats || 0}"></div>
            </div>
            <datalist id="fim-places">${SITE_PLACES.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
            <div class="field-row"><label>Programme</label><textarea id="tr-desc" rows="4" maxlength="2000">${esc(t.description || '')}</textarea></div>
            <div class="field-row" style="max-width:420px;"><label>Ouverte à</label><select id="tr-audience">${Object.entries(TRAINING_AUDIENCE).filter(([k]) => !opts.portal || (t.deptId || organizers[0]?.id) === 'fim_mmqbs55q2vge' || ['dept', 'all'].includes(k)).map(([k, a]) => `<option value="${k}"${audienceOf(t) === k ? ' selected' : ''}>${a.label}</option>`).join('')}</select></div>
            <div style="display:flex; gap:10px;"><button class="btn" type="submit">${t.id ? 'Enregistrer' : 'Publier (annoncée sur Discord)'}</button><button class="btn ghost" type="button" id="tr-cancel">Annuler</button></div>
          </form>
        </div>`;
      document.getElementById('tr-cancel').addEventListener('click', () => { trainingEditing = null; renderTrainings(body, grids, data, deptId, opts); });
      document.getElementById('fim-tr-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const v = (id) => document.getElementById(id).value.trim();
        const payload = { title: v('tr-title'), at: v('tr-at') ? new Date(v('tr-at')).getTime() : null, gridId: opts.portal ? (t.gridId || null) : v('tr-grid'), deptId: opts.portal ? (document.getElementById('tr-dept')?.value || t.deptId) : undefined, place: v('tr-place'), instructor: v('tr-instructor'), seats: Number(v('tr-seats')) || 0, description: v('tr-desc'), audience: v('tr-audience') };
        try {
          if (t.id) await window.apiFetch(`${api}/trainings/${encodeURIComponent(t.id)}`, { method: 'PUT', body: JSON.stringify(payload) });
          else await window.apiFetch(`${api}/trainings`, { method: 'POST', body: JSON.stringify(payload) });
          window.showToast(t.id ? 'Formation modifiée.' : 'Formation publiée.', 'success');
          trainingEditing = null;
          renderTrainings(body, grids, data, deptId, opts);
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      });
      return;
    }
    const rollPanel = (t) => {
      const roll = trainingRoll;
      const rows = Object.entries(t.signups || {}).sort((a, b) => a[1].at - b[1].at);
      return `<div class="fim-roll" data-roll="${esc(t.id)}">
        ${rows.map(([key, x]) => `<div class="fim-roll-row"><span class="n">${esc(withCallsign(x.name))}${x.walkIn ? ' <span class="post-card-meta">non inscrit</span>' : ''}</span>
          <div class="fim-roll-opts">${Object.entries(ATTENDANCE).map(([s, a]) => `<button type="button" style="--c:${a.color}" class="${roll.marks[key] === s ? 'on' : ''}" data-roll-key="${esc(key)}" data-roll-set="${s}">${a.label}</button>`).join('')}</div></div>`).join('')}
        ${roll.extras.map((n, i) => `<div class="fim-roll-row"><span class="n">${esc(n)} <span class="post-card-meta">non inscrit · présent</span></span><button type="button" class="fim-link" data-roll-unextra="${i}">retirer</button></div>`).join('')}
        <div class="fim-roll-foot">
          <input type="text" id="roll-extra" maxlength="80" placeholder="Ajouter un présent non inscrit (nom RP)">
          <button class="btn ghost small" type="button" id="roll-extra-add">Ajouter</button>
          <button class="btn ghost small" type="button" id="roll-all">Tous présents</button>
          <button class="btn small" type="button" id="roll-save">Enregistrer l'appel</button>
          <button class="btn ghost small" type="button" id="roll-cancel">Annuler</button>
        </div>
      </div>`;
    };
    const attendanceSummary = (t) => {
      const vals = Object.values(t.attendance || {});
      if (!vals.length) return '';
      return Object.entries(ATTENDANCE).map(([s, a]) => {
        const n = vals.filter((v) => v === s).length;
        return n ? `<span>${a.label}${n > 1 && s !== 'retard' ? 's' : ''} <b style="color:${a.color}">${n}</b></span>` : '';
      }).join('');
    };
    const card = (t) => {
      const entries = Object.entries(t.signups || {}).sort((a, b) => a[1].at - b[1].at);
      const signups = entries.map(([, x]) => x);
      const att = t.attendance || {};
      const rolling = trainingRoll && trainingRoll.id === t.id;
      const canRoll = canManageT(t) && t.status !== 'annulee' && (signups.length || t.status === 'terminee') && (t.at || 0) <= Date.now() + 3600000;
      const mine = !!(t.signups || {})[selfKey];
      const full = t.seats && signups.length >= t.seats;
      const st = TRAINING_STATUS[t.status] || TRAINING_STATUS.planifiee;
      const g = gridName(t.gridId);
      return `<div class="fim-op fim-training" style="--u:${st.color}" data-training-id="${esc(t.id)}">
        <div class="fim-op-top"><span class="fim-op-name" style="font-family:'Space Grotesk', sans-serif; letter-spacing:0;">${esc(t.title)}</span>${pill(st)}${mine ? ' ' + pill({ label: 'Inscrit', color: '#5AA9FF' }) : ''}</div>
        <div class="fim-op-meta">
          <span>Le <b>${esc(fmtDate(t.at))}</b> (${esc(relTime(t.at))})</span>
          ${t.place ? `<span>Lieu <b>${esc(t.place)}</b></span>` : ''}
          ${opts.portal && t.deptName ? `<span>Organisateur <b>${esc(t.deptName)}</b></span>` : ''}
          ${t.instructor ? `<span>Instructeur <b>${esc(withCallsign(t.instructor))}</b></span>` : ''}
          ${g ? `<span>Grille <b>${esc(g)}</b></span>` : ''}
          <span>Places <b>${signups.length}${t.seats ? ` / ${t.seats}` : ''}</b></span>
          <span>Ouverte à <b style="color:${TRAINING_AUDIENCE[audienceOf(t)].color}">${TRAINING_AUDIENCE[audienceOf(t)].label}</b></span>
        </div>
        ${t.description ? `<div class="fim-op-body">${esc(t.description)}</div>` : ''}
        ${t.attendanceAt ? `<div class="fim-op-meta"><span>Appel <b>${esc(fmtDate(t.attendanceAt))}</b>${t.attendanceBy ? ` par <b>${esc(t.attendanceBy)}</b>` : ''}</span>${attendanceSummary(t)}${att[selfKey] ? `<span>Toi <b style="color:${ATTENDANCE[att[selfKey]].color}">${ATTENDANCE[att[selfKey]].label}</b></span>` : ''}</div>` : ''}
        ${rolling ? rollPanel(t) : signups.length ? `<div class="fim-op-team">${entries.map(([key, x]) => { const a = ATTENDANCE[att[key]]; return `<span class="fim-chip${a ? ' att' : ''}"${a ? ` style="--c:${a.color}" title="${a.label}"` : ''}>${esc(withCallsign(x.name))}${a ? ` · ${a.label}` : ''}${!opts.portal && canManageT(t) && t.gridId && att[key] !== 'absent' ? ` <button type="button" class="fim-link" data-tr-eval="${esc(x.name)}" data-grid="${esc(t.gridId)}">évaluer</button>` : ''}</span>`; }).join('')}</div>` : ''}
        <div class="sci-card-actions">
          ${canRoll && !rolling ? `<button class="btn small" type="button" data-tr-roll="${esc(t.id)}">${t.attendanceAt ? "Refaire l'appel" : "Faire l'appel"}</button>` : ''}
          <button class="btn ghost small" type="button" data-tr-link="${esc(t.id)}">Copier le lien</button>
          ${t.status === 'planifiee' ? (mine ? `<button class="btn ghost small" type="button" data-tr-join="0" data-id="${esc(t.id)}">Me désinscrire</button>` : full ? '<span class="post-card-meta">Session complète</span>' : `<button class="btn small" type="button" data-tr-join="1" data-id="${esc(t.id)}">M'inscrire</button>`) : ''}
          ${canManageT(t) ? `
            <button class="btn ghost small" type="button" data-tr-edit="${esc(t.id)}">Modifier</button>
            ${t.status === 'planifiee' ? `<button class="btn ghost small" type="button" data-tr-announce="${esc(t.id)}">Renvoyer l'annonce</button>` : ''}
            ${t.status === 'planifiee' ? `<button class="btn ghost small" type="button" data-tr-status="terminee" data-id="${esc(t.id)}">Marquer terminée</button><button class="btn ghost small" type="button" data-tr-status="annulee" data-id="${esc(t.id)}">Annuler</button>` : `<button class="btn ghost small" type="button" data-tr-status="planifiee" data-id="${esc(t.id)}">Rouvrir</button>`}
            <button class="btn danger small" type="button" data-tr-del="${esc(t.id)}">Supprimer</button>` : ''}
        </div>
      </div>`;
    };
    body.innerHTML = `
      ${canManage ? '<div style="display:flex; justify-content:flex-end; margin-bottom:14px;"><button class="btn small" type="button" id="fim-tr-new">+ Publier une formation</button></div>' : ''}
      ${opts.portal ? '' : `<p class="post-card-meta" style="margin:0 0 14px;">Les formations « Tous les départements » apparaissent aussi sur le portail interdépartemental (/rp/?portail), où n'importe quel personnage peut s'inscrire.</p>`}
      <div class="record-block"><div class="record-block-head"><h2>À venir</h2><span class="count">${upcoming.length}</span></div>
        ${upcoming.length ? upcoming.map(card).join('') : '<div class="empty-row">Aucune formation prévue.</div>'}</div>
      ${past.length ? `<div class="record-block" style="margin-top:24px;"><div class="record-block-head"><h2>Passées et annulées</h2><span class="count">${past.length}</span></div>${past.slice(0, 15).map(card).join('')}</div>` : ''}`;
    const reload = () => renderTrainings(body, grids, data, deptId, opts);
    const act = async (url, opts, ok) => {
      try {
        await window.apiFetch(url, opts);
        if (ok) window.showToast(ok, 'success');
        reload();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    };
    document.getElementById('fim-tr-new')?.addEventListener('click', () => { trainingEditing = { audience: opts.portal ? 'all' : 'eri' }; reload(); });
    body.querySelectorAll('[data-tr-join]').forEach((b) => b.addEventListener('click', () => act(`${api}/trainings/${encodeURIComponent(b.dataset.id)}/signup`, { method: 'POST', body: JSON.stringify({ join: b.dataset.trJoin === '1' }) }, b.dataset.trJoin === '1' ? 'Inscription enregistrée.' : 'Désinscription enregistrée.')));
    body.querySelectorAll('[data-tr-status]').forEach((b) => b.addEventListener('click', () => act(`${api}/trainings/${encodeURIComponent(b.dataset.id)}/status`, { method: 'POST', body: JSON.stringify({ status: b.dataset.trStatus }) }, 'Formation mise à jour.')));
    body.querySelectorAll('[data-tr-del]').forEach((b) => b.addEventListener('click', () => { if (confirm('Supprimer cette formation et ses inscriptions ?')) act(`${api}/trainings/${encodeURIComponent(b.dataset.trDel)}`, { method: 'DELETE' }, 'Formation supprimée.'); }));
    body.querySelectorAll('[data-tr-edit]').forEach((b) => b.addEventListener('click', () => { trainingEditing = list.find((t) => t.id === b.dataset.trEdit) || null; reload(); }));
    body.querySelectorAll('[data-tr-announce]').forEach((b) => b.addEventListener('click', () => { if (confirm("Renvoyer l'annonce de cette formation sur Discord (infos à jour et nombre d'inscrits) ?")) act(`${api}/trainings/${encodeURIComponent(b.dataset.trAnnounce)}/announce`, { method: 'POST' }, 'Annonce renvoyée sur Discord.'); }));
    body.querySelectorAll('[data-tr-link]').forEach((b) => b.addEventListener('click', () => copyText(trainingShareLink(b.dataset.trLink))));
    focusDeepTraining(body);
    // Appel : les marques restent en mémoire jusqu'à l'enregistrement
    body.querySelectorAll('[data-tr-roll]').forEach((b) => b.addEventListener('click', () => {
      const t = list.find((x) => x.id === b.dataset.trRoll);
      trainingRoll = { id: t.id, marks: { ...(t.attendance || {}) }, extras: [] };
      reload();
    }));
    const rollBox = body.querySelector('[data-roll]');
    if (rollBox && trainingRoll) {
      rollBox.querySelectorAll('[data-roll-set]').forEach((b) => b.addEventListener('click', () => {
        const key = b.dataset.rollKey;
        trainingRoll.marks[key] = trainingRoll.marks[key] === b.dataset.rollSet ? undefined : b.dataset.rollSet;
        rollBox.querySelectorAll(`[data-roll-key="${CSS.escape(key)}"]`).forEach((x) => x.classList.toggle('on', x.dataset.rollSet === trainingRoll.marks[key]));
      }));
      rollBox.querySelectorAll('[data-roll-unextra]').forEach((b) => b.addEventListener('click', () => { trainingRoll.extras.splice(Number(b.dataset.rollUnextra), 1); reload(); }));
      const addExtra = () => {
        const inp = document.getElementById('roll-extra');
        const name = inp.value.trim();
        if (!name) return;
        const t = list.find((x) => x.id === trainingRoll.id);
        const known = Object.values(t?.signups || {}).some((x) => personKey(x.name) === personKey(name)) || trainingRoll.extras.some((n) => personKey(n) === personKey(name));
        if (known) { window.showToast('Déjà dans la liste.', 'error'); return; }
        trainingRoll.extras.push(name);
        reload();
      };
      document.getElementById('roll-extra-add').addEventListener('click', addExtra);
      document.getElementById('roll-extra').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addExtra(); } });
      document.getElementById('roll-all').addEventListener('click', () => {
        const t = list.find((x) => x.id === trainingRoll.id);
        Object.keys(t?.signups || {}).forEach((key) => { if (!trainingRoll.marks[key]) trainingRoll.marks[key] = 'present'; });
        reload();
      });
      document.getElementById('roll-cancel').addEventListener('click', () => { trainingRoll = null; reload(); });
      document.getElementById('roll-save').addEventListener('click', async () => {
        const t = list.find((x) => x.id === trainingRoll.id);
        const missing = Object.keys(t?.signups || {}).filter((key) => !trainingRoll.marks[key]).length;
        if (missing && !confirm(`${missing} inscrit(s) sans marque : ils ne figureront pas dans l'appel. Enregistrer quand même ?`)) return;
        const marks = Object.fromEntries(Object.entries(trainingRoll.marks).filter(([, s]) => s));
        const id = trainingRoll.id;
        const extras = trainingRoll.extras;
        trainingRoll = null;
        await act(`${api}/trainings/${encodeURIComponent(id)}/attendance`, { method: 'POST', body: JSON.stringify({ marks, extras }) }, 'Appel enregistré.');
      });
    }
    body.querySelectorAll('[data-tr-eval]').forEach((b) => b.addEventListener('click', () => {
      evalSelected = b.dataset.trEval;
      lastGridId = b.dataset.grid;
      evalFormOpen = true;
      evalView = 'people';
      loadEvaluations(deptId);
    }));
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
      bindEvalCards(box, () => loadEvaluations(deptId));
      focusDeepEval(box);
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
          <label style="display:flex; gap:8px; align-items:flex-start; font-size:13px; margin:6px 0 14px;"><input type="checkbox" id="ev-public" style="width:auto; margin-top:3px;"> <span>Rendre le résultat public : annonce « Résultat » sur Discord et visible de toute la FIM (les axes de progrès restent privés). Sinon, seuls ${esc(p.name)} et le commandement la voient.</span></label>
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
        const payload = { agentName: p.name, agentDiscordId: p.discordId || null, gridId: grid.id, unit: v('ev-unit'), context: v('ev-context'), scores, verdict: v('ev-verdict'), recommendation: v('ev-reco'), strengths: v('ev-strengths'), improvements: v('ev-improvements'), public: document.getElementById('ev-public').checked };
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
    // Tourne aussi onglet caché (c'est son rôle : notifier), via la requête partagée
    try { data = await fetchSituation(); } catch (e) { return; }
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

  // --- Portail interdépartemental : page ouverte à tout personnage RP ---
  // Formations publiées par les départements (inscription, et pour ceux qui
  // en ont le droit : publication, appel, statut), ses propres évaluations et
  // les résultats rendus publics. Liens directs : /rp/?portail, ?eval=…, ?formation=…
  async function renderPortal(root, onBack, opts = {}) {
    root.innerHTML = '<div class="center-msg">Chargement du portail…</div>';
    let data;
    try {
      data = await window.apiFetch('/api/rp/portal');
    } catch (err) {
      root.innerHTML = `<div class="center-msg">${err.status === 403 ? 'Le portail demande un personnage RP actif (ou un rôle staff avec l’accès Portail).' : `Erreur : ${esc(err.message)}`}</div>`;
      return;
    }
    if (opts.evalId) deepEvalId = opts.evalId;
    if (opts.trainingId) deepTrainingId = opts.trainingId;
    const status = data.isFim ? 'Opérateur FIM' : data.isEri ? 'Candidat ERI' : data.staffLevel && !data.selfKey ? 'Staff' : 'Personnel du Site-15';
    const rights = data.canManage
      ? `Gestion des formations : ${(data.organizers || []).map((o) => o.name).join(', ')}`
      : '';
    const evals = data.evaluations || [];
    const pubs = data.publicEvaluations || [];
    root.innerHTML = `
      <div class="fim-eri-wrap">
        ${onBack ? `<button class="terminal-breadcrumb" id="portal-back" style="margin-bottom:22px;">← SITE-15 // MENU PRINCIPAL</button>` : ''}
        <div class="fim-hero">
          <div class="fim-hero-eyebrow">Site-15 · Portail interdépartemental</div>
          <h2>Portail des formations</h2>
          <p>Formations publiées par les départements et ouvertes à ton profil, tes évaluations et les résultats rendus publics. Tes évaluations ne sont visibles que de toi et du commandement, sauf si l'instructeur les rend publiques.</p>
          <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <span class="fim-chip">${esc(data.name)}</span><span class="fim-chip">${esc(status)}</span>
            ${rights ? `<span class="fim-chip u" style="--u:#4FD895">${esc(rights)}</span>` : ''}
            ${data.canPublishResults ? '<span class="fim-chip u" style="--u:#4FD895">Résultats publics</span>' : ''}
            <button class="btn ghost small" type="button" id="portal-copy" style="margin-left:auto;">Copier le lien du portail</button>
          </div>
        </div>
        <div class="record-block" style="margin-top:18px;"><div class="record-block-head"><h2>Formations</h2></div><div id="portal-trainings"></div></div>
        <div class="record-block" style="margin-top:24px;"><div class="record-block-head"><h2>Mes évaluations</h2><span class="count">${evals.length}</span></div>
          ${evals.length ? evals.map((e) => evalCard(e, false)).join('') : '<div class="empty-row">Aucune évaluation pour le moment.</div>'}</div>
        <div class="record-block" style="margin-top:24px;"><div class="record-block-head"><h2>Résultats publics</h2><span class="count">${pubs.length}</span></div>
          ${pubs.length ? pubs.map((e) => evalCard(e, false, { showAgent: true, canPublish: data.canPublishResults })).join('') : '<div class="empty-row">Aucun résultat public pour le moment.</div>'}</div>
        ${credit()}
      </div>`;
    const reload = () => renderPortal(root, onBack);
    root.querySelector('#portal-back')?.addEventListener('click', onBack);
    root.querySelector('#portal-copy').addEventListener('click', () => copyText(`${location.origin}/rp/?portail`));
    bindEvalCards(root, reload, '/api/rp/portal');
    focusDeepEval(root);
    if (deepEvalId) { window.showToast("Cette évaluation n'est pas visible : elle est privée ou n'existe plus.", 'error'); deepEvalId = null; }
    // Même écran que l'onglet Formations du terminal FIM, en mode portail
    await renderTrainings(root.querySelector('#portal-trainings'), [], { self: data.name }, null, { portal: true });
    if (deepTrainingId) { window.showToast("Cette formation n'est pas ouverte à ton profil ou n'existe plus.", 'error'); deepTrainingId = null; }
  }
  // Ouvre une cible de lien direct dans le terminal FIM (membre FIM).
  function setDeepLink({ evalId, trainingId, view }) {
    if (view) evalView = view;
    if (evalId) { deepEvalId = evalId; evalView = 'people'; }
    if (trainingId) { deepTrainingId = trainingId; evalView = 'trainings'; }
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
          ${(data.trainings || []).length ? `<div class="record-block" style="margin-top:18px;"><div class="record-block-head"><h2>Formations ouvertes</h2><span class="count">${data.trainings.length}</span></div>
            ${data.trainings.map((t) => { const n = Object.keys(t.signups || {}).length; const mine = !!(t.signups || {})[data.selfKey]; return `<div class="fim-hq-row" style="--u:#B07CFF; margin-bottom:6px;">
              <span class="nm" style="font-family:'Space Grotesk', sans-serif; letter-spacing:0;">${esc(t.title)}</span>
              <span class="meta">${esc(fmtDate(t.at))}${t.place ? ` · ${esc(t.place)}` : ''} · ${n}${t.seats ? `/${t.seats}` : ''} inscrit${n > 1 ? 's' : ''}</span>
              <button class="btn small${mine ? ' ghost' : ''}" type="button" data-eri-join="${mine ? '0' : '1'}" data-id="${esc(t.id)}">${mine ? 'Me désinscrire' : "M'inscrire"}</button>
            </div>`; }).join('')}</div>` : ''}
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
      root.querySelectorAll('[data-eri-join]').forEach((b) => b.addEventListener('click', async () => {
        try {
          await window.apiFetch(`/api/rp/eri/trainings/${encodeURIComponent(b.dataset.id)}/signup`, { method: 'POST', body: JSON.stringify({ join: b.dataset.eriJoin === '1' }) });
          window.showToast(b.dataset.eriJoin === '1' ? 'Inscription enregistrée.' : 'Désinscription enregistrée.', 'success');
          const fresh = await checkEri();
          if (fresh) { Object.assign(data, fresh); render(); }
        } catch (err) {
          window.showToast(`Erreur : ${err.message}`, 'error');
        }
      }));
    };
    render();
  }

  // ---------------------------------------------------------------
  // Pastilles des onglets : nouveautés depuis la dernière visite
  // ---------------------------------------------------------------
  const SEEN_KEY = 'fim_seen_v1';
  function seenMap() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}'); } catch (e) { return {}; }
  }
  function markSeen(tabId) {
    const m = seenMap();
    m[tabId] = Date.now();
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(m)); } catch (e) { /* stockage indisponible */ }
    // Savoir ou Cours ne vident pas le badge des évaluations de l'onglet Formation
    if (groupOf(tabId) === tabId || tabId === 'fim-evals') setBadge(tabId, 0);
  }
  function setBadge(tabId, n) {
    const tab = document.querySelector(`.terminal-tab[data-tab="${groupOf(tabId)}"]`);
    if (!tab) return;
    let b = tab.querySelector('.fim-badge');
    if (!n) { b?.remove(); return; }
    if (!b) { b = document.createElement('span'); b.className = 'fim-badge'; tab.appendChild(b); }
    b.textContent = n > 9 ? '9+' : String(n);
  }
  let badgesAt = 0;
  async function refreshBadges(activeTab) {
    if (Date.now() - badgesAt < 60000) return;
    badgesAt = Date.now();
    const safe = (pr, fb) => pr.catch(() => fb);
    const [o, d, e, t] = await Promise.all([
      safe(window.apiFetch('/api/rp/fim/operations'), { operations: [] }),
      safe(window.apiFetch('/api/rp/fim/directives'), { directives: [] }),
      safe(window.apiFetch('/api/rp/fim/evaluations'), { evaluations: [] }),
      safe(window.apiFetch('/api/rp/fim/trainings'), { trainings: [] }),
    ]);
    const seen = seenMap();
    const self = e.self || '';
    const since = (tab) => seen[tab] || Date.now() - 3 * 86400000;
    const ops = (o.operations || []).filter((x) => (x.updatedAt || x.createdAt || 0) > since('fim-ops') && (x.status === 'planifiee' || x.status === 'en_cours'));
    const myUnit = null;
    const unread = unreadDirectives(d.directives || [], d.selfKey || '', myUnit).length;
    const mineEvals = (e.evaluations || []).filter((x) => norm(x.agentName) === norm(self) && (x.createdAt || 0) > since('fim-evals')).length;
    const newTr = (t.trainings || []).filter((x) => x.status === 'planifiee' && (x.createdAt || 0) > since('fim-evals')).length;
    const counts = { 'fim-ops': ops.length, 'fim-units': unread, 'fim-evals': mineEvals + newTr };
    Object.entries(counts).forEach(([tab, n]) => setBadge(tab, tab === activeTab && tab !== 'fim-units' ? 0 : n));
  }

  // ---------------------------------------------------------------
  // Point d'entrée appelé par rp/index.html
  // ---------------------------------------------------------------
  window.FIM = {
    tabs: [
      { id: 'fim-hq', label: 'QG', icon: 'siren' },
      { id: 'fim-ops', label: 'Opérations', icon: 'radio' },
      { id: 'fim-units', label: 'Personnel', icon: 'shield' },
      { id: 'fim-formation', label: 'Formation', icon: 'document' },
    ],
    async load(tabId, deptId) {
      stopRefresh();
      mainOverride = null;
      currentDeptId = deptId;
      startAlerts();
      sectionRoot = null;
      const main = document.getElementById('terminal-main');
      if (main && !unitDefsAt) main.innerHTML = '<div class="center-msg">Chargement…</div>';
      await loadUnitDefs();
      const group = tabId;
      if (TAB_GROUPS[group]) {
        if (group === 'fim-units') await checkGestionTab();
        if (!document.querySelector(`.terminal-tab.active[data-tab="${group}"]`)) return;
        const items = TAB_GROUPS[group].filter((x) => !x.gestion || gestionAllowed);
        if (!items.some((x) => x.id === groupSection[group])) groupSection[group] = items[0].id;
        tabId = groupSection[group];
        if (items.length > 1) {
          main.innerHTML = `
            <div class="fim-sections">${items.map((x) => `<button type="button" data-sec="${x.id}" class="${x.id === tabId ? 'active' : ''}">${typeof ICONS !== 'undefined' ? ICONS[x.icon] || '' : ''}${x.label}</button>`).join('')}</div>
            <div id="fim-section-body"></div>`;
          main.querySelectorAll('[data-sec]').forEach((b) => b.addEventListener('click', () => {
            groupSection[group] = b.dataset.sec;
            window.FIM.load(group, deptId);
          }));
          sectionRoot = document.getElementById('fim-section-body');
        }
      }
      if (!document.querySelector(`.terminal-tab.active[data-tab="${group}"]`)) return;
      if (tabId === 'fim-hq') loadHQ(deptId);
      else if (tabId === 'fim-ops') loadOperations();
      else if (tabId === 'fim-units') loadUnits(deptId);
      else if (tabId === 'fim-library') loadLibrary();
      else if (tabId === 'fim-courses') loadCourses();
      else if (tabId === 'fim-evals') loadEvaluations(deptId);
      else if (tabId === 'fim-gestion') loadGestion();
      else if (tabId === 'fim-effectifs') { mainOverride = null; loadStaff(); }
      markSeen(tabId);
      refreshBadges(tabId).catch(() => {});
    },
    stop: stopRefresh,
    goTab,
    checkEri,
    renderEriSpace,
    renderPortal,
    setDeepLink,
  };
})();
