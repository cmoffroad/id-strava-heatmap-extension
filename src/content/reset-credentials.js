async function resetCredentials() {
	try {
		// Send message to reset credentials
		await browser.runtime.sendMessage('resetCredentials');
		console.log('Credentials reset successfully.');
	} catch (error) {
		console.error('Error resetting credentials:', error);
	}
}

resetCredentials();
