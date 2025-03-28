import '../../lib/browser-polyfill.min.js';
import { createContextMenu, setupContextMenuListener } from './contextMenu.js';
import {
  requestStravaCredentials,
  clearStravaCredentials,
  isUserAuthenticated,
} from './credentials.js';
import { notifyInstallationUpdate } from './installs.js';
import { checkForUpdate } from './updates.js';

async function setupInstalledListener() {
  browser.runtime.onInstalled.addListener((details) => {
    // important: only once
    createContextMenu();

    notifyInstallationUpdate(details.reason);
  });
}

async function setupMessageListener() {
  browser.runtime.onMessage.addListener((message) => {
    console.log(message);
    switch (message) {
      case 'requestStravaCredentials':
        return requestStravaCredentials();
      case 'clearStravaCredentials':
        return clearStravaCredentials();
      case 'isUserAuthenticated':
        return isUserAuthenticated();
      case 'checkForUpdate':
        return checkForUpdate();
    }
  });
}

async function main() {
  setupInstalledListener();
  setupContextMenuListener(checkForUpdate);
  setupMessageListener();

  requestStravaCredentials(true);
}

main();
