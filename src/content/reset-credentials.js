async function resetCredentials() {
	try {
		// Send message to reset credentials
		await browser.runtime.sendMessage('resetCredentials');
		console.log('[StravaHeatmap] Credentials reset successfully.');
	} catch (error) {
		console.error('[StravaHeatmap] Error resetting credentials:', error);
	}
}

resetCredentials();
