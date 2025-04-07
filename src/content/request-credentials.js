async function requestCredentials() {
	try {
		// Send message to request credentials
		await browser.runtime.sendMessage('requestCredentials');
		console.log('[SH] Credentials requested successfully.');
	} catch (error) {
		console.error('[SH] Error requesting credentials:', error);
	}
}

requestCredentials();
