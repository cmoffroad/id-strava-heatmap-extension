// generate iD imagery attributes for given Strava Heatmap type and color
function resolveStravaHeatmapImagery(type, color) {
  return {
    id: `StravaHeatmap${type}`,
    name: `Strava Heatmap (${type})`,
    description: `The Strava Heatmap (${type}) shows heat made by aggregated, public activities over the last year.`,
    template: `https://heatmap-external-{switch:a,b,c}.strava.com/tiles/${type.toLowerCase()}/${color.toLowerCase()}/{zoom}/{x}/{y}.png`,
    terms_url: "https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!",
    zoomExtent: [0, 24],
    overlay: true
  };
}

// override global fetch function used by iD to retrieve imagery json file
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {

  const [resource, config] = args;

  const response = await originalFetch(resource, config);

  if (resource.match('/assets/iD/data/imagery.')) {

    const json = () => response
      .clone()
      .json()
      .then(data => [
        ...data,
        resolveStravaHeatmapImagery('Ride', 'Hot'),
        resolveStravaHeatmapImagery('Run', 'Hot'),
        resolveStravaHeatmapImagery('Water', 'Hot'),
        resolveStravaHeatmapImagery('Winter', 'Hot'),
        resolveStravaHeatmapImagery('All', 'Hot'),
      ]);

    response.json = json;
  }
  return response;
};