# Discord Username Badge Scraper

Selfbot-based Discord username and badge scanner that iterates through the guilds available to the authenticated account, checks members for rare badges or short usernames, stores already processed user IDs, and sends structured Discord webhook alerts when a matching profile is detected.

> This project preserves the original selfbot implementation. Review Discord's current platform rules and account-use policies before running it.

## Features

- Scans members across every guild visible to the authenticated account.
- Detects accounts with selected Discord profile badges.
- Detects rare two-character and three-character usernames.
- Adds Nitro boost level estimation in the newer script versions.
- Sends Discord webhook notifications with user ID, username, display name, server name, badges, violations, avatar, and timestamp metadata.
- Persists processed user IDs in `checked-users.txt` to avoid duplicate alerts across runs.
- Automatically scans newly joined guilds through the `guildCreate` event.
- Includes three preserved script versions for compatibility and testing.

## Project Structure

```text
.
├── main.js/
│   ├── version 1.js
│   ├── version2.js
│   └── version3.js
├── .env.example
├── .gitignore
├── COMMANDS.md
├── LICENSE
├── PROJECT_INFO.md
├── README.md
├── package.json
└── step by step guide.txt
```

## Requirements

- Node.js 18 or newer.
- npm.
- A Discord user token.
- A Discord webhook URL for alert delivery.

## Setup

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=your_discord_user_token_here
WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_id/your_webhook_token
```

Run the latest preserved version:

```bash
npm start
```

Run a specific version:

```bash
npm run start:v1
npm run start:v2
npm run start:v3
```

## Version Notes

`version 1.js` contains the simpler badge and username-length scanner.

`version2.js` expands the badge list, adds violation flag handling, and estimates Nitro boost levels.

`version3.js` keeps the expanded scanning logic and changes the `.env` and `checked-users.txt` lookup path to use the executable directory, which is useful when packaging the script as a binary.

## Runtime Files

The script creates or updates `checked-users.txt` while running. This file is intentionally ignored by Git because it may contain Discord user IDs and local scan history.

## Security Notes

Never commit `.env`, real Discord tokens, webhook URLs, generated logs, or `checked-users.txt` to a public repository. If a real token or webhook is ever committed, revoke or rotate it immediately.
