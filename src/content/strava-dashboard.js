(async function () {
	console.debug('[StravaHeatmapExt] executing content/strava-dashboard.js');

	const url = new URL(window.location.href);
	const redirect = url.searchParams.get('redirect')?.trim();
	const expired = url.searchParams.has('expired');

	if (expired) {
		const credentials = await browser.runtime.sendMessage({ type: 'expireCredentials' });
		console.log('[StravaHeatmapExt] Credentials expired.', credentials);
	} else if (redirect?.startsWith('/')) {
		console.debug('[StravaHeatmapExt] Redirecting to:', redirect);

		// Prevent accidental reload loops
		if (redirect !== window.location.pathname) {
			window.location.href = redirect;
		} else {
			console.debug(
				'[StravaHeatmapExt] Redirect target is same as current path. Skipping.'
			);
		}
	} else {
		console.debug('[StravaHeatmapExt] No valid redirect found.');
	}
})();
