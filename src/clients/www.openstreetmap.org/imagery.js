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
	extraLayers.forEach((layer) => {
		data.imagery.push(layer);
		data.backgrounds.push(iD.rendererBackgroundSource(layer));
	});

	console.log('[StravaHeatmapExt] Extended iD imagery with Strava layers', extraLayers);
}
