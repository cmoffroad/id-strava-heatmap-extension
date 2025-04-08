try {
	window.injectClientScript('src/id/index.js');
	console.info('[StravaHeatmap] Client script injected successfully.');
} catch (error) {
	console.error('[StravaHeatmap] Failed to inject client script:', error);
}
