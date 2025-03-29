import '../../lib/browser-polyfill.min.js';

import { createContextMenu, onContextMenuClicked } from './context-menu.js';
import { requestCredentials, resetCredentials } from './credentials.js';
import { showInstalledNotification } from './installs.js';
import { updateHeatmapRules, updateImageryRules } from './rules.js';
import { checkForUpdates } from './updates.js';

async function onMessage(message) {
  const handlers = {
    requestCredentials,
    resetCredentials,
    checkForUpdates,
  };

  if (handlers[message]) {
    return handlers[message]();
  }

  console.warn(`Unknown message received: ${message}`);
  return null;
}

async function onInstalled({ reason }) {
  createContextMenu();
  showInstalledNotification(reason);
}

async function main() {
  browser.runtime.onMessage.addListener(onMessage);
  browser.runtime.onInstalled.addListener(onInstalled);
  browser.contextMenus.onClicked.addListener(onContextMenuClicked);

  await updateImageryRules();
  await requestCredentials();
}

main();
