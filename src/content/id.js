import { name as extensionName } from './extension.js';

let previousHash = window.location.hash;

// Function to check for software updates
async function checkForUpdates() {
  try {
    const updateInfo = await browser.runtime.sendMessage('checkForUpdates');
    return updateInfo;
  } catch (error) {
    console.error('Error checking for updates:', error);
    return null;
  }
}

// Function to format the update message
function formatUpdateMessage(updateInfo) {
  const { number, changes } = updateInfo;
  return `
    A new version of the ${extensionName} extension (${number}) is available.

    Please update to access the latest features and improvements:
    ${changes.map((change) => `- ${change}`).join('\n')}

    Click OK to proceed to the update page.
  `;
}

// Function to handle the user confirmation and redirect if necessary
function handleUpdateConfirmation(message, url) {
  const userConfirmed = confirm(message);

  if (userConfirmed) {
    window.location.href = url;
  }
}

// Function to request Strava credentials
async function requestCredentials() {
  try {
    await browser.runtime.sendMessage('requestCredentials');
  } catch (error) {
    console.error('Error requesting credentials:', error);
  }
}

async function checkOverlayParam() {
  // Get the current URL hash
  const hash = window.location.hash;

  // Check if the hash contains a comma-separated value starting with "StravaHeatmap"
  const overlayParam = hash.split('&').find((param) => param.startsWith('StravaHeatmap'));

  // Check if credentials are available
  const hasCredentials = await requestCredentials();

  // If "StravaHeatmap" is found in the hash and credentials are available, show the alert
  if (overlayParam && hasCredentials) {
    alert('Strava Heatmap overlay is now active with your credentials!');
  }
}

function containsStravaHeatmapOverlay(hash) {
  const overlayParam = new URLSearchParams(hash.slice(1)).get('overlays');
  return (
    overlayParam &&
    overlayParam.split(',').some((overlay) => overlay.startsWith('StravaHeatmap'))
  );
}

async function onHashChange() {
  const currentHash = window.location.hash;

  // Check if the previous hash included any overlays starting with "StravaHeatmap"
  const previousContainsStrava = containsStravaHeatmapOverlay(previousHash);

  // If previous hash doesn't contain "StravaHeatmap" and current hash does
  if (!previousContainsStrava && containsStravaHeatmapOverlay(currentHash)) {
    const hasCredentials = await requestCredentials();

    // If the user doesn't have credentials, show a confirm dialog
    if (!hasCredentials) {
      const userConfirmed = confirm(
        'You need to log in at strava.com/login and navigate to Maps to visualize the Strava Heatmap inside iD. Click OK to proceed to the Strava login page.'
      );

      // If the user confirms, redirect to the Strava login page with the redirect parameter
      if (userConfirmed) {
        window.location.href =
          'https://www.strava.com/login?redirect=https%3A%2F%2Fwww.strava.com%2Fmaps';
      }
    }
  }

  // Update previousHash after handling the change
  previousHash = currentHash;
}

// Main function to orchestrate everything
async function main() {
  const updateInfo = await checkForUpdates();
  if (updateInfo) {
    const message = formatUpdateMessage(updateInfo);
    handleUpdateConfirmation(message, updateInfo.url);
  }

  // Listen for hash changes
  window.onhashchange = onHashChange;

  // Initial check when the page loads
  onHashChange();
}

main();
