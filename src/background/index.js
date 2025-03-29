import '../../lib/browser-polyfill.min.js';

const manifest = browser.runtime.getManifest();

const EXTENSION_UPDATE_URL = manifest.update_url ?? manifest.homepage_url;
const EXTENSION_ISSUES_URL =
  'https://github.com/cmoffroad/id-strava-heatmap-extension/issues/';
const EXTENSION_FORUM_URL =
  'https://community.openstreetmap.org/t/new-strava-heatmap-extension-for-id/100544';

const FEEDBACK =
  'If you have any questions, or need to report an issue, simply right-click and hover iD Strava Heatmap to find useful links.';

const STRAVA_URL = 'https://www.strava.com/heatmap';
const COOKIE_NAMES = [
  '_strava_idcf',
  'CloudFront-Key-Pair-Id',
  'CloudFront-Policy',
  'CloudFront-Signature',
];
const RULE_ID = 2;

const FALLBACK_SVG = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <rect width="100%" height="100%" fill="transparent"/>
    <text x="50%" y="50%" font-family="Helvetica Neue" font-size="18" fill="#fc5200" text-anchor="middle" alignment-baseline="middle">
      <tspan x="50%" dy="0em">Log in at <tspan text-decoration="underline">strava.com/login</tspan></tspan>
      <tspan x="50%" dy="1.4em">and navigate to <tspan font-weight="bold">Maps</tspan></tspan>
      <tspan x="50%" dy="1.4em">to visualize the</tspan>
      <tspan x="50%" dy="1.4em">Strava Heatmap overlay</tspan>
    </text>
  </svg>
`)}`;

const RULE_REGEX_FILTER =
  '^https://([^/]+)\\.strava\\.com/(anon|identified)/globalheat/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)\\.png(\\?(v=[^&]+))?$';

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

export async function updateRequestRules(credentialsCookieHeader) {
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: credentialsCookieHeader
      ? [
          {
            id: RULE_ID,
            priority: 1,
            condition: {
              regexFilter: RULE_REGEX_FILTER,
              resourceTypes: ['main_frame', 'sub_frame', 'image'],
            },
            action: {
              type: 'modifyHeaders',
              requestHeaders: [
                {
                  header: 'Cookie',
                  operation: 'set',
                  value: credentialsCookieHeader,
                },
              ],
              responseHeaders: [
                {
                  header: 'Access-Control-Allow-Origin',
                  operation: 'set',
                  value: '*',
                },
              ],
            },
          },
        ]
      : [
          {
            id: RULE_ID,
            priority: 1,
            condition: {
              regexFilter: RULE_REGEX_FILTER,
              resourceTypes: ['main_frame', 'sub_frame', 'image'],
            },
            action: {
              type: 'redirect',
              redirect: {
                url: FALLBACK_SVG,
              },
            },
          },
        ],
  });
}

function getCredentialsHeader(credentials) {
  if (!credentials) return null;

  return COOKIE_NAMES.map((name) => `${name}=${credentials[name]}`).join('; ');
}

export async function requestStravaCredentials(force = false) {
  const newStravaCredentials = await fetchStravaCredentials();
  if (
    force ||
    JSON.stringify(newStravaCredentials) !== JSON.stringify(stravaCredentials)
  ) {
    const credentialsCookieHeader = getCredentialsHeader(newStravaCredentials);
    await updateRequestRules(credentialsCookieHeader);
    stravaCredentials = newStravaCredentials;
  }
  return newStravaCredentials !== null;
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

const UPDATES_URL =
  'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/updates.json';

async function checkForUpdate() {
  try {
    // Fetch the updates.json from the github repo
    const response = await fetch(UPDATES_URL);
    const updates = await response.json();

    // Detect the browser (Firefox or Chrome) based on the manifest
    const os = manifest.browser_specific_settings?.gecko ? 'firefox' : 'chrome';

    // Retrieve the latest version based on the detected browser
    const latestVersion = updates.latest_version[os];

    // Find the version details from the updates array
    const version = updates.versions.find((v) => v.version === latestVersion);

    // If the version is newer than the current version, return the update info
    if (latestVersion !== manifest.version && version) {
      return {
        ...version,
        url: manifest.update_url ?? manifest.homepage_url,
      };
    }

    // Return null if no update is needed
    return null;
  } catch (error) {
    console.error('Error checking for update:', error);
    return null;
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
  }
}

async function main() {
  browser.runtime.onMessage.addListener(onMessage);
  browser.runtime.onInstalled.addListener(onInstalled);
  browser.contextMenus.onClicked.addListener(onContextMenusClicked);

  requestStravaCredentials(true);
}

main();
