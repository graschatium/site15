const { BOT_OWNER_IDS } = require('./permissions');
const { getConfig } = require('./configService');
const { DEPT_CHOICES } = require('./deptChoices');

// Même liste que celle utilisée par les commandes Discord existantes
// (/roster, /sanction, /view, /roster-config) : un ou plusieurs rôles
// "admin", un par serveur RP, séparés par des virgules dans .env. Un membre
// qui possède un de ces rôles SUR UN SERVEUR DONNÉ a un accès complet à ce
// serveur (tous les départements qui lui appartiennent, + sanctions/absences
// qui ne sont pas rattachées à un département précis).
const ADMIN_ROLE_IDS = (process.env.ADMIN_ROLE_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Deux façons de désigner l'owner du bot existent déjà dans le code
// (BOT_OWNER_IDS dans permissions.js, OWNER_ID dans roster.js/sanction.js/
// rosterConfig.js/view.js) — on accepte les deux ici pour rester cohérent
// avec le reste du bot.
const OWNER_ID = process.env.OWNER_ID || '';

function isOwner(discordId) {
  return (OWNER_ID && discordId === OWNER_ID) || BOT_OWNER_IDS.includes(discordId);
}

/**
 * Récupère EN DIRECT (jamais en cache) les rôles d'un membre sur un serveur
 * précis, via le client Discord du bot. C'est la source de vérité pour les
 * permissions du panel web : pas de rôles stockés dans le token de session,
 * donc un retrait de rôle sur Discord se répercute immédiatement.
 * Retourne un Set d'IDs de rôle, ou null si le membre n'est pas/plus sur ce
 * serveur (le serveur est alors juste ignoré, sans faire planter le reste).
 */
async function getMemberRoleIds(client, guildId, discordId) {
  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(discordId);
    return new Set(member.roles.cache.keys());
  } catch (err) {
    return null;
  }
}

/**
 * Calcule l'accès admin d'un utilisateur pour le panel web, département par
 * département, avec un seul fetch Discord par serveur RP (les départements
 * d'un même serveur partagent le même appel).
 *
 * Retourne :
 *  - isOwner: bool — accès total (tous départements, sanctions, absences).
 *  - isAdminAnywhere: bool — a un rôle ADMIN_ROLE_IDS sur AU MOINS un
 *    serveur RP. Donne accès aux sanctions (pas rattachées à un
 *    département précis).
 *  - adminGuildIds: Set<guildId> — serveurs où l'utilisateur est admin
 *    complet (utile pour scoper les absences, elles aussi par serveur).
 *  - depts: [{ deptId, name, guildId, level: 'admin' | 'director' }]
 *    — départements sur lesquels l'utilisateur peut agir (roster).
 */
async function computeAdminAccess(client, discordId) {
  const owner = isOwner(discordId);

  const result = {
    isOwner: owner,
    isAdminAnywhere: owner,
    adminGuildIds: new Set(),
    depts: [],
  };

  const config = await getConfig();
  const directors = config.directors || {};

  const guildIds = [...new Set(DEPT_CHOICES.map((d) => d.guildId).filter(Boolean))];
  const rolesByGuild = new Map();

  async function rolesFor(guildId) {
    if (!rolesByGuild.has(guildId)) {
      rolesByGuild.set(guildId, await getMemberRoleIds(client, guildId, discordId));
    }
    return rolesByGuild.get(guildId);
  }

  if (!owner) {
    for (const guildId of guildIds) {
      const roleIds = await rolesFor(guildId);
      if (roleIds && ADMIN_ROLE_IDS.some((r) => roleIds.has(r))) {
        result.isAdminAnywhere = true;
        result.adminGuildIds.add(guildId);
      }
    }
  }

  for (const dept of DEPT_CHOICES) {
    if (owner || (dept.guildId && result.adminGuildIds.has(dept.guildId))) {
      result.depts.push({ deptId: dept.value, name: dept.name, guildId: dept.guildId, level: 'admin' });
      continue;
    }

    // Accès "directeur" : rôle mappé via /roster-config set-director qui
    // liste ce département, ET réellement possédé par l'utilisateur (on
    // vérifie ses rôles sur le serveur du département — ou, si le
    // département n'a pas de serveur connu, sur tous les serveurs déjà
    // interrogés, en dernier recours).
    const directorRoleIds = Object.entries(directors)
      .filter(([, deptIds]) => deptIds.includes(dept.value))
      .map(([roleId]) => roleId);

    if (!directorRoleIds.length) continue;

    const guildsToCheck = dept.guildId ? [dept.guildId] : guildIds;
    let isDirector = false;
    for (const guildId of guildsToCheck) {
      const roleIds = await rolesFor(guildId);
      if (roleIds && directorRoleIds.some((r) => roleIds.has(r))) {
        isDirector = true;
        break;
      }
    }

    if (isDirector) {
      result.depts.push({ deptId: dept.value, name: dept.name, guildId: dept.guildId, level: 'director' });
    }
  }

  return result;
}

module.exports = { computeAdminAccess, ADMIN_ROLE_IDS, isOwner };