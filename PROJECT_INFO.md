# Project Information

## Suggested GitHub Repository Title

Discord Username Badge Scraper

## Suggested GitHub About Description

Selfbot-based Discord username and badge scanner that detects rare usernames, selected account badges, and Nitro boost indicators across accessible guilds, then sends structured webhook alerts with deduplication and persistent scan history.

## Longer Portfolio Description

Discord Username Badge Scraper is a Node.js automation project designed to scan Discord guild members available to an authenticated account and identify profiles that match predefined rarity criteria. The scanner checks for short usernames, selected legacy and community badges, Nitro boost indicators, and violation flags, then sends formatted webhook alerts containing profile and server metadata. It also maintains a local processed-user cache to prevent duplicate notifications across repeated scans.

The repository includes multiple preserved script versions, environment-based configuration, webhook delivery, duplicate tracking, and a GitHub-safe project structure with secrets excluded from version control.

## Technical Stack

- Node.js
- CommonJS
- discord.js-selfbot-v13
- Axios
- dotenv
- Discord webhooks
- Local file-based deduplication

## Repository Topics

```text
discord selfbot username-scanner badge-scanner discord-webhook nodejs automation dotenv axios
```
