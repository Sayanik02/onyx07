/**
 * Onyx Dashboard — Client-side config
 * Update ONYX_API_BASE to your server's IP and port.
 * Update ONYX_CLIENT_ID to your Discord bot's application ID.
 */
window.ONYX_API_BASE  = 'http://YOUR_VPS_IP:8080';   // e.g. http://123.45.67.89:8080
window.ONYX_CLIENT_ID = 'YOUR_BOT_CLIENT_ID';         // Discord application ID (for invite links)

// ── How to find these values ──────────────────────────────────────────────
// ONYX_API_BASE:  Your VPS/Pterodactyl IP + the DASHBOARD_PORT from .env
//                 Example: 'http://65.21.44.123:8080'
//
// ONYX_CLIENT_ID: Go to discord.com/developers/applications → your bot → Application ID
//                 This is used for the "Add Bot" invite link on the guild selector.
