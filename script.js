// generate imagery attributes for given Strava Heatmap type, color and credentials
function getStravaHeatmapImagery(type, color, credentials) {
  const { keyPairId, policy, signature} = credentials;
  return {
    name: `Strava Heatmap ${type} (${color})`,
    id: `StravaHeatmap${type}`,
    template: `https://heatmap-external-{switch:a,b,c}.strava.com/tiles-auth/${type.toLowerCase()}/${color.toLowerCase()}/{zoom}/{x}/{y}.png?Key-Pair-Id=${keyPairId}&Policy=${policy}&Signature=${signature}`,
    zoomExtent: [0, 24],
    overlay: true    
  }
}

// override global fetch function used by iD to retrieve imagery json file
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {

  const [resource, config] = args;

  const response = await originalFetch(resource, config);

  // retrieve strava cookies credential
  const credentials = window.StravaHeatmapCredentials;

  if (resource.match('/assets/iD/data/imagery.') && credentials) {

    // response interceptor
    const json = () => response.clone().json()
    .then((data) => ([ 
      ...data,
      getStravaHeatmapImagery('Ride', 'Red', credentials),
      getStravaHeatmapImagery('Run', 'Purple', credentials),
      getStravaHeatmapImagery('Water', 'Blue', credentials),
      getStravaHeatmapImagery('Winter', 'Gray', credentials),
      getStravaHeatmapImagery('All', 'Hot', credentials),
    ]));

    response.json = json;
  }
  return response;
};