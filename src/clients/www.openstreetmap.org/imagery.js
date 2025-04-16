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
	const extraLayers = getLayers(createStravaHeatmapLayerConfig, authenticated);

	const background = context.background();
	const imagery = await background.ensureLoaded();

	// Find currently visible Strava overlay layers
	const visibleStravaSources = background
		.overlayLayerSources()
		.filter((layer) => layer.id.startsWith('strava-heatmap-'));
	const visibleStravaSourceIds = new Set(visibleStravaSources.map((layer) => layer.id));

	// Remove existing Strava overlays from the map
	visibleStravaSources.forEach((layer) => background.toggleOverlayLayer(layer));

	// create or update existing strava sources
	extraLayers.forEach((layer) => {
		const source = background.findSource(layer.id);
		if (source) {
			source.id = 'custom';
			source.template(layer.template);
			source.zoomExtent = layer.zoomExtent;
			source.description = layer.description;
			source.id = layer.id;
		} else {
			imagery.backgrounds.push(iD.rendererBackgroundSource(layer));
		}
	});

	background.updateImagery();

	// Restore previously visible Strava overlays
	visibleStravaSources.forEach((layer) => background.toggleOverlayLayer(layer));

	console.log('[StravaHeatmapExt] Extended iD imagery with Strava layers', extraLayers);
}
