async function requestCredentials() {
	try {
		// Send message to request credentials
		const credentials = await browser.runtime.sendMessage('requestCredentials');
		console.log('[StravaHeatmapExt] Credentials requested.', credentials);
	} catch (error) {
		console.error('[StravaHeatmapExt] Error requesting credentials:', error);
	}
}

requestCredentials();
