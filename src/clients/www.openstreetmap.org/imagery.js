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

export function extendImageryWithStravaHeatmapLayers() {
	const extraLayers = getLayers(createStravaHeatmapLayerConfig);

	const { fetch: originalFetch } = window;
	window.fetch = async (resource, config) => {
		const response = await originalFetch(resource, config);

		if (resource.includes('/assets/iD/data/imagery.')) {
			const json = () =>
				response
					.clone()
					.json()
					.then((data) => {
						return [...data, ...extraLayers];
					});
			response.json = json;
		}

		return response;
	};

	console.log('[StravaHeatmapExt] Extended iD imagery with Strava layers', extraLayers);
}
