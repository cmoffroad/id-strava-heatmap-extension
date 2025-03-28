const EXTENSION_VERSION = browser.runtime.getManifest().version;
const UPDATE_CHECK_URL =
  'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/manifest.json';

export async function checkForUpdate() {
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
