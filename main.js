const fs = require('fs');
const path = require('path');
const { Client, MessageEmbed } = require('discord.js-selfbot-v13');
const axios = require('axios');

const baseDir = path.dirname(process.execPath);
const envPath = path.join(baseDir, '.env');
const checkedUsersPath = path.join(baseDir, 'checked-users.txt');

require('dotenv').config({
  path: envPath,
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const CHECKED_USERS_FILE = checkedUsersPath;

const client = new Client();

const VIOLATION_FLAGS = [
    'SPAMMER',
];

const ALLOWED_BADGES = [
    'EARLY_SUPPORTER',
    'EARLY_VERIFIED_BOT_DEVELOPER',
    'VERIFIED_BOT_DEVELOPER',
    'HYPESQUAD_EVENTS',
    'HYPESQUAD_BRAVERY',
    'HYPESQUAD_BRILLIANCE',
    'HYPESQUAD_BALANCE',
    'DISCORD_CERTIFIED_MODERATOR',
    'MODERATOR_PROGRAMS_ALUMNI',
    'BUG_HUNTER_LEVEL_1',
    'BUG_HUNTER_LEVEL_2',
    'PREMIUM_EARLY_SUPPORTER',
    'ACTIVE_DEVELOPER',
    'QUEST_COMPLETED',
];

function loadCheckedUserIds() {
    if (!fs.existsSync(CHECKED_USERS_FILE)) {
        fs.writeFileSync(CHECKED_USERS_FILE, '', 'utf8');
        return new Set();
    }
    return new Set(
        fs.readFileSync(CHECKED_USERS_FILE, 'utf8')
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean)
    );
}

function saveCheckedUserId(userId) {
    fs.appendFileSync(CHECKED_USERS_FILE, `${userId}\n`, 'utf8');
}

function getNitroBoostBadges(member) {
    const premiumSince = member.premiumSince;
    if (!premiumSince) return [];

    const months = Math.floor((Date.now() - premiumSince.getTime()) / (1000 * 60 * 60 * 24 * 30));

    let level = 1;
    if (months >= 24) level = 9;
    else if (months >= 18) level = 8;
    else if (months >= 15) level = 7;
    else if (months >= 12) level = 6;
    else if (months >= 9) level = 5;
    else if (months >= 6) level = 4;
    else if (months >= 3) level = 3;
    else if (months >= 2) level = 2;

    return [`NITRO_BOOST_LEVEL_${level}`];
}

const checkedUserIds = loadCheckedUserIds();

async function processMember(member, guild) {
    const userId = member.user.id;

    if (checkedUserIds.has(userId)) {
        console.log(`[=] Already checked: ${member.user.username} (${userId})`);
        return;
    }

    checkedUserIds.add(userId);
    saveCheckedUserId(userId);

    const allFlags = member.user.flags?.toArray() || [];
    const nitroBoostBadges = getNitroBoostBadges(member);
    const allBadges = [...allFlags, ...nitroBoostBadges];

    const badges = allBadges.filter(b => ALLOWED_BADGES.includes(b) || b.startsWith('NITRO_BOOST_LEVEL_'));
    const violations = allBadges.filter(b => VIOLATION_FLAGS.includes(b));

    const username = member.user.username;
    const displayName = member.displayName;
    const serverName = guild.name;
    const avatarURL = member.user.displayAvatarURL({ dynamic: true });

    const hasRequirement =
        allFlags.includes('EARLY_VERIFIED_BOT_DEVELOPER') ||
        allFlags.includes('VERIFIED_BOT_DEVELOPER') ||
        allFlags.includes('EARLY_SUPPORTER') ||
        allFlags.includes('HYPESQUAD_EVENTS') ||
        allFlags.includes('HYPESQUAD_BRAVERY') ||
        allFlags.includes('HYPESQUAD_BRILLIANCE') ||
        allFlags.includes('HYPESQUAD_BALANCE') ||
        allFlags.includes('DISCORD_CERTIFIED_MODERATOR') ||
        allFlags.includes('MODERATOR_PROGRAMS_ALUMNI') ||
        allFlags.includes('BUG_HUNTER_LEVEL_1') ||
        allFlags.includes('BUG_HUNTER_LEVEL_2') ||
        allFlags.includes('PREMIUM_EARLY_SUPPORTER') ||
        allFlags.includes('ACTIVE_DEVELOPER') ||
        allFlags.includes('QUEST_COMPLETED') ||
        nitroBoostBadges.length > 0 ||
        username.length === 2 ||
        username.length === 3;

    if (!hasRequirement) {
        console.log('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀');
        console.log(`[+] User not found: ${username}`);
        console.log(`[+] Not found in server: ${serverName}`);
        console.log('______________');
        return;
    }

    console.log('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀');
    console.log(`[+] User found: ${username}`);
    console.log(`[+] Server: ${serverName}`);
    console.log('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀');

    const embed = new MessageEmbed()
        .setColor('#32CD32')
        .setTitle('User Found')
        .setDescription(
            `**User ID**: \`${userId}\`\n` +
            `**Username**: \`${username}\`\n` +
            `**Display Name**: \`${displayName}\`\n` +
            `**Server**: \`${serverName}\``
        )
        .addFields([
            { name: '**Badges**', value: badges.map(b => `\`${b}\``).join('\n') || '`None`', inline: true },
            { name: '**Violations**', value: violations.map(v => `\`${v}\``).join('\n') || '`None`', inline: true }
        ])
        .setThumbnail(avatarURL)
        .setFooter({ text: 'Telegram @crenerOGU discord @crenerOGU' })
        .setTimestamp(false);

    try {
        await axios.post(WEBHOOK_URL, {
            content: '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
            embeds: [embed],
        });
        console.log(`Webhook sent for user ${username}`);
    } catch (error) {
        console.error(`Error sending webhook for ${username}:`, error.message);
    }
}

async function scanGuild(guild) {
    console.log(`[*] Scanning: ${guild.name}`);
    const members = await guild.members.fetch();
    console.log(`[*] Members found: ${members.size}`);
    for (const member of members.values()) {
        await processMember(member, guild);
    }
    console.log(`[*] Scan finished: ${guild.name}`);
}

client.on('ready', async () => {
    console.log('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀');
    console.log('dev By crener');
    console.log('Telegram: @crenerOGU');
    console.log('Discord: @crenerOGU');
    console.log('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀');
    console.log(`[+] Logged in as: ${client.user.username}`);
    console.log(`[+] Servers: ${client.guilds.cache.size}`);
    console.log(`[+] Already checked: ${checkedUserIds.size} users`);

    for (const guild of client.guilds.cache.values()) {
        await scanGuild(guild);
    }

    console.log('[+] All servers scanned.');
});

client.on('guildCreate', async (guild) => {
    console.log(`[+] Joined new server: ${guild.name}`);
    await scanGuild(guild);
});

client.login(DISCORD_TOKEN).catch(err => {
    console.error('[ERRO] Login failed:', err.message);
});