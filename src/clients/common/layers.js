// Available color schemes for the heatmap
const COLORS = {
  hot: ['🔥', 'Hot'],
  blue: ['🔵', 'Blue'],
  gray: ['⚪', 'Gray'],
  purple: ['🟣', 'Purple'],
  bluered: ['🔴', 'Blue-Red'],
  orange: ['🟠', 'Orange'],
};

const ACTIVITIES = {
  _: ['all', 'run', 'ride', 'water', 'run'],
  water: ['kayak', 'surf', 'swim'],
};

export const COLOR_OPTIONS = Object.keys(COLORS).map((key) => [
  key,
  formatLayerColor(key),
]);

export const ACTIVITY_OPTIONS = Object.entries(ACTIVITIES).map(([group, values]) => [
  formatLayerActivity(group),
  values.map((value) => [value, formatLayerActivity(value)]),
]);

function formatLayerColor(value) {
  const [emoji, label] = COLORS[value] || ['❓', value];
  return `${emoji} ${label}`;
}

function formatLayerActivity(param) {
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

// Creates a layer configuration object
function getLayerConfig(position, activity, color, timestamp, authenticated, version) {
  const activityName = formatLayerActivity(activity);
  const colorEmoji = COLOR_OPTIONS[color] || '❓';

  return {
    id: `strava-heatmap-${position}`,
    name: `${new Array(position).join('󠀠')}${colorEmoji} Strava Heatmap ${activityName}`,
    description: `Shows ${activityName.toLowerCase()} aggregated, public Strava activities over the last year in ${colorEmoji} color.`,
    template: authenticated
      ? `https://content-a.strava.com/identified/globalheat/${activity}/${color}/{z}/{x}/{y}.png?v=19&t=${timestamp}`
      : `https://raw.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/v${version}/assets/heatmap-fallback.png?v=1&z={z}&x={x}&y={y}`,
    zoomExtent: authenticated ? [0, 15] : [0, 20],
  };
}

// Generates layer options with optional callback for extension
export function getLayerConfigs(layerPresets, authenticated, version) {
  const timestamp = Date.now().toString();

  return layerPresets.map(({ activity, color }, index) =>
    getLayerConfig(index + 1, activity, color, timestamp, authenticated, version)
  );
}

export function setupLayerPresetsChangeListener(callback) {
  window.addEventListener('message', (event) => {
    if (event.source !== window) return; // ignore messages from iframes
    if (event.data.type === 'layerPresetsChanged') {
      callback(event.data.payload);
    }
  });
}

export function parseLayersPresets(string) {
  return string.split(';').map((item) => {
    const [activity, color] = item.split(':');
    return { activity, color };
  });
}
