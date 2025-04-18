(function () {
	console.debug('[StravaHeatmapExt] executing strava-redirect.js');

	const url = new URL(window.location.href);
	const redirect = url.searchParams.get('redirect')?.trim();

	if (typeof redirect === 'string' && redirect.startsWith('/')) {
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
