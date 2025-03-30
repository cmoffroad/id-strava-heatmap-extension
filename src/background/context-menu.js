import extension from './extension.js';

const CONTEXT_MENU_ITEMS = [
  {
    id: 'forumSupport',
    title: 'Forum Support',
    url: extension.forumSupportUrl,
  },
  {
    id: 'submitIssue',
    title: 'Submit Issue',
    url: extension.issuesTrackerUrl,
  },
  {
    id: 'extensionPage',
    title: 'Extension Page',
    url: extension.installationUrl,
  },
];

export function createContextMenu() {
  const mainMenu = {
    id: 'mainMenu',
    title: extension.name,
    contexts: ['page'],
  };

  try {
    // Create root menu
    browser.contextMenus.create(mainMenu);

    // Create submenus dynamically
    CONTEXT_MENU_ITEMS.forEach(({ id, title }) => {
      browser.contextMenus.create({
        id,
        parentId: mainMenu.id,
        title,
        contexts: mainMenu.contexts,
      });
    });
  } catch (error) {
    console.error('Error creating context menu:', error);
  }
}

export function onContextMenuClicked(info) {
  const clickedItem = CONTEXT_MENU_ITEMS.find(({ id }) => id === info.menuItemId);

  if (clickedItem?.url) {
    browser.tabs.create({ url: clickedItem.url });
  } else {
    console.warn(`Unknown or invalid context menu item clicked: ${info.menuItemId}`);
  }
}
