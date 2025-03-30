import extension from './extension.js';

const FEEDBACK = `For questions or issue reports, right-click and hover over "${extension.name}" to access helpful links.`;

const TITLES = {
  install: 'Welcome to the extension!',
  update: 'Extension Updated!',
};

// Display a browser notification with a unique ID based on the reason and timestamp
function showBasicNotification(reason, title, message, priority = 0) {
  return browser.notifications.create(`${reason}-${Date.now()}`, {
    type: 'basic',
    iconUrl: browser.runtime.getURL('icons/icon-48.png'),
    title,
    message,
    priority,
  });
}

export function showInstalledNotification(reason) {
  if (TITLES[reason]) {
    showBasicNotification(reason, TITLES[reason], FEEDBACK);
  }
}
