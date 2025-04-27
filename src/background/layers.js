export async function resetLayerPresets(force = false) {
	const layerPresets = await getLayerPresets();
	if (layerPresets.length > 0 && !force) return false;

	const defaultLayerPresets = [
		{ activity: 'all', color: 'hot' },
		{ activity: 'ride', color: 'purple' },
		{ activity: 'run', color: 'orange' },
		{ activity: 'water', color: 'blue' },
		{ activity: 'winter', color: 'gray' },
	];
	await setLayerPresets(defaultLayerPresets);

	console.log(
		'[StravaHeatmapExt] Initializing default layer presets',
		defaultLayerPresets
	);

	return true;
}

export async function setLayerPresets(layerPresets) {
	const layers = formatLayerPresets(layerPresets);

	await browser.storage.local.set({ layers });
}

export async function getLayerPresets() {
	const { layers } = await browser.storage.local.get('layers');
	if (typeof layers !== 'string') return [];

	const layerPresets = layers.split(';').map((item) => {
		const [activity, color] = item.split(':');
		return { activity, color };
	});

	return layerPresets;
}

export function formatLayerPresets(layerPresets) {
	return layerPresets.map(({ activity, color }) => `${activity}:${color}`).join(';');
}
