import extension from './extension.js';

const FEEDBACK = `Need help or want to report an issue? Right-click the extension icon in the top-right corner of your browser. Can’t see it? Click the puzzle icon and pin it for quick access.`;

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
