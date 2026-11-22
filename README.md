# Lily's Japan Trip 🌸

A searchable Tokyo · Kyoto · Osaka guide plus a trip organizer: save places, plan days, keep bookings, and copy ready-made Wanderlog prompts. It works offline once opened, and it installs to the home screen.

## Publish on GitHub Pages (about 5 minutes)
1. On GitHub, create a new repository, e.g. `lily-japan`. Public is required for free Pages.
2. Upload `index.html`, `sw.js`, `manifest.webmanifest` and this README. `Code.gs` can sit in the repo too (it has no passwords), but it only does anything once it's pasted into Google Apps Script.
3. Go to **Settings → Pages → Source: Deploy from a branch → main / root → Save**.
4. After about a minute the site is live at `https://YOURNAME.github.io/lily-japan/`.
5. Lily opens it on her phone and uses **Share → Add to Home Screen**.

Note: a public repo means the *guide* is public, but her saves are not. Saves stay on her phone (and in the optional private Sheet).

## Where Lily's information is stored
| Layer | What it does | Setup |
|---|---|---|
| **Her phone (automatic)** | Saves, notes, day plan, bookings and checklist save instantly in the browser | None |
| **Backup file** | My Trip → Download backup. Save it to Google Drive or iCloud weekly; Restore backup brings it back on any device | None |
| **Share link** | My Trip → Copy share link sends her saved list to a friend, who taps it to add those places | None |
| **Group sync (optional)** | All four friends share one trip through a Google Sheet they own | 5 min, below |

### Group sync setup (Google Sheet)
The script is [`Code.gs`](Code.gs) in this repo. One person (the trip owner) does this once, signed in to their own Google account:

1. Create a Google Sheet called "Lily Japan Trip".
2. In the Sheet, open **Extensions → Apps Script**. Delete the sample code, paste in all of `Code.gs`, and click **Save** (the disk icon).
3. Click **Deploy → New deployment**. Click the gear next to "Select type" and pick **Web app**.
4. Set **Execute as: Me** and **Who has access: Anyone**, then click **Deploy**.
5. Google asks for permission. Click **Authorize access**, pick your account, then **Advanced → Go to (project name) (unsafe) → Allow**. The "unsafe" warning appears because you wrote the script yourself; it only reads and writes this one Sheet.
6. Copy the **Web app URL** (it ends in `/exec`).
7. On the site: **My Trip → Group sync**, paste the URL, type your name, and tap 🎲 **New code**.
8. Send the URL and the code to the friends privately (a group text is fine). Each friend pastes both into their own copy of the site.
9. Each person taps **Get group changes** before planning and **Send my changes** after. If two people edit the same item, the newest edit wins.

If you change `Code.gs` later, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy** so the URL stays the same.

Privacy: anyone with both the URL and the code can read the trip. Store confirmation numbers, not passport or card numbers. Sync only works on the published GitHub Pages site, not from a file on your computer.

## Wanderlog
The 🧭 Wanderlog tab writes a short prompt for each day that you paste into Wanderlog's AI assistant ("Add these places to Day 3, in this order…"). Each place includes its Japanese name and neighborhood so the right pin comes up. Change the order of a day's stops with the ↑ ↓ buttons on the 🗓️ Plan tab. There's also a "Copy list with map links" button per day if the AI can't find something and you want to add it by hand.

## Keeping saves safe
Saves live in the phone's browser. The site reminds Lily to download a backup once she has a few saves, and again when she's made changes and it's been more than a week. On iPhone, adding the site to the Home Screen also helps, because Safari can clear data for websites that haven't been opened in a while.

## Edit the guide
All places are in the `window.GUIDE` list inside `index.html`. Copy one line, change the fields, and commit. `ja` (the Japanese name) is optional but helps Wanderlog and Google Maps find the right place. When you change `index.html`, bump the version in `sw.js` (`lily-japan-v2` → `v3`) so phones pick up the update. Price key: ¥ under ¥1,500 per person, ¥¥ ¥1,500–5,000, ¥¥¥ ¥5,000+.

Hours and prices change. Every card has a 📍 Map button. Check Google Maps before going.
