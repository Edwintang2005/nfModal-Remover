// Shared by background.js (via importScripts) and popup.html.
// Keeps the list of chosen sites in storage and registers content.js
// for exactly those sites, so the script never runs anywhere else.

const api = globalThis.browser ?? globalThis.chrome;
const SCRIPT_ID = 'nf-modal-remover';

// "https://www.Example.com/page" -> "example.com"
function normaliseHost(input) {
  const raw = String(input || '').trim();
  if (!raw) return null;
  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
    const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
    return /^[a-z0-9.-]+\.[a-z0-9-]+$/.test(host) || host === 'localhost' ? host : null;
  } catch {
    return null;
  }
}

// The listed site that covers this host (itself or a parent domain), if any.
function siteCovering(host, sites) {
  return sites.find((s) => host === s || host.endsWith(`.${s}`)) ?? null;
}

function patternsFor(sites) {
  return sites.flatMap((s) => [`*://${s}/*`, `*://*.${s}/*`]);
}

async function getSites() {
  const { sites } = await api.storage.local.get('sites');
  return Array.isArray(sites) ? sites : [];
}

async function setSites(sites) {
  const clean = [...new Set(sites)].sort();
  await api.storage.local.set({ sites: clean });
  await syncContentScripts(clean);
  return clean;
}

// Make the registered content script match the stored site list.
async function syncContentScripts(sites) {
  sites ??= await getSites();
  const wanted = patternsFor(sites);

  let current = [];
  try {
    current = (await api.scripting.getRegisteredContentScripts()).filter((s) => s.id === SCRIPT_ID);
  } catch {}

  const same =
    current.length === 1 &&
    JSON.stringify([...(current[0].matches || [])].sort()) === JSON.stringify([...wanted].sort());
  if (same) return;

  if (current.length) {
    await api.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] }).catch(() => {});
  }
  if (!wanted.length) return;

  await api.scripting.registerContentScripts([
    {
      id: SCRIPT_ID,
      js: ['content.js'],
      matches: wanted,
      runAt: 'document_start',
      allFrames: true,
    },
  ]);
}
