async function requestCredentials() {
	try {
		// Send message to request credentials
		await browser.runtime.sendMessage('requestCredentials');
		console.log('[StravaHeatmap] Credentials requested successfully.');
	} catch (error) {
		console.error('[StravaHeatmap] Error requesting credentials:', error);
	}
}

requestCredentials();
