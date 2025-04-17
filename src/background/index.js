import '../../lib/browser-polyfill.min.js';

import { createContextMenu, onContextMenuClicked } from './context-menu.js';
import {
  requestCredentials,
  resetCredentials,
  toggleCredentials,
} from './credentials.js';
import { showInstalledNotification } from './installs.js';
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

async function onStartup() {
  await requestCredentials();
}

async function onInstalled({ reason }) {
  createContextMenu();
  showInstalledNotification(reason);
  onStartup();
}

async function main() {
  browser.runtime.onMessage.addListener(onMessage);
  browser.runtime.onInstalled.addListener(onInstalled);
  browser.runtime.onStartup.addListener(onStartup);
  browser.contextMenus.onClicked.addListener(onContextMenuClicked);
  browser.action.onClicked.addListener(toggleCredentials);
}

main();
