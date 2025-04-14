export function setupAuthStatusChangeListener(callback) {
	window.addEventListener('message', (event) => {
		if (event.source !== window) return; // ignore messages from iframes
		if (event.data.type === 'authStatusChanged') {
			callback(event.data.payload);
		}
	});
}
