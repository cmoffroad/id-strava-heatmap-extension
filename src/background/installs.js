const TITLES = {
  install: 'Welcome to the extension!',
  update: 'Extension Updated!',
};

const FEEDBACK =
  'Need help or want to report an issue? Right-click the extension icon in the top-right corner. Can’t see it? Click the puzzle icon and pin it.';

export async function showInstalledNotification(reason) {
  // Return early if no title exists for the given reason
  const title = TITLES[reason];
  if (!title) return;

  const notificationId = `${reason}-${Date.now()}`;
  await browser.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: browser.runtime.getURL('icons/icon-48.png'),
    title,
    message: FEEDBACK,
    priority: 0,
  });
}
