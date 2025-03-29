import { browser, versionNumber, installationUrl } from './extension.js';
import { fetchWithTimeout } from './utils.js';

const UPDATES_URL =
  'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/updates.json';

// Fetch updates.json and validate
async function fetchUpdatesJson(url = UPDATES_URL, timeout = 5000) {
  try {
    const response = await fetchWithTimeout(url, timeout);
    const updates = await response.json();

    if (!updates || !Array.isArray(updates.versions) || !updates.latest_version) {
      throw new Error('Invalid updates.json format');
    }

    return updates;
  } catch (error) {
    console.error('Error fetching updates.json:', error);
    return null;
  }
}

// Determine if an update is needed
function getUpdateInfo(updates) {
  if (!updates) return null;

  const latestVersionNumber = updates.latest_version?.[browser];
  if (!latestVersionNumber) {
    console.warn(`No latest version found for browser: ${browser}`);
    return null;
  }

  const latestVersion = updates.versions.find((v) => v.number === latestVersionNumber);
  const currentVersion = updates.versions.find((v) => v.number === versionNumber);

  if (!currentVersion) {
    console.log(
      `Development mode detected: ${versionNumber} is not listed in updates.json.`
    );
    return null; // Skip updates in development mode
  }

  if (latestVersion?.number === currentVersion.number) {
    console.log(`Already up-to-date (v${currentVersion.number}). No update needed.`);
    return null;
  }

  console.log(`Update available: ${currentVersion.number} → ${latestVersion.number}`);

  return {
    ...latestVersion,
    url: installationUrl,
  };
}

// Main function to check for updates
export async function checkForUpdates() {
  const updates = await fetchUpdatesJson();
  return getUpdateInfo(updates);
}
