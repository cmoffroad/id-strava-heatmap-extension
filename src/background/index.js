import '../../lib/browser-polyfill.min.js';

import { createContextMenu, onContextMenuClicked } from './context-menu.js';
import { requestCredentials, resetCredentials } from './credentials.js';
import { showInstalledNotification } from './installs.js';
import { updateHeatmapRules } from './rules.js';
import { checkForUpdates } from './updates.js';

const MESSAGE_HANDLERS = {
  requestCredentials,
  resetCredentials,
  checkForUpdates,
};

async function onMessage(message) {
  if (MESSAGE_HANDLERS[message]) {
    return MESSAGE_HANDLERS[message]();
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

  await requestCredentials();
}

main();
