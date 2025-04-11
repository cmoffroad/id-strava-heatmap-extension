/**
 * Available color schemes for the heatmap
 */
const COLOR_OPTIONS = {
  blue: '🔵',
  hot: '🔥',
  gray: '⚪',
  purple: '🟣',
  bluered: '🔴',
  orange: '🟠',
};

function formatStravaActivityLabel(param) {
  // Remove "sport_" prefix if present
  let clean = param.replace(/^sport_/, '');

  // Split camelCase or PascalCase into words
  clean = clean.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize each word
  clean = clean
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fix known patterns like "E Bike" → "E-Bike"
  return clean.replace(/E\s/g, 'E-');
}

/**
 * Retrieves the default layer configurations for the Strava heatmap
 * @returns {Promise<Array>} Promise resolving to an array of layer configurations
 */
async function getLayersConfiguration() {
  const defaultConfigs = [
    { activity: 'all', color: 'hot' },
    { activity: 'ride', color: 'purple' },
    { activity: 'run', color: 'orange' },
    { activity: 'water', color: 'blue' },
    { activity: 'winter', color: 'gray' },
  ];
  return defaultConfigs; // Already wrapped in Promise by async
}

/**
 * Creates a layer configuration object
 * @param {number} index - Unique index for the layer
 * @param {string} activity - Activity type
 * @param {string} color - Color scheme
 * @returns {Object} Layer configuration object
 */
function getLayerOption(index, activity, color) {
  const activityName = formatStravaActivityLabel(activity);
  const colorName = COLOR_OPTIONS[color] || '❓';
  const sortPrefix = new Array(index).join('󠀠');

  return {
    id: `strava-heatmap-${index}`,
    index,
    name: `${sortPrefix}${colorName} Strava Heatmap ${activityName}`,
    description: 'Shows aggregated, public Strava activities over the last year',
    template: `https://content-a.strava.com/identified/globalheat/${activity}/${color}/{z}/{x}/{y}.png?v=19`,
    zoomExtent: [0, 15],
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
    const baseLayerOption = getLayerOption(index + 1, config.activity, config.color);

    return optionsCb ? optionsCb(baseLayerOption) : baseLayerOption;
  });
}
