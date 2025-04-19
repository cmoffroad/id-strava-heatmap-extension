// Available color schemes for the heatmap
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

// Retrieves the default layer configurations for the Strava heatmap
function getLayersConfiguration() {
  const defaultConfigs = [
    { activity: 'all', color: 'hot' },
    { activity: 'ride', color: 'purple' },
    { activity: 'run', color: 'orange' },
    { activity: 'water', color: 'blue' },
    { activity: 'winter', color: 'gray' },
  ];
  return defaultConfigs;
}

// Creates a layer configuration object
function getLayerOption(index, activity, color, timestamp, authenticated) {
  const activityName = formatStravaActivityLabel(activity);
  const colorEmoji = COLOR_OPTIONS[color] || '❓';

  return {
    id: `strava-heatmap-${index}`,
    index,
    name: `${colorEmoji} Strava Heatmap ${activityName}`,
    description: `Shows ${activityName.toLowerCase()} aggregated, public Strava activities over the last year in ${colorEmoji} color.`,
    template: authenticated
      ? `https://content-a.strava.com/identified/globalheat/${activity}/${color}/{z}/{x}/{y}.png?v=19&t=${timestamp}`
      : 'https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/master/assets/heatmap-fallback.png?v=1&z={z}&x={x}&y{y}',
    zoomExtent: authenticated ? [0, 15] : [0, 20],
  };
}

// Generates layer options with optional callback for extension
export function getLayers(optionsCb, authenticated) {
  const layersConfiguration = getLayersConfiguration();
  const timestamp = Date.now().toString();

  return layersConfiguration.map((config, index) => {
    const baseLayerOption = getLayerOption(
      index + 1,
      config.activity,
      config.color,
      timestamp,
      authenticated
    );

    return optionsCb(baseLayerOption);
  });
}

export function setupHeatmapFallbackClickListener(redirectUrl) {
  document.body.addEventListener('click', (e) => {
    // Left-click only
    if (e.button !== 0) return;

    // Target must be an <img>
    const img = e.target instanceof HTMLImageElement ? e.target : null;
    if (!img) return;

    // Match the image source
    if (img.src.includes('heatmap-fallback.png')) {
      // Optional: ensure it's not a double-click or weird gesture
      if (e.detail === 1) {
        console.debug(
          '[StravaHeatmapExt] Fallback heatmap image clicked:',
          img,
          redirectUrl
        );
        window.open(redirectUrl, '_blank');
      }
    }
  });
}
