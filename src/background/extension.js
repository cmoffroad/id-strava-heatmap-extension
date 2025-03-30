const manifest = browser.runtime.getManifest();

export default {
	// Extension name fro mthe manifest
	name: manifest.name,

	// Current extension version from the manifest
	versionNumber: manifest.version,

	// test if dev Mode
	isDevMode: !manifest.update_url,

	// Detect browser type
	browser: manifest.browser_specific_settings?.gecko !== undefined ? 'firefox' : 'chrome',

	// Determine the installation/update URL
	installationUrl: manifest.update_url ?? manifest.homepage_url,

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
