async function resetCredentials() {
	try {
		// Send message to reset credentials
		await browser.runtime.sendMessage('resetCredentials');
		console.log('[SH] Credentials reset successfully.');
	} catch (error) {
		console.error('[SH] Error resetting credentials:', error);
	}
}

resetCredentials();
