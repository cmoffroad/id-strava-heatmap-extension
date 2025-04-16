const manifest = browser.runtime.getManifest();

console.log('[StravaHeatmapExt] Loaded manifest', manifest);

// Detect browser type
const browserName =
  manifest.browser_specific_settings?.gecko !== undefined ? 'firefox' : 'chrome';

const EXTENSION_PAGE = {
  chrome:
    'https://chromewebstore.google.com/detail/id-strava-heatmap/eglbcifjafncknmpmnelckombmgddlco',
  firefox: 'https://addons.mozilla.org/en-US/firefox/addon/id-strava-heatmap/',
};

export default {
  // Extension name fro mthe manifest
  name: manifest.name,

  // Current extension version from the manifest
  versionNumber: manifest.version,

  // add dev environment
  isDevMode: !manifest.update_url,

  // browser name
  browserName,

  // Determine the installation/update URL
  installationUrl: EXTENSION_PAGE[browserName],

  checkUpdatesUrl:
    'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/updates.json',

  // URLs for issue tracking
  issuesTrackerUrl: 'https://github.com/cmoffroad/id-strava-heatmap-extension/issues/',

  // forum support
  forumSupportUrl:
    'https://community.openstreetmap.org/t/new-strava-heatmap-extension-for-id/100544',
};
