function refreshTiles() {
	console.debug('[StravaHeatmapExt] Starting tile refresh');
	const tiles = document.querySelectorAll('img[src*="strava.com"]');
	tiles.forEach((tile) => {
		const url = new URL(tile.src);
		url.searchParams.set('t', Date.now().toString());
		requestAnimationFrame(() => (tile.src = url.toString()));
	});
	console.debug(`[StravaHeatmapExt] Refreshed ${tiles.length} local tiles`);
}

export function setupRefreshTilesListener() {
	window.addEventListener('message', (event) => {
		if (event.source !== window) return; // ignore messages from iframes
		if (event.data.type === 'REFRESH_TILES') {
			refreshTiles();
		}
	});
}
