export function refreshTiles() {
	console.debug('[StravaHeatmapExt] Starting tile refresh');
	const tiles = document.querySelectorAll('img[src*="strava.com"]');
	tiles.forEach((tile) => {
		const url = new URL(tile.src);
		url.searchParams.set('r', Date.now().toString());
		requestAnimationFrame(() => (tile.src = url.toString()));
	});
	console.debug(`[StravaHeatmapExt] Refreshed ${tiles.length} local tiles`);
}
