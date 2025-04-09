/**
 * Available activity types for the heatmap
 */
const ACTIVITY_OPTIONS = {
	all: 'All',
	ride: 'Ride',
	run: 'Run',
	water: 'Water',
	winter: 'Winter',
};

/**
 * Available color schemes for the heatmap
 */
const COLOR_OPTIONS = {
	hot: 'Hot',
	gray: 'Gray',
	purple: 'Purple',
	bluered: 'Blue Red',
	orange: 'Orange',
};

/**
 * Retrieves the default layer configurations for the Strava heatmap
 * @returns {Promise<Array>} Promise resolving to an array of layer configurations
 */
async function getLayersConfiguration() {
	const defaultConfigs = [
		{ activity: 'all', color: 'hot', opacity: 100 },
		{ activity: 'ride', color: 'purple', opacity: 100 },
		{ activity: 'run', color: 'orange', opacity: 100 },
		{ activity: 'water', color: 'bluered', opacity: 100 },
		{ activity: 'winter', color: 'gray', opacity: 100 },
	];
	return defaultConfigs; // Already wrapped in Promise by async
}

/**
 * Creates a layer configuration object
 * @param {number} index - Unique index for the layer
 * @param {string} activity - Activity type
 * @param {string} color - Color scheme
 * @param {number} opacity - Opacity percentage (0-100)
 * @returns {Object} Layer configuration object
 */
function getLayerOption(index, activity, color, opacity) {
	const activityName = ACTIVITY_OPTIONS[activity] || activity;
	const colorName = COLOR_OPTIONS[color] || color;
	const normalizedOpacity = Math.max(0, Math.min(opacity, 100)) / 100; // Convert to 0-1 range

	return {
		id: `strava-heatmap-${index}`,
		name: `Strava Heatmap ${activityName} (${colorName})`,
		description: 'Shows aggregated, public Strava activities over the last year',
		template: `https://content-a.strava.com/identified/globalheat/${activity}/${color}/{z}/{x}/{y}.png?v=19`,
		zoomExtent: [0, 15],
		opacity: normalizedOpacity,
	};
}

/**
 * Generates layer options with optional callback for extension
 * @param {Function} [optionsCb] - Optional callback to extend layer options
 * @returns {Promise<Array>} Array of layer options
 * @throws {Error} If optionsCb is provided but not a function
 */
export async function getLayers(optionsCb) {
	if (optionsCb && typeof optionsCb !== 'function') {
		throw new Error('optionsCb must be a function if provided');
	}

	const layersConfiguration = await getLayersConfiguration();

	return layersConfiguration.map((config, index) => {
		const baseLayerOption = getLayerOption(
			index + 1,
			config.activity,
			config.color,
			config.opacity
		);

		return optionsCb ? optionsCb(baseLayerOption) : baseLayerOption;
	});
}
