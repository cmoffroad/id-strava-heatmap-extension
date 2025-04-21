import '../../lib/browser-polyfill.min.js';

import { createContextMenu, onContextMenuClicked } from './context-menu.js';
import {
  expireCredentials,
  requestCredentials,
  resetCredentials,
} from './credentials.js';
import { showInstalledNotification } from './installs.js';
import { watchTileErrors } from './tiles.js';
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

async function openLogin(tab) {
  await browser.tabs.create({
    url: `https://www.strava.com/dashboard?redirect=${encodeURIComponent(
      `/maps/global-heatmap?tabId=${tab.id}`
    )}`,
  });
}

async function onMessage(message, sender) {
  const MESSAGE_HANDLERS = {
    requestCredentials,
    resetCredentials,
    expireCredentials,
    checkForUpdates,
    redirectComplete,
    openLogin,
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
    openLogin(tab);
  }
}

async function onTileError(url, reason) {
  console.warn('[StravaHeatmapExt] Detected tile error:', reason, url);
  if (['403', 'net::ERR_BLOCKED_BY_ORB'].includes(reason)) {
    console.log('[StravaHeatmapExt] Detecting expired credentials, requesting new ones.');
    await requestCredentials();
    return true;
  }
  return false;
}

async function main() {
  browser.action.onClicked.addListener(onActionClicked);
  browser.contextMenus.onClicked.addListener(onContextMenuClicked);
  browser.runtime.onMessage.addListener(onMessage);
  browser.runtime.onInstalled.addListener(onInstalled);
  browser.runtime.onStartup.addListener(onStartup);

  watchTileErrors(onTileError);
}

main();
