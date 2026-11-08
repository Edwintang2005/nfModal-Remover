// `api`, normaliseHost, siteCovering, getSites, setSites come from sites.js

const $ = (id) => document.getElementById(id);
let sites = [];
let tab = null;
let tabHost = null;

function showError(msg) {
  $('error').textContent = msg || '';
  $('error').hidden = !msg;
}

function render() {
  const list = $('site-list');
  list.replaceChildren(
    ...sites.map((site) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = site;
      const remove = document.createElement('button');
      remove.textContent = '×';
      remove.title = `Stop running on ${site}`;
      remove.addEventListener('click', () => removeSite(site));
      li.append(name, remove);
      return li;
    })
  );
  $('empty').hidden = sites.length > 0;

  if (tabHost) {
    const covering = siteCovering(tabHost, sites);
    $('current').hidden = false;
    $('current-host').textContent = tabHost;
    $('current-toggle').checked = !!covering;
    $('current-note').textContent =
      covering && covering !== tabHost ? `Covered by ${covering}` : '';
  }
}

// Run on the open page straight away, instead of waiting for a reload.
async function injectIntoCurrentTab() {
  if (!tab?.id) return;
  try {
    await api.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['content.js'],
    });
  } catch (e) {
    console.warn('Could not inject into current tab:', e);
  }
}

async function addSite(input) {
  showError('');
  const host = normaliseHost(input);
  if (!host) return showError('That doesn’t look like a website address.');
  try {
    sites = await setSites([...sites, host]);
  } catch (e) {
    return showError(`Couldn’t save: ${e.message || e}`);
  }
  render();
  if (tabHost && siteCovering(tabHost, [host])) await injectIntoCurrentTab();
}

async function removeSite(site) {
  showError('');
  try {
    sites = await setSites(sites.filter((s) => s !== site));
  } catch (e) {
    return showError(`Couldn’t save: ${e.message || e}`);
  }
  render();
}

$('current-toggle').addEventListener('change', async (e) => {
  if (e.target.checked) {
    await addSite(tabHost);
  } else {
    const covering = siteCovering(tabHost, sites);
    if (covering) await removeSite(covering);
    $('current-note').textContent = 'Reload the page to bring the modal back.';
  }
});

$('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await addSite($('add-input').value);
  if ($('error').hidden) $('add-input').value = '';
});

(async () => {
  sites = await getSites();
  try {
    [tab] = await api.tabs.query({ active: true, currentWindow: true });
    if (tab?.url && /^https?:/.test(tab.url)) tabHost = normaliseHost(tab.url);
  } catch {}
  render();
})();
