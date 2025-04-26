import { getLayerConfigs } from '../common/layers.js';
import { getDefaultOverlayIds } from './overlays.js';

export async function initImagery(context, layerPresets, authenticated, version) {
	const stravaConfigs = getLayerConfigs(layerPresets, authenticated, version);

	const background = window.context.background();
	const imagery = await background.ensureLoaded();

	// Find currently visible Strava overlay layers
	background
		.overlayLayerSources()
		.forEach((layer) => background.toggleOverlayLayer(layer));

	// create or update existing strava sources
	stravaConfigs.forEach((config) => {
		imagery.backgrounds.push(
			iD.rendererBackgroundSource({
				...config,
				overlay: true,
				terms_url:
					'https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!',
			})
		);
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
		'[StravaHeatmapExt] Initialized iD imagery with Strava layer configs',
		stravaConfigs
	);
}

export async function updateImagery(context, layerPresets, authenticated, version) {
	const stravaConfigs = getLayerConfigs(layerPresets, authenticated, version);

	const background = context.background();

	// Find currently visible Strava overlay layers
	const visibleStravaSources = background
		.overlayLayerSources()
		.filter((layer) => layer.id.startsWith('strava-heatmap-'));

	// Remove existing Strava overlays from the map
	visibleStravaSources.forEach((layer) => background.toggleOverlayLayer(layer));

	// create or update existing strava sources
	stravaConfigs.forEach((config) => {
		const source = background.findSource(config.id);
		if (source) {
			source.id = 'custom';
			source.template(config.template);
			source.zoomExtent = config.zoomExtent;
			source.id = config.id;
		} else {
			console.warn(`[StravaHeatmapExt] Missing overlay source for update: ${id}`);
		}
	});

	background.updateImagery();

	// Restore previously visible Strava overlays
	visibleStravaSources.forEach((layer) => background.toggleOverlayLayer(layer));

	console.log(
		'[StravaHeatmapExt] Updated iD imagery with Strava layer configs',
		stravaConfigs
	);
}
