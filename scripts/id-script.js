// override global fetch function used by iD to retrieve imagery json file
let originalFetch = window.fetch;
window.fetch = async (...args) => {

  const [resource, config] = args;

  const response = await originalFetch(resource, config);

  if (resource.match('/assets/iD/data/imagery.')) {

    // retrieve imagery json array and append StravaHeatmap details
    const json = () => response
      .clone()
      .json()
      .then(data => [
        ...data,
        {
          id: `StravaHeatmap`,
          name: `Strava Heatmap`,
          description: `The Strava Heatmap shows heat made by aggregated, public activities over the last year.`,
          template: `https://heatmap-external-{switch:a,b,c}.strava.com/tiles/all/hot/{zoom}/{x}/{y}.png?v=19&ts=${Date.now()}`,
          terms_url: "https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!",
          zoomExtent: [0, 24],
          overlay: true
        }
      ]);

    response.json = json;
  }
  return response;
};