import '../../lib/browser-polyfill.min.js';

import { createContextMenu, onContextMenuClicked } from './context-menu.js';
import {
  expireCredentials,
  requestCredentials,
  resetCredentials,
} from './credentials.js';
import { showInstalledNotification } from './installs.js';
import { resetLayerPresets } from './layers.js';
import { redirectComplete, openLogin } from './tabs.js';
import { watchTileErrors, watchTileFallback } from './tiles.js';

async function onMessage(message, sender) {
  const MESSAGE_HANDLERS = {
    requestCredentials,
    resetCredentials,
    expireCredentials,
    redirectComplete,
    openLogin,
  };

  if (MESSAGE_HANDLERS[message.type]) {
    return MESSAGE_HANDLERS[message.type](message.payload, sender);
  }

  console.warn(`Unknown message received: ${message}`);
  return null;
}

async function onStartup() {
  await resetLayerPresets();
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

async function onTileError(tabId, url, reason) {
  console.warn('[StravaHeatmapExt] Detected tile error:', tabId, url, reason);
  if (['403', 'net::ERR_BLOCKED_BY_ORB', 'NS_BINDING_ABORTED'].includes(reason)) {
    console.log('[StravaHeatmapExt] Detecting expired credentials, requesting new ones.');
    await requestCredentials();
    // TODO show toast message
    return true;
  }
  return false;
}

async function onTileFallback(tabId, url, reason) {
  console.debug('[StravaHeatmapExt] Detected tile fallback:', tabId, url, reason);
  // TODO show toast message
  return true;
}

async function main() {
  browser.action.onClicked.addListener(onActionClicked);
  browser.contextMenus.onClicked.addListener(onContextMenuClicked);
  browser.runtime.onMessage.addListener(onMessage);
  browser.runtime.onInstalled.addListener(onInstalled);
  browser.runtime.onStartup.addListener(onStartup);

  watchTileErrors(onTileError);
  watchTileFallback(onTileFallback);
}

main();
