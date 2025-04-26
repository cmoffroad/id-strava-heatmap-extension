import '../../lib/browser-polyfill.min.js';

import { createContextMenu, onContextMenuClicked } from './context-menu.js';
import {
  expireCredentials,
  requestCredentials,
  resetCredentials,
} from './credentials.js';
import { showInstalledNotification } from './installs.js';
import { initLayerPresets } from './layers.js';
import { redirectComplete, openLogin } from './tabs.js';
import { watchTileErrors } from './tiles.js';

async function onMessage(message, sender) {
  const MESSAGE_HANDLERS = {
    requestCredentials,
    resetCredentials,
    expireCredentials,
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
  await initLayerPresets();
  await createContextMenu();
  await requestCredentials();
}

async function onInstalled({ reason }) {
  await showInstalledNotification(reason);
  await onStartup();
}

async function onActionClicked(tab) {
  const { credentials } = await browser.storage.local.get('credentials');
  if (credentials) {
    // do nothing for now, later will open settings popup
  } else {
    await openLogin(tab);
  }
}

async function onTileError(url, reason) {
  console.warn('[StravaHeatmapExt] Detected tile error:', reason, url);
  if (['403', 'net::ERR_BLOCKED_BY_ORB', 'NS_BINDING_ABORTED'].includes(reason)) {
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
