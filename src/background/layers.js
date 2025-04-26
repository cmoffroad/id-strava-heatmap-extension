export async function initLayerPresets() {
	const layerPresets = await getLayerPresets();
	if (layerPresets.length > 0) return false;

	const defaultLayerPresets = [
		{ activity: 'all', color: 'hot' },
		{ activity: 'ride', color: 'purple' },
		{ activity: 'run', color: 'orange' },
		{ activity: 'water', color: 'blue' },
		{ activity: 'winter', color: 'gray' },
	];
	setLayerPresets(defaultLayerPresets);

	console.log(
		'[StravaHeatmapExt] Initializing default layer presets',
		defaultLayerPresets
	);

	return true;
}

async function setLayerPresets(layerPresets) {
	const layers = layerPresets
		.map(({ activity, color }) => `${activity}:${color}`)
		.join(';');

	await browser.storage.local.set({ layers });
}

async function getLayerPresets() {
	const { layers } = await browser.storage.local.get('layers');
	if (typeof layers !== 'string') return [];

	const layerPresets = layers.split(';').map((item) => {
		const [activity, color] = item.split(':');
		return { activity, color };
	});

	return layerPresets;
}
