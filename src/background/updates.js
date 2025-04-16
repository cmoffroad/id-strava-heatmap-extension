import extension from './extension.js';
import { fetchWithTimeout } from './utils.js';

// Helper function to compare semantic version numbers
function isNewerVersion(latest, current) {
  const latestParts = latest.split('.').map(Number);
  const currentParts = current.split('.').map(Number);

  for (let i = 0; i < latestParts.length; i++) {
    if ((latestParts[i] || 0) > (currentParts[i] || 0)) return true;
    if ((latestParts[i] || 0) < (currentParts[i] || 0)) return false;
  }

  return false;
}

// Fetch updates.json and validate
async function fetchUpdatesJson(url, timeout = 5000) {
  try {
    const response = await fetchWithTimeout(url, timeout);
    const updates = await response.json();

    if (!updates || !Array.isArray(updates.versions) || !updates.latest_version) {
      throw new Error('[StravaHeatmapExt] Invalid updates.json format');
    }

    return updates;
  } catch (error) {
    console.error('[StravaHeatmapExt] Error fetching updates.json:', error);
    return null;
  }
}

// Determine if an update is needed
function getUpdateInfo(updates) {
  if (!updates) return null;

  const latestVersionNumber = updates.latest_version?.[extension.browserName];
  if (!latestVersionNumber) {
    console.warn(
      `[StravaHeatmapExt] No latest version found for browser: ${extension.browserName}`
    );
    return null;
  }

  const latestVersion = updates.versions.find((v) => v.number === latestVersionNumber);
  const currentVersion = updates.versions.find(
    (v) => v.number === extension.versionNumber
  );

  if (!currentVersion) {
    console.log(
      `[StravaHeatmapExt] Development mode detected: ${extension.versionNumber} is not listed in updates.json.`
    );
    return null; // Skip updates in development mode
  }

  // Check if the latest version is actually newer
  if (!isNewerVersion(latestVersion.number, currentVersion.number)) {
    console.log(
      `[StravaHeatmapExt] No update needed (current: v${currentVersion.number}, latest: v${latestVersion.number}).`
    );
    return null;
  }

  console.log(
    `[StravaHeatmapExt] Update available: ${currentVersion.number} → ${latestVersion.number}`
  );

  return {
    ...latestVersion,
    url: extension.installationUrl,
  };
}

// Main function to check for updates
export async function checkForUpdates() {
  const updates = await fetchUpdatesJson(extension.checkUpdatesUrl);
  return getUpdateInfo(updates);
}
