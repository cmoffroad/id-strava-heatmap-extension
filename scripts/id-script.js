// generate iD imagery attributes for given Strava Heatmap type and color
function resolveStravaHeatmapImagery(type, color) {
  const lowerType = type.toLowerCase();
  const lowerColor = color.toLowerCase();

  return {
    id: `StravaHeatmap${type}`,
    name: `Strava Heatmap (${type})`,
    description: `The Strava Heatmap (${type}) shows heat made by aggregated, public activities over the last year.`,
    template: `https://heatmap-external-{switch:a,b,c}.strava.com/tiles/${lowerType}/${lowerColor}/{zoom}/{x}/{y}.png?v=19`,
    terms_url: "https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!",
    zoomExtent: [0, 15],
    overlay: true,
  };
}

// override global fetch function used by iD to retrieve imagery json file
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  const [resource, config] = args;

  const activities = ['Ride', 'Run', 'Water', 'Winter', 'All'];
  const stravaImagery = activities.map(activity =>
    resolveStravaHeatmapImagery(activity, 'Hot')
  );

  const response = await originalFetch(resource, config);

  const isIDImagery = resource.includes('/assets/iD/data/imagery.min');
  const isRapidImagery = resource.match('/rapid/release-(.*)/data/imagery.min.json');

  if (isIDImagery || isRapidImagery) {
    const enhancedJson = () => response
      .clone()
      .json()
      .then(data => {
        if (isIDImagery) {
          return [...data, ...stravaImagery];
        }
        if (isRapidImagery) {
          return {
            ...data,
            imagery: [...data.imagery, ...stravaImagery]
          };
        }
      });

    response.json = enhancedJson;
  }

  return response;
};