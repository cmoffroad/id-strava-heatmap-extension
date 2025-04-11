(function () {
	console.debug('[StravaHeatmapExt] executing reset-credentials.js');

	async function resetCredentials() {
		try {
			// Send message to reset credentials
			await browser.runtime.sendMessage('resetCredentials');
			console.log('[StravaHeatmapExt] Credentials cleared.');
		} catch (error) {
			console.error('[StravaHeatmapExt] Error resetting credentials:', error);
		}
	}

	resetCredentials();
})();
