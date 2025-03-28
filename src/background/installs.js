const FEEDBACK =
  'If you have any questions, or need to report an issue, simply right-click and hover iD Strava Heatmap to find useful links.';

export function notifyInstallationUpdate(reason) {
  if (reason === 'install') {
    showBasicNotification(reason, 'Welcome to the extension!', FEEDBACK);
  } else if (reason === 'update') {
    showBasicNotification(reason, 'Extension Updated!', FEEDBACK);
  }
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
