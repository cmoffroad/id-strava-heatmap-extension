(async function () {
	console.debug('[StravaHeatmapExt] executing content/strava-logout.js');

	try {
		// Reset stored credentials after logout or invalidation
		await browser.runtime.sendMessage({ type: 'resetCredentials' });
		console.log('[StravaHeatmapExt] Credentials cleared.');
	} catch (error) {
		console.error('[StravaHeatmapExt] Failed to reset credentials:', error);
	}
})();
