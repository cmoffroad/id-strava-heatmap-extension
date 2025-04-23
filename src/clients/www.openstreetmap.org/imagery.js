import { getLayers } from '../common/layers.js';
import { getDefaultOverlayIds } from './overlays.js';

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

export async function initImagery(context, authenticated, version) {
	const stravaLayers = getLayers(createStravaHeatmapLayerConfig, authenticated, version);

	const background = context.background();
	const imagery = await background.ensureLoaded();

	// Find currently visible Strava overlay layers
	background
		.overlayLayerSources()
		.forEach((layer) => background.toggleOverlayLayer(layer));

	// create or update existing strava sources
	stravaLayers.forEach((layer) => {
		imagery.backgrounds.push(iD.rendererBackgroundSource(layer));
	});

	await background.init();

	const defaultOverlayIds = getDefaultOverlayIds();
	defaultOverlayIds.forEach((id) => {
		const source = background.findSource(id);
		if (source) {
			background.toggleOverlayLayer(source);
		} else {
			console.warn(`[StravaHeatmapExt] Missing overlay source for initialization: ${id}`);
		}
	});

	console.log(
		'[StravaHeatmapExt] Initialized iD imagery with Strava layers',
		stravaLayers
	);
}

export async function updateImagery(context, authenticated, version) {
	const stravaLayers = getLayers(createStravaHeatmapLayerConfig, authenticated, version);

	const background = context.background();

	// Find currently visible Strava overlay layers
	const visibleStravaSources = background
		.overlayLayerSources()
		.filter((layer) => layer.id.startsWith('strava-heatmap-'));

	// Remove existing Strava overlays from the map
	visibleStravaSources.forEach((layer) => background.toggleOverlayLayer(layer));

	// create or update existing strava sources
	stravaLayers.forEach((layer) => {
		const source = background.findSource(layer.id);
		if (source) {
			source.id = 'custom';
			source.template(layer.template);
			source.zoomExtent = layer.zoomExtent;
			source.id = layer.id;
		} else {
			console.warn(`[StravaHeatmapExt] Missing overlay source for update: ${id}`);
		}
	});

	background.updateImagery();

	// Restore previously visible Strava overlays
	visibleStravaSources.forEach((layer) => background.toggleOverlayLayer(layer));

	console.log('[StravaHeatmapExt] Updated iD imagery with Strava layers', stravaLayers);
}
