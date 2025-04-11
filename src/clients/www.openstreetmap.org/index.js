import { getLayers } from '../common/layers.js';

export function extendImageryWithStravaHeatmapLayers(originalFetch = window.fetch) {
  // Store the original fetch if not provided
  const fetchImplementation = originalFetch;

  window.fetch = async (resource, config) => {
    const response = await fetchImplementation(resource, {
      ...config,
      cache: 'reload', // ensure not cached
    });

    // Skip if not imagery JSON or response failed
    if (!isImageryResource(resource) || !response.ok) {
      return response;
    }

    return enhanceResponseWithStravaHeatmapLayers(response);
  };
}

function isImageryResource(resource) {
  return typeof resource === 'string' && resource.includes('/assets/iD/data/imagery.');
}

async function enhanceResponseWithStravaHeatmapLayers(response) {
  try {
    const extraLayers = await getLayers(createStravaHeatmapLayerConfig);

    // Clone and extend the JSON response
    const originalJson = response.json.bind(response);
    response.json = async () => {
      const data = await originalJson();
      return [...data, ...extraLayers];
    };

    console.log('[StravaHeatmapExt] Extended iD imagery with Strava layers');
    return response;
  } catch (error) {
    console.error('[StravaHeatmapExt] Error extending iD imagery:', error);
    return response; // Return original response on error
  }
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
    name: `${new Array(index).join('󠀠')}` + name,
    description,
    template,
    terms_url:
      'https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!',
    zoomExtent,
    overlay: true,
  };
}

// Execute the extension if running in browser environment
if (typeof window !== 'undefined' && window.fetch) {
  extendImageryWithStravaHeatmapLayers(window.fetch);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyO' && event.altKey) {
    document.body.classList.toggle('hide-overlays');
  }
});
