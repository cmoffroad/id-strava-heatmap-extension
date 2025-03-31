const manifest = browser.runtime.getManifest();

// Detect browser type
const browserName =
	manifest.browser_specific_settings?.gecko !== undefined ? 'firefox' : 'chrome';

const EXTENSION_PAGE = {
	chrome:
		'https://chromewebstore.google.com/detail/id-strava-heatmap/eglbcifjafncknmpmnelckombmgddlco',
	firefox: 'https://addons.mozilla.org/en-US/firefox/addon/id-strava-heatmap/',
};

console.log(manifest);

export default {
	// Extension name fro mthe manifest
	name: manifest.name,

	// Current extension version from the manifest
	versionNumber: manifest.version,

	// browser name
	browserName,

	// Determine the installation/update URL
	installationUrl: EXTENSION_PAGE[browserName],

	checkUpdatesUrl:
		'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/updates.json',

	heatmapFallbackUrl:
		'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/assets/heatmap-fallback.svg',

	imageryUrl:
		'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/assets/imagery.json',

	// URLs for issue tracking and forum support
	issuesTrackerUrl: 'https://github.com/cmoffroad/id-strava-heatmap-extension/issues/',
	forumSupportUrl:
		'https://community.openstreetmap.org/t/new-strava-heatmap-extension-for-id/100544',
};
