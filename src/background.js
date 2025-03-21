import '../lib/browser-polyfill.min.js';

const EXTENSION_VERSION = browser.runtime.getManifest().version;
const EXTENSION_ISSUES_URL =
  'https://github.com/cmoffroad/id-strava-heatmap-extension/issues/';
const EXTENSION_UPDATE_URL = browser.runtime.getManifest().homepage_url;
const EXTENSION_FORUM_URL =
  'https://community.openstreetmap.org/t/new-strava-heatmap-extension-for-id/100544';
const UPDATE_CHECK_URL =
  'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/manifest.json';

const FEEDBACK =
  'If you have any questions, or need to report an issue, simply right-click and hover iD Strava Heatmap to find useful links.';

const STRAVA_URL = 'https://www.strava.com/heatmap';
const COOKIE_NAMES = [
  'CloudFront-Key-Pair-Id',
  'CloudFront-Policy',
  'CloudFront-Signature',
];
const RULE_ID = 2;

let stravaCredentials = null;

async function clearStravaCookie(name) {
  return browser.cookies.remove({ name, url: STRAVA_URL });
}

async function getStravaCookie(name) {
  try {
    const cookie = await browser.cookies.get({ url: STRAVA_URL, name });
    if (!cookie || !cookie.value) return null;

    const { expirationDate, value } = cookie;
    return expirationDate && expirationDate <= Date.now() / 1000 ? null : value;
  } catch (error) {
    console.error(`Error getting cookie "${name}":`, error);
    return null;
  }
}

async function fetchStravaCredentials() {
  const credentials = Object.fromEntries(
    await Promise.all(
      COOKIE_NAMES.map(async (name) => [name, await getStravaCookie(name)])
    )
  );

  if (Object.values(credentials).some((value) => !value)) {
    return null;
  }
  return credentials;
}

async function updateRequestRules(credentials) {
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: credentials
      ? [
          {
            id: RULE_ID,
            priority: 1,
            condition: {
              regexFilter:
                '^https://heatmap-external-(.*).strava.com/tiles/(all|ride|run|water|winter)/(.*)/(.*)/(.*)/(.*).png??(.*)',
              resourceTypes: ['main_frame', 'sub_frame', 'image'],
            },
            action: {
              type: 'redirect',
              redirect: {
                regexSubstitution: `https://heatmap-external-\\1.strava.com/tiles-auth/\\2/\\3/\\4/\\5/\\6.png?Key-Pair-Id=${credentials['CloudFront-Key-Pair-Id']}&Policy=${credentials['CloudFront-Policy']}&Signature=${credentials['CloudFront-Signature']}`,
              },
            },
          },
        ]
      : [],
  });
}

async function requestStravaCredentials() {
  stravaCredentials = await fetchStravaCredentials();
  await updateRequestRules(stravaCredentials);
}

async function clearStravaCredentials() {
  await Promise.all(COOKIE_NAMES.map(clearStravaCookie));
  await updateRequestRules(null);
  stravaCredentials = null;
}

async function showBasicNotification(reason, title, message, priority = 0) {
  // Using browser notifications API to notify the user
  browser.notifications.create(`${reason}-${Date.now()}`, {
    type: 'basic',
    iconUrl: browser.runtime.getURL('icons/icon-48.png'),
    title,
    message,
    priority,
  });
}

// Function to show update notification and handle click events.
async function showUpdateNotification(version) {
  const notificationId = await browser.notifications.create(
    `update-available-${Date.now()}`,
    {
      type: 'basic',
      iconUrl: browser.runtime.getURL('icons/icon-48.png'),
      title: 'Update Available!',
      message: `A new version (${version}) is available. Click to update now.`,
      priority: 2,
    }
  );
  // Add a click listener to open the update URL.
  browser.notifications.onClicked.addListener(function onClick(clickedNotificationId) {
    if (clickedNotificationId === notificationId) {
      browser.tabs.create({ url: EXTENSION_UPDATE_URL });
      // Remove the listener once it's used.
      browser.notifications.onClicked.removeListener(onClick);
    }
  });
}

async function checkForUpdate() {
  try {
    const response = await fetch(UPDATE_CHECK_URL);
    const manifest = await response.json();

    if (manifest.version !== EXTENSION_VERSION) {
      // Show update notification if versions don't match.
      showUpdateNotification(manifest.version);
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

function createContextMenu() {
  // Root menu
  browser.contextMenus.create({
    id: 'mainMenu',
    title: 'iD Strava Heatmap',
    contexts: ['page'],
  });

  // Forum Support link
  browser.contextMenus.create({
    id: 'forumSupport',
    parentId: 'mainMenu',
    title: 'Forum Support',
    contexts: ['page'],
  });

  // GitHub Repository link (from manifest)
  browser.contextMenus.create({
    id: 'submitIssue',
    parentId: 'mainMenu',
    title: 'Submit Issue',
    contexts: ['page'],
  });

  // Extension Page link (from manifest)
  browser.contextMenus.create({
    id: 'extensionPage',
    parentId: 'mainMenu',
    title: 'Extension Page',
    contexts: ['page'],
  });

  browser.contextMenus.create({
    id: 'checkForUpdate',
    parentId: 'mainMenu',
    title: 'Check for Updates',
    contexts: ['page'],
  });

  browser.contextMenus.create({
    id: 'clearCookies',
    parentId: 'mainMenu',
    title: 'Clear Cookies',
    contexts: ['page'],
  });
}

async function onMessage(message) {
  switch (message) {
    case 'requestStravaCredentials':
      return requestStravaCredentials();
    case 'clearStravaCredentials':
      return clearStravaCredentials();
    case 'checkForUpdate':
      return checkForUpdate();
  }
}

async function onInstalled(details) {
  // only once
  createContextMenu();

  const { reason } = details;
  if (reason === 'install') {
    showBasicNotification(reason, 'Welcome to the extension!', FEEDBACK);
  } else if (reason === 'update') {
    showBasicNotification(reason, 'Extension Updated!', FEEDBACK);
  }
}

async function onContextMenusClicked(info, tab) {
  if (info.menuItemId === 'forumSupport') {
    browser.tabs.create({ url: EXTENSION_FORUM_URL });
  } else if (info.menuItemId === 'submitIssue') {
    browser.tabs.create({ url: EXTENSION_ISSUES_URL });
  } else if (info.menuItemId === 'extensionPage') {
    browser.tabs.create({ url: EXTENSION_UPDATE_URL });
  } else if (info.menuItemId === 'checkForUpdate') {
    checkForUpdate();
  } else if (info.menuItemId === 'clearCookies') {
    clearStravaCredentials();
  }
}

async function main() {
  browser.runtime.onMessage.addListener(onMessage);
  browser.runtime.onInstalled.addListener(onInstalled);
  browser.contextMenus.onClicked.addListener(onContextMenusClicked);

  requestStravaCredentials();
}

main();
