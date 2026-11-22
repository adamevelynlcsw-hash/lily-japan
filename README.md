# Lily's Japan Trip 🌸

A searchable Tokyo · Kyoto · Osaka guide plus a trip organizer: save places, plan days, keep bookings, and copy ready-made Wanderlog prompts. It works offline once opened, and it installs to the home screen.

## Publish on GitHub Pages (about 5 minutes)
1. On GitHub, create a new repository, e.g. `lily-japan`. Public is required for free Pages.
2. Upload `index.html`, `sw.js`, `manifest.webmanifest` (and this README). Leave `Code.gs` out; it goes in Google, not here.
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
1. Create a Google Sheet called "Lily Japan Trip".
2. **Extensions → Apps Script**, delete the sample code, and paste in `Code.gs`. Save.
3. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and approve permissions.
4. Copy the URL that ends in `/exec`.
5. On the site: My Trip → Group sync → paste the URL → tap 🎲 New code → share the URL and code with the friends.
6. Each person taps **Get group changes** before planning and **Send my changes** after.

Privacy: anyone with both the URL and the code can read the trip. Store confirmation numbers, not passport or card numbers.

## Edit the guide
All places are in the `window.GUIDE` list inside `index.html`. Copy one line, change the fields, and commit. Price key: ¥ under ¥1,500 per person, ¥¥ ¥1,500–5,000, ¥¥¥ ¥5,000+.

Hours and prices change. Every card has a 📍 Map button. Check Google Maps before going.
