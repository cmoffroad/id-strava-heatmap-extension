import { getLayers } from '../common/layers.js';

export function extendImageryWithStravaHeatmapLayers() {
  const { fetch: originalFetch } = window;
  window.fetch = async (resource, config) => {
    const response = await originalFetch(resource, config);

    if (resource.includes('/assets/iD/data/imagery.')) {
      const extraLayers = await getLayers(createStravaHeatmapLayerConfig);
      const json = () =>
        response
          .clone()
          .json()
          .then((data) => {
            return [...data, ...extraLayers];
          });
      response.json = json;
    }

    return response;
  };

  console.log('[StravaHeatmapExt] Extended iD imagery with Strava layers');
}

function createStravaHeatmapLayerConfig({
  index,
  name,
  description,
  template,
  zoomExtent,
}) {
  return {
    id: `strava-heatmap-${index}`,
    name,
    description,
    template,
    terms_url:
      'https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!',
    zoomExtent,
    overlay: true,
  };
}

//Execute the extension if running in browser environment
extendImageryWithStravaHeatmapLayers();

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyO' && event.altKey) {
    document.body.classList.toggle('hide-overlays');
  }
});
