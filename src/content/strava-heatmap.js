(async function () {
	try {
		console.debug('[StravaHeatmapExt] executing content/strava-heatmap.js');

		const url = new URL(window.location.href);
		const cookiesParam = url.searchParams.get('cookies');
		if (cookiesParam === 'reset') {
			await browser.runtime.sendMessage({ type: 'resetCredentials' });
			console.log('[StravaHeatmapExt] Credentials reset.');
		} else if (cookiesParam === 'expire') {
			await browser.runtime.sendMessage({ type: 'expireCredentials' });
			console.log('[StravaHeatmapExt] Credentials expired.');
		} else {
			const tabIdParam = url.searchParams.get('tabId');
			const tabId = parseInt(tabIdParam, 10);

			const credentials = await browser.runtime.sendMessage({
				type: 'requestCredentials',
			});
			console.log('[StravaHeatmapExt] Credentials requested.', credentials);

			if (credentials && Number.isInteger(tabId)) {
				await browser.runtime.sendMessage({
					type: 'redirectComplete',
					payload: tabId,
				});
			}
		}
	} catch (error) {
		console.error('[StravaHeatmapExt] Error in strava-heatmap.js:', error);
	}
})();
