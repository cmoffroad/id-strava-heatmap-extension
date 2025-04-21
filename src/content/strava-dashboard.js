(async function () {
	console.debug('[StravaHeatmapExt] executing content/strava-dashboard.js');

	const url = new URL(window.location.href);
	const redirect = url.searchParams.get('redirect')?.trim();

	const isValidRedirect = redirect?.startsWith('/');
	const samePath = redirect === window.location.pathname;

	if (isValidRedirect) {
		if (!samePath) {
			console.debug('[StravaHeatmapExt] Redirecting to:', redirect);
			window.location.href = redirect;
		} else {
			console.debug(
				'[StravaHeatmapExt] Redirect target is same as current path. Skipping.'
			);
		}
	}
})();
