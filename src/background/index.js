import '../../lib/browser-polyfill.min.js';

import { createContextMenu, onContextMenuClicked } from './context-menu.js';
import { requestCredentials, resetCredentials } from './credentials.js';
import { showInstalledNotification } from './installs.js';
import { checkForUpdates } from './updates.js';

async function redirectComplete(tabId, sender) {
  try {
    const tab = await browser.tabs.get(tabId);
    await browser.tabs.update(tabId, { active: true });
    if (sender?.tab?.id && sender.tab.id !== tabId) {
      await browser.tabs.remove(sender.tab.id);
    }
    console.debug(
      `[StravaHeatmapExt] Redirect complete, login returned to tab ${tabId}.`
    );
  } catch (err) {
    console.warn(
      `[StravaHeatmapExt] Original tab ${tabId} no longer exists or cannot be activated.`,
      err
    );
  }
}

async function onMessage(message, sender) {
  const MESSAGE_HANDLERS = {
    requestCredentials,
    resetCredentials,
    checkForUpdates,
    redirectComplete,
  };

  if (MESSAGE_HANDLERS[message.type]) {
    return MESSAGE_HANDLERS[message.type](message.data, sender);
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

async function onActionClicked(tab) {
  const { credentials } = await browser.storage.local.get('credentials');
  if (credentials) {
    // do nothing for now, later will open settings popup
  } else {
    browser.tabs.create({
      url: `https://www.strava.com/dashboard?redirect=${encodeURIComponent(
        `/maps/global-heatmap?tabId=${tab.id}`
      )}`,
    });
  }
}

async function main() {
  browser.action.onClicked.addListener(onActionClicked);
  browser.contextMenus.onClicked.addListener(onContextMenuClicked);
  browser.runtime.onMessage.addListener(onMessage);
  browser.runtime.onInstalled.addListener(onInstalled);
  browser.runtime.onStartup.addListener(onStartup);
}

main();
