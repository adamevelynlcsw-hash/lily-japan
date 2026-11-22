/**
 * Lily's Japan Trip: group sync for a Google Sheet.
 *
 * Paste this whole file into the Sheet's Extensions → Apps Script editor,
 * then deploy it as a web app (steps are in the README). It stores one trip
 * per trip code on a tab called "Trips". Nothing here contacts any other
 * service.
 *
 * GET  <url>?code=TRIPCODE           → the trip as JSON ({} if new)
 * POST {"code":"TRIPCODE","data":{}} → merges the changes in, returns {"ok":true}
 *
 * Merging follows the same rule as the website: for each saved place,
 * booking, checklist item, custom place and day's base city, the newest edit
 * (highest "u" timestamp) wins. So two friends can send changes without
 * erasing each other's work.
 */

var SHEET_NAME = 'Trips';
var CHUNK = 45000;   // Sheets cells hold up to 50,000 characters, so long trips are split across cells
var MIN_CODE = 8;

function doGet(e) {
  var code = cleanCode_(e && e.parameter && e.parameter.code);
  if (!code) return json_({ error: 'Trip code must be at least ' + MIN_CODE + ' characters.' });
  return json_(readTrip_(code) || {});
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'Bad request' });
  }
  var code = cleanCode_(body && body.code);
  if (!code) return json_({ ok: false, error: 'Trip code must be at least ' + MIN_CODE + ' characters.' });
  if (!body.data || typeof body.data !== 'object') return json_({ ok: false, error: 'No trip data sent' });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return json_({ ok: false, error: 'Busy, try again in a moment' });
  try {
    var merged = merge_(readTrip_(code) || {}, body.data);
    writeTrip_(code, merged);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// ---------- merging (same rules as index.html mergeIn) ----------
function newer_(a, b) { return (a && a.u || 0) > (b && b.u || 0); }

function merge_(cur, inc) {
  var out = {
    saved: cur.saved || {}, custom: cur.custom || [], bookings: cur.bookings || [],
    checklist: cur.checklist || [], base: cur.base || {},
    start: cur.start || '', startU: cur.startU || 0, days: cur.days || 14
  };
  Object.keys(inc.saved || {}).forEach(function (id) {
    if (!out.saved[id] || newer_(inc.saved[id], out.saved[id])) out.saved[id] = inc.saved[id];
  });
  ['custom', 'bookings', 'checklist'].forEach(function (k) {
    var byId = {};
    out[k].forEach(function (x) { if (x && x.id) byId[x.id] = x; });
    (inc[k] || []).forEach(function (x) {
      if (x && x.id && (!byId[x.id] || newer_(x, byId[x.id]))) byId[x.id] = x;
    });
    out[k] = Object.keys(byId).map(function (id) { return byId[id]; });
  });
  Object.keys(inc.base || {}).forEach(function (d) {
    if (!out.base[d] || newer_(inc.base[d], out.base[d])) out.base[d] = inc.base[d];
  });
  if (inc.start && (inc.startU || 0) > out.startU) {
    out.start = inc.start; out.startU = inc.startU; out.days = inc.days || out.days;
  }
  return out;
}

// ---------- storage ----------
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Trip code', 'Last update', 'Data (split across columns if long)']);
  }
  return sh;
}

function findRow_(sh, code) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var codes = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < codes.length; i++) if (String(codes[i][0]) === code) return i + 2;
  return 0;
}

function readTrip_(code) {
  var sh = sheet_(), row = findRow_(sh, code);
  if (!row) return null;
  var width = sh.getLastColumn();
  if (width < 3) return null;
  var text = sh.getRange(row, 3, 1, width - 2).getValues()[0].join('');
  try { return text ? JSON.parse(text) : null; } catch (err) { return null; }
}

function writeTrip_(code, data) {
  var sh = sheet_(), row = findRow_(sh, code) || sh.getLastRow() + 1;
  var text = JSON.stringify(data), parts = [];
  for (var i = 0; i < text.length; i += CHUNK) parts.push(text.slice(i, i + CHUNK));
  var oldWidth = Math.max(sh.getLastColumn(), 3);
  sh.getRange(row, 1, 1, oldWidth).clearContent();
  sh.getRange(row, 1, 1, 2 + parts.length).setValues([[code, new Date()].concat(parts)]);
}

// ---------- helpers ----------
function cleanCode_(c) {
  c = String(c || '').trim();
  return c.length >= MIN_CODE && c.length <= 100 ? c : '';
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
