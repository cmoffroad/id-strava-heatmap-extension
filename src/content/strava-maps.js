try {
	// Send message to request credentials
	await browser.runtime.sendMessage('requestCredentials');
	console.log('Credentials requested successfully.');
} catch (error) {
	console.error('Error requesting credentials:', error);
}
