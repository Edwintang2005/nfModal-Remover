importScripts('sites.js');

// Re-apply the site list whenever Safari loads the extension,
// in case the dynamic registration didn't survive a restart.
api.runtime.onInstalled.addListener(() => syncContentScripts().catch(console.error));
api.runtime.onStartup.addListener(() => syncContentScripts().catch(console.error));
