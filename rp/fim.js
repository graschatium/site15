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
  const UNIT_OPTIONS = ['EPSILON-11', 'NU-7', 'BETA-7', 'ALPHA-1', 'XI-8', 'INTER-UNITÉS'];

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
  function mainEl() {
    return document.getElementById('terminal-main');
  }
  function credit() {
    return `<div class="fim-credit">Contenu d'univers inspiré de la <a href="https://scp-wiki.wikidot.com/" target="_blank" rel="noopener">Fondation SCP</a> (CC BY-SA 3.0), adapté au Site-15.</div>`;
  }
  function unitFromAgent(agent) {
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
  // Onglet Situation (en direct)
  // ---------------------------------------------------------------
  async function loadSituation(silent) {
    const main = mainEl();
    if (!silent) main.innerHTML = '<div class="center-msg">Connexion au réseau tactique…</div>';
    let data;
    try {
      data = await window.apiFetch('/api/rp/fim/situation');
    } catch (err) {
      if (!silent) main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    if (!document.getElementById('fim-situation') && silent) return stopRefresh();

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
    main.innerHTML = `
      <div id="fim-situation">
        <div class="fim-hero">
          <div class="fim-hero-eyebrow">Réseau tactique FIM · actualisé toutes les 30 s</div>
          <h2>Situation du Site-15</h2>
          <p>État envoyé en direct par les serveurs de jeu : code d'alerte, brèches, protocoles et opérateurs FIM déployés.</p>
          <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
            <span class="fim-code" style="--c:${worstMeta.color}"><i></i>CODE ${esc(worst)}</span>
            <span class="fim-chip">${breaches} brèche${breaches > 1 ? 's' : ''}</span>
            <span class="fim-chip">${servers.reduce((a, s) => a + s.players, 0)} joueurs en jeu</span>
          </div>
          <div class="fim-posture" style="--c:${worstMeta.color}">${worstMeta.posture}</div>
        </div>

        <div class="record-block">
          <div class="record-block-head"><h2>Unités</h2><span class="count">${deployedCount} déployé${deployedCount > 1 ? 's' : ''}</span></div>
          <div class="fim-grid">
            ${UNITS.map((u) => `
              <div class="fim-unit-card" style="--u:${u.color}; cursor:default;">
                <div class="fim-unit-top">${crest(u.letter)}<div><div class="fim-unit-code">${esc(u.name)}</div><div class="fim-unit-nick">${esc(u.nick)}</div></div></div>
                <div class="fim-unit-foot"><span class="fim-live${totals[u.id] ? ' on' : ''}"><i></i>${totals[u.id] ? `${totals[u.id]} EN SERVICE` : 'EN RÉSERVE'}</span><span>${esc(u.callsign)}</span></div>
              </div>`).join('')}
          </div>
        </div>

        <div class="record-block">
          <div class="record-block-head"><h2>Serveurs en ligne</h2><span class="count">${servers.length}</span></div>
          ${servers.length ? servers.map(serverCard).join('') : '<div class="empty-row">Aucun serveur de jeu en ligne. Le réseau tactique reprendra dès qu\'un serveur ouvrira.</div>'}
        </div>
      </div>
    `;
    if (!refreshTimer) refreshTimer = setInterval(() => loadSituation(true), 30000);
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
  async function loadUnits(deptId) {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let agents = [];
    try {
      const data = await window.apiFetch(`/api/rp/depts/${encodeURIComponent(deptId)}`);
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
        <div class="fim-hero">
          <div class="fim-hero-eyebrow">Commandement FIM · ordre de bataille</div>
          <h2>Forces d'Intervention Mobiles du Site-15</h2>
          <p>Quatre unités et un bataillon affilié. Chacune a sa spécialité, son indicatif et ses règles. Sélectionne une unité pour ouvrir son dossier.</p>
        </div>
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
            <div style="color:var(--ink)"><h3>FIM ${esc(u.name)} <span style="color:${u.color}">${esc(u.nick)}</span></h3><div class="fim-motto">« ${esc(u.motto)} »</div></div>
          </div>
          <div class="fim-facts">${Object.entries(u.facts).map(([k, v]) => `<div class="fim-fact"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div>
          <div class="sci-body-rendered">${window.renderMarkdown(u.body)}</div>
          <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 4px;">Opérateurs affectés</h3>
          ${roster.length
            ? `<div class="fim-roster">${roster.map((a) => `<span class="fim-chip u">${esc(a.rank ? `${a.rank} · ` : '')}${esc(a.name || a.username)}</span>`).join('')}</div>`
            : `<div style="font-size:12.5px; color:var(--ink-faint);">Aucun opérateur rattaché à cette unité dans le roster${unassigned ? ` (${unassigned} opérateur(s) sans unité renseignée : la division de l'agent doit contenir le nom de l'unité, ex. « E-11 »)` : ''}.</div>`}
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

  // ---------------------------------------------------------------
  // Onglet Opérations
  // ---------------------------------------------------------------
  let opsFilter = 'actives';
  async function loadOperations() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let data;
    try {
      data = await window.apiFetch('/api/rp/fim/operations');
    } catch (err) {
      main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    const ops = data.operations || [];
    const canCommand = !!data.canCommand;
    const active = ops.filter((o) => o.status === 'en_cours');
    setSide(
      [[String(active.length), 'En cours'], [String(ops.filter((o) => o.status === 'planifiee').length), 'Planifiées']],
      ops.slice(0, 5).map((o) => [STATUS_META[o.status]?.label || o.status, `${o.codeName} · ${unitLabel(o.unit)}`])
    );
    const filters = {
      actives: (o) => o.status === 'en_cours' || o.status === 'planifiee',
      archives: (o) => o.status === 'terminee' || o.status === 'annulee',
      toutes: () => true,
    };
    const list = ops.filter(filters[opsFilter] || filters.actives);

    main.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Commandement FIM · ordres de mission</div>
        <h2>Opérations</h2>
        <p>Chaque intervention est enregistrée ici avec son nom de code, son unité, sa priorité et ses règles d'engagement. Le statut est mis à jour sur le terrain, et chaque changement est journalisé.</p>
      </div>
      <div class="fim-subnav">
        ${[['actives', `Actives (${ops.filter(filters.actives).length})`], ['archives', `Archives (${ops.filter(filters.archives).length})`], ['toutes', `Toutes (${ops.length})`], ['nouvelle', '+ Nouvel ordre']]
          .map(([k, l]) => `<button type="button" data-f="${k}" class="${k === opsFilter ? 'active' : ''}">${l}</button>`).join('')}
      </div>
      <div id="fim-ops-body"></div>
    `;
    main.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => {
      opsFilter = b.dataset.f;
      loadOperations();
    }));

    const body = document.getElementById('fim-ops-body');
    if (opsFilter === 'nouvelle') {
      body.innerHTML = opForm();
      bindOpForm();
      return;
    }
    body.innerHTML = list.length ? list.map((o) => opCard(o, canCommand)).join('') : '<div class="empty-row">Aucune opération dans cette liste.</div>';
    body.querySelectorAll('[data-op-status]').forEach((b) => b.addEventListener('click', async () => {
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
    body.querySelectorAll('[data-op-delete]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Supprimer définitivement cet ordre de mission ?')) return;
      try {
        await window.apiFetch(`/api/rp/fim/operations/${encodeURIComponent(b.dataset.id)}`, { method: 'DELETE' });
        window.showToast('Ordre supprimé.', 'success');
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    }));
    body.querySelectorAll('[data-op-debrief]').forEach((b) => b.addEventListener('click', () => {
      pendingDebriefOp = b.dataset.id;
      document.querySelector('.terminal-tab[data-tab="fim-debriefs"]')?.click();
    }));
  }

  function opCard(o, canCommand) {
    const st = STATUS_META[o.status] || STATUS_META.planifiee;
    const pr = PRIORITY_META[o.priority] || PRIORITY_META.routine;
    const actions = [];
    if (o.status === 'planifiee') actions.push(`<button class="btn small" data-op-status="en_cours" data-id="${esc(o.id)}">Lancer</button>`);
    if (o.status === 'en_cours') actions.push(`<button class="btn small" data-op-status="terminee" data-id="${esc(o.id)}">Clôturer</button>`);
    if (o.status === 'planifiee' || o.status === 'en_cours') actions.push(`<button class="btn ghost small" data-op-status="annulee" data-id="${esc(o.id)}">Annuler</button>`);
    if (o.status === 'terminee') actions.push(`<button class="btn ghost small" data-op-debrief data-id="${esc(o.id)}">Rédiger le débriefing</button>`);
    if (canCommand) actions.push(`<button class="btn danger small" data-op-delete data-id="${esc(o.id)}">Supprimer</button>`);
    return `
      <div class="fim-op" style="--u:${unitColor(o.unit)}">
        <div class="fim-op-top">
          <span class="fim-op-name">OPÉRATION ${esc(o.codeName)}</span>
          ${pill(pr)} ${pill(st)}
        </div>
        <div class="fim-op-meta">
          <span>Unité <b>${esc(unitLabel(o.unit))}</b></span>
          ${o.zone ? `<span>Zone <b>${esc(o.zone)}</b></span>` : ''}
          ${o.target ? `<span>Cible <b>${esc(o.target)}</b></span>` : ''}
          ${o.roe ? `<span>RDE <b>${esc(o.roe)}</b></span>` : ''}
          <span>Émis par <b>${esc(o.authorCharacterName)}</b> · ${fmtDate(o.createdAt)}</span>
        </div>
        <div class="fim-op-body">${esc(o.objective)}</div>
        ${o.assigned ? `<div class="fim-op-meta" style="margin:10px 0 0;">Affectés <b>${esc(o.assigned)}</b></div>` : ''}
        ${(o.statusLog || []).length > 1 ? `<div class="fim-op-log">${o.statusLog.map((l) => `${fmtDate(l.at)} — ${esc(STATUS_META[l.status]?.label || l.status)} par ${esc(l.by)}${l.note ? ` : ${esc(l.note)}` : ''}`).join('<br>')}</div>` : ''}
        ${actions.length ? `<div class="sci-card-actions">${actions.join('')}</div>` : ''}
      </div>`;
  }

  function opForm() {
    return `
      <div class="subsection" style="margin-top:0;">
        <h3>Émettre un ordre de mission</h3>
        <form id="fim-op-form">
          <div class="field-grid">
            <div class="field-row"><label>Nom de code *</label><input id="op-code" maxlength="60" placeholder="Ex : RENARD NOIR" required></div>
            <div class="field-row"><label>Unité</label><select id="op-unit">${UNIT_OPTIONS.map((u) => `<option value="${u}">${esc(unitLabel(u))}</option>`).join('')}</select></div>
            <div class="field-row"><label>Priorité</label><select id="op-priority">${Object.entries(PRIORITY_META).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}</select></div>
            <div class="field-row"><label>Règles d'engagement</label><select id="op-roe">${['RDE-0 Observation', 'RDE-1 Riposte', 'RDE-2 Neutralisation', 'RDE-3 Feu libre', 'RDE-Ω Omega'].map((r, i) => `<option${i === 1 ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
            <div class="field-row"><label>Zone</label><input id="op-zone" maxlength="80" placeholder="Ex : Zone de confinement lourde"></div>
            <div class="field-row"><label>Cible / entité</label><input id="op-target" maxlength="80" placeholder="Ex : SCP-939, cellule IC…" list="fim-scp-list"></div>
          </div>
          <datalist id="fim-scp-list">${SCPS.map((s) => `<option value="${s.id}">`).join('')}<option value="Insurrection du Chaos"><option value="Classe-D évadé"></datalist>
          <div class="field-row"><label>Objectif et déroulé *</label><textarea id="op-objective" rows="6" maxlength="4000" placeholder="Objectif, point de regroupement, équipes, consignes particulières…" required></textarea></div>
          <div class="field-row"><label>Opérateurs affectés</label><input id="op-assigned" maxlength="400" placeholder="Ex : RENARD-1 (chef), RENARD-2, K9"></div>
          <button class="btn" type="submit">Émettre l'ordre</button>
        </form>
      </div>`;
  }
  function bindOpForm() {
    document.getElementById('fim-op-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const payload = { codeName: v('op-code'), unit: v('op-unit'), priority: v('op-priority'), roe: v('op-roe'), zone: v('op-zone'), target: v('op-target'), objective: v('op-objective'), assigned: v('op-assigned') };
      if (!payload.codeName || !payload.objective) { window.showToast('Nom de code et objectif obligatoires.', 'error'); return; }
      try {
        await window.apiFetch('/api/rp/fim/operations', { method: 'POST', body: JSON.stringify(payload) });
        window.showToast('Ordre de mission émis.', 'success');
        opsFilter = 'actives';
        loadOperations();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Onglet Débriefings
  // ---------------------------------------------------------------
  let pendingDebriefOp = null;
  async function loadDebriefs() {
    const main = mainEl();
    main.innerHTML = '<div class="center-msg">Chargement…</div>';
    let debriefs = [];
    let ops = [];
    try {
      const [d, o] = await Promise.all([window.apiFetch('/api/rp/fim/debriefs'), window.apiFetch('/api/rp/fim/operations')]);
      debriefs = d.debriefs || [];
      ops = o.operations || [];
    } catch (err) {
      main.innerHTML = `<div class="center-msg">Erreur : ${esc(err.message)}</div>`;
      return;
    }
    const success = debriefs.filter((d) => d.outcome === 'succes').length;
    setSide(
      [[String(debriefs.length), 'Débriefings'], [debriefs.length ? `${Math.round((success / debriefs.length) * 100)}%` : '—', 'Succès']],
      debriefs.slice(0, 5).map((d) => [new Date(d.createdAt).toLocaleDateString('fr-FR'), d.title])
    );
    const preOp = ops.find((o) => o.id === pendingDebriefOp);
    pendingDebriefOp = null;
    const opName = (id) => ops.find((o) => o.id === id)?.codeName;

    main.innerHTML = `
      <div class="fim-hero">
        <div class="fim-hero-eyebrow">Rapports après action</div>
        <h2>Débriefings</h2>
        <p>Après chaque opération : ce qui s'est passé, ce qui a coûté, ce qu'on change. Les leçons alimentent la doctrine.</p>
      </div>
      <div class="subsection" style="margin:0 0 24px;">
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
          <div class="field-row"><label>Déroulé *</label><textarea id="db-summary" rows="6" maxlength="6000" required></textarea></div>
          <div class="field-row"><label>Leçons et recommandations</label><textarea id="db-lessons" rows="3" maxlength="3000"></textarea></div>
          <button class="btn" type="submit">Enregistrer le débriefing</button>
        </form>
      </div>
      <div class="record-block">
        <div class="record-block-head"><h2>Archives</h2><span class="count">${debriefs.length}</span></div>
        ${debriefs.length ? debriefs.map((d) => `
          <div class="fim-op" style="--u:${unitColor(d.unit)}">
            <div class="fim-op-top"><span class="fim-op-name" style="font-family:'Space Grotesk', sans-serif; letter-spacing:0;">${esc(d.title)}</span>${pill(OUTCOME_META[d.outcome] || OUTCOME_META.partiel)}</div>
            <div class="fim-op-meta">
              <span>Unité <b>${esc(unitLabel(d.unit))}</b></span>
              ${d.operationId && opName(d.operationId) ? `<span>Opération <b>${esc(opName(d.operationId))}</b></span>` : ''}
              ${d.scp ? `<span>Contre <b>${esc(d.scp)}</b></span>` : ''}
              ${d.losses ? `<span>Pertes <b>${esc(d.losses)}</b></span>` : ''}
              <span>${esc(d.authorCharacterName)} · ${fmtDate(d.createdAt)}</span>
            </div>
            <div class="fim-op-body">${esc(d.summary)}</div>
            ${d.lessons ? `<div class="fim-op-log" style="color:var(--ink-dim); font-family:'Inter', sans-serif; font-size:12.5px;"><b style="font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--accent-2); letter-spacing:.08em;">LEÇONS</b><br>${esc(d.lessons)}</div>` : ''}
          </div>`).join('') : '<div class="empty-row">Aucun débriefing enregistré.</div>'}
      </div>
    `;
    document.getElementById('fim-db-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const payload = { title: v('db-title'), operationId: v('db-op'), unit: v('db-unit'), outcome: v('db-outcome'), scp: v('db-scp'), losses: v('db-losses'), summary: v('db-summary'), lessons: v('db-lessons') };
      if (!payload.title || !payload.summary) { window.showToast('Titre et déroulé obligatoires.', 'error'); return; }
      try {
        await window.apiFetch('/api/rp/fim/debriefs', { method: 'POST', body: JSON.stringify(payload) });
        window.showToast('Débriefing enregistré.', 'success');
        loadDebriefs();
      } catch (err) {
        window.showToast(`Erreur : ${err.message}`, 'error');
      }
    });
  }

  // ---------------------------------------------------------------
  // Onglet Reconfinement (fiches SCP)
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

Le code le plus grave entre tous les serveurs est affiché dans l'onglet *Situation*.`;
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
    return `
      <div class="fim-eval-card">
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
          ${gridView ? `
            ${gridChoices.length > 1 ? `<div class="field-row" style="margin-bottom:10px;"><label>Détail par grille</label><select id="fim-profile-grid">${gridChoices.map((g) => `<option value="${esc(g.id)}"${g.id === gridView.id ? ' selected' : ''}>${esc(g.name)} (${evals.filter((e) => e.gridId === g.id).length})</option>`).join('')}</select></div>` : `<div class="post-card-meta" style="margin-bottom:10px;">Grille : ${esc(gridView.name)} · ${scoped.length} évaluation(s)</div>`}
            <div class="fim-bars">${gridView.criteria.map((c) => `<div class="fim-bar-row"><span>${esc(c.label)}</span><div class="fim-bar"><i style="width:${avg[c.id] || 0}%; --c:${pctColor(avg[c.id])}"></i></div><b>${esc(pctInScale(gridView.scale, avg[c.id]))}</b></div>`).join('')}</div>` : ''}
        </div>
      </div>`;
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
    try {
      const [d, g, dept] = await Promise.all([
        window.apiFetch('/api/rp/fim/evaluations'),
        window.apiFetch('/api/rp/fim/eval-grids').catch(() => ({ grids: [] })),
        window.apiFetch(`/api/rp/depts/${encodeURIComponent(deptId)}`).catch(() => null),
      ]);
      data = d;
      grids = g.grids || [];
      if (data.canEvaluate) extra = await window.apiFetch('/api/rp/fim/evaluables').catch(() => extra);
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
            ${profileBlock(data.self || '—', unitId, evaluations, gv, color, choices)}
            <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px; margin:22px 0 12px;">Historique</h3>
            ${evaluations.length ? evaluations.map((e) => evalCard(e, false)).join('') : '<div class="empty-row">Aucune évaluation pour le moment.</div>'}
          </div>`;
        document.getElementById('fim-profile-grid')?.addEventListener('change', (ev) => { evalGridView.self = ev.target.value; render(); });
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
    else renderPeople(body, data, grids, evaluations, agents, extra, deptId);
  }

  // ---------------- Vue officier : opérateurs ----------------
  function renderPeople(body, data, grids, evaluations, agents, extra, deptId) {
    const people = new Map();
    agents.forEach((a) => {
      const name = a.name || a.username;
      if (name) people.set(norm(name), { name, unit: unitFromAgent(a), evals: [], tags: ['FIM'] });
    });
    // Membres des rôles Discord évaluables (ex : ERI), qu'ils soient FIM ou non.
    (extra.people || []).forEach((x) => {
      const key = norm(x.name);
      if (!key) return;
      const existing = people.get(key);
      if (existing) existing.tags = [...new Set([...existing.tags, ...x.roles])];
      else people.set(key, { name: x.name, unit: x.deptId === 'fim_mmqbs55q2vge' ? unitFromAgent(x) : null, evals: [], tags: x.roles, discordName: x.discordName });
    });
    evaluations.forEach((e) => {
      const key = norm(e.agentName);
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
          <span class="fim-score" style="color:${pctColor(avg)}">${avg == null ? '—' : `${fr(avg, 0)}%`}</span>
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
      box.innerHTML = `
        ${profileBlock(p.name, p.unit, p.evals, gv, color, choices, p.tags)}${p.discordName && norm(p.discordName) !== norm(p.name) ? `<div class="post-card-meta" style="margin-top:-4px;">Discord : ${esc(p.discordName)}</div>` : ''}
        <div style="display:flex; justify-content:space-between; align-items:center; margin:22px 0 12px; gap:10px; flex-wrap:wrap;">
          <h3 style="font-family:'Space Grotesk', sans-serif; font-size:14.5px;">${evalFormOpen ? 'Nouvelle évaluation' : 'Historique'}</h3>
          ${isSelf ? '<span class="post-card-meta">Auto-évaluation impossible</span>' : `<button class="btn small${evalFormOpen ? ' ghost' : ''}" id="fim-eval-toggle" type="button">${evalFormOpen ? 'Annuler' : '+ Évaluer'}</button>`}
        </div>
        <div id="fim-eval-zone">${evalFormOpen && !isSelf ? '' : (p.evals.length ? p.evals.map((e) => evalCard(e, true)).join('') : '<div class="empty-row">Jamais évalué.</div>')}</div>
      `;
      document.getElementById('fim-profile-grid')?.addEventListener('change', (ev) => { evalGridView[norm(p.name)] = ev.target.value; renderProfile(); });
      document.getElementById('fim-eval-toggle')?.addEventListener('click', () => { evalFormOpen = !evalFormOpen; renderProfile(); });
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
        const payload = { agentName: p.name, gridId: grid.id, unit: v('ev-unit'), context: v('ev-context'), scores, verdict: v('ev-verdict'), recommendation: v('ev-reco'), strengths: v('ev-strengths'), improvements: v('ev-improvements') };
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
        <button class="btn small" id="fim-grid-new" type="button">+ Nouvelle grille</button>
      </div>
      <div class="fim-grid">
        ${grids.map((g) => `
          <div class="fim-grid-card${g.archived ? ' archived' : ''}">
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <h4 style="margin-right:auto;">${esc(g.name)}</h4>
              ${g.builtin ? '<span class="fim-pill" style="--c:var(--accent-2)">Par défaut</span>' : ''}
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
      const payload = { name: g.name, description: g.description, scale: g.scale, criteria: g.criteria, thresholds: g.thresholds };
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
  // Point d'entrée appelé par rp/index.html
  // ---------------------------------------------------------------
  window.FIM = {
    tabs: [
      { id: 'fim-situation', label: 'Situation', icon: 'siren' },
      { id: 'fim-units', label: 'Unités', icon: 'shield' },
      { id: 'fim-ops', label: 'Opérations', icon: 'radio' },
      { id: 'fim-debriefs', label: 'Débriefings', icon: 'document' },
      { id: 'fim-containment', label: 'Reconfinement', icon: 'alertTriangle' },
      { id: 'fim-doctrine', label: 'Doctrine', icon: 'folder' },
      { id: 'fim-evals', label: 'Évaluations', icon: 'badge' },
    ],
    load(tabId, deptId) {
      stopRefresh();
      if (tabId === 'fim-situation') loadSituation(false);
      else if (tabId === 'fim-units') loadUnits(deptId);
      else if (tabId === 'fim-ops') loadOperations();
      else if (tabId === 'fim-debriefs') loadDebriefs();
      else if (tabId === 'fim-containment') loadContainment();
      else if (tabId === 'fim-doctrine') loadDoctrine();
      else if (tabId === 'fim-evals') loadEvaluations(deptId);
    },
    stop: stopRefresh,
  };
})();
