export function refreshTiles(context) {
	console.debug('[StravaHeatmapExt] Starting tile refresh');
	const map = context.map();
	const tiles = document.querySelectorAll('img[src*="strava.com"]');
	tiles.forEach((tile) => {
		tile.remove();
	});
	map.zoom(map.zoom()); // redraw
	console.debug(`[StravaHeatmapExt] Refreshed ${tiles.length} local tiles`);
}
