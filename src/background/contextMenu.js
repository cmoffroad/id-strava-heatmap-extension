const EXTENSION_ISSUES_URL =
  'https://github.com/cmoffroad/id-strava-heatmap-extension/issues/';
const EXTENSION_UPDATE_URL = browser.runtime.getManifest().homepage_url;
const EXTENSION_FORUM_URL =
  'https://community.openstreetmap.org/t/new-strava-heatmap-extension-for-id/100544';

export function createContextMenu() {
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
    id: 'requestStravaCredentials',
    parentId: 'mainMenu',
    title: 'Request Strava Credentials',
    contexts: ['page'],
  });
}
export function setupContextMenuListener(checkForUpdate) {
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'forumSupport') {
      browser.tabs.create({ url: EXTENSION_FORUM_URL });
    } else if (info.menuItemId === 'submitIssue') {
      browser.tabs.create({ url: EXTENSION_ISSUES_URL });
    } else if (info.menuItemId === 'extensionPage') {
      browser.tabs.create({ url: EXTENSION_UPDATE_URL });
    } else if (info.menuItemId === 'checkForUpdate') {
      checkForUpdate();
    }
  });
}
