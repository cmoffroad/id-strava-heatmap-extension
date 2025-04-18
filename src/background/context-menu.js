import extension from './extension.js';

const CONTEXT_MENU_ITEMS = [
  {
    id: 'forumSupport',
    title: 'Forum Support',
    action: () => browser.tabs.create({ url: extension.forumSupportUrl }),
  },
  {
    id: 'submitIssue',
    title: 'Submit Issue',
    action: () => browser.tabs.create({ url: extension.issuesTrackerUrl }),
  },
  {
    id: 'extensionPage',
    title: 'Extension Page',
    action: () => browser.tabs.create({ url: extension.installationUrl }),
  },
];

export function createContextMenu() {
  try {
    // Create submenus dynamically
    CONTEXT_MENU_ITEMS.forEach(({ id, title }) => {
      browser.contextMenus.create({
        id,
        title,
        type: title ? 'normal' : 'separator',
        contexts: ['action'],
        documentUrlPatterns: [
          'https://www.openstreetmap.org/edit*',
          'https://www.openstreetmap.org/id*',
        ],
      });
    });
  } catch (error) {
    console.error('Error creating context menu:', error);
  }
}

export function onContextMenuClicked(info) {
  const clickedItem = CONTEXT_MENU_ITEMS.find(({ id }) => id === info.menuItemId);

  if (clickedItem?.action) {
    clickedItem.action();
  } else {
    console.warn(`Unknown or invalid context menu item clicked: ${info.menuItemId}`);
  }
}
