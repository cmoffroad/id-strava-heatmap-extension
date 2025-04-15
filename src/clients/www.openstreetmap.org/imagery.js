import { getLayers } from '../common/layers.js';

function createStravaHeatmapLayerConfig({
	index,
	name,
	description,
	template,
	zoomExtent,
}) {
	return {
		id: `strava-heatmap-${index}`,
		name: `${new Array(index).join('󠀠')}` + name,
		description,
		template,
		terms_url:
			'https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!',
		zoomExtent,
		overlay: true,
	};
}

export async function extendImageryWithStravaHeatmapLayers(context, authenticated) {
	const extraLayers = getLayers(createStravaHeatmapLayerConfig);

	const data = await context.background().ensureLoaded();

	// data.imagery = [
	// 	...data.imagery.filter((i) => !i.id.startsWith('strava-heatmap-')),
	// 	...extraLayers,
	// ];
	// data.backgrounds = [
	// 	...data.backgrounds.filter((i) => !i.id.startsWith('strava-heatmap-')),
	// 	...extraLayers.map((l) => iD.rendererBackgroundSource(l)),
	// ];

	extraLayers.forEach((layer) => {
		data.imagery.push(layer);
		data.backgrounds.push(iD.rendererBackgroundSource(layer));
	});

	console.log('[StravaHeatmapExt] Extended iD imagery with Strava layers', extraLayers);
}
