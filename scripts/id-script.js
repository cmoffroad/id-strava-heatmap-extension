// Generate iD imagery attributes for a given Strava Heatmap type and color
function resolveStravaHeatmapImagery(type, color) {
  const lowerType = type.toLowerCase();
  const lowerColor = color.toLowerCase();

  return {
    id: `StravaHeatmap${type}`,
    name: `Strava Heatmap (${type})`,
    description: `The Strava Heatmap (${type}) shows heat made by aggregated, public activities over the last year.`,
    template: `https://heatmap-external-{switch:a,b,c}.strava.com/tiles/${lowerType}/${lowerColor}/{zoom}/{x}/{y}.png?v=19`,
    terms_url:
      'https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!',
    zoomExtent: [0, 15],
    overlay: true,
  };
}

// Override global fetch function used by iD to retrieve imagery JSON file
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  const [resource, config] = args;
  const response = await originalFetch(resource, config);

  // Check if the requested resource is the iD imagery JSON
  if (!resource.includes('/assets/iD/data/imagery.') || !response.ok) {
    return response;
  }

  try {
    const heatmapTypes = ['Ride', 'Run', 'Water', 'Winter', 'All'];
    const heatmapOverlays = heatmapTypes.map((type) =>
      resolveStravaHeatmapImagery(type, 'Hot')
    );

    // Clone response and extend JSON data
    const json = async () => {
      const data = await response.clone().json();
      return [...data, ...heatmapOverlays];
    };

    response.json = json;
  } catch (error) {
    console.error('Error modifying Strava imagery response:', error);
  }

  return response;
};
