import { openDatabase } from './db.js';
import { getLayers } from '../common/layers.js';

// Utility function to get next custom ID
const getNextCustomId = (existingIds) => {
  return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
};

// Transform layer data
const transformLayer = (baseLayer, lastId) => {
  const id = `custom-${lastId + baseLayer.index}`;
  return {
    id,
    name: baseLayer.name,
    tileUrls: [baseLayer.template],
    maxZoom: baseLayer.zoomExtent[1],
    layerType: 'overlay',
    resourceType: 'raster',
    opacity: baseLayer.opacity,
    value: {
      version: 8,
      sources: {
        [id]: {
          type: 'raster',
          tiles: [baseLayer.template],
          tileSize: 256,
          maxzoom: baseLayer.zoomExtent[1],
        },
      },
      layers: [{ id, type: 'raster', source: id }],
    },
  };
};

async function main() {
  // Initialize database and store
  const db = await openDatabase('Database');
  const store = await db.openStore('settings');

  // Get previous settings with defaults
  const previousSettings = await store.get({
    customLayers: {},
    previousOverlays: { overlays: { custom: {} } },
    currentOverlays: { overlays: { custom: {} } },
    customOverlayOrder: [],
    selectedOverlayTree: { overlays: { custom: {} } },
    opacities: {},
  });

  // Extract existing custom IDs
  const existingCustomIds = Object.keys(previousSettings.customLayers)
    .filter((key) => !/strava heatmap/i.test(previousSettings.customLayers[key]?.name))
    .map((key) => parseInt(key.replace('custom-', '')))
    .filter(Number.isFinite);

  const nextCustomId = getNextCustomId(existingCustomIds);

  // Get and transform layers
  const layers = await getLayers((baseLayer) =>
    transformLayer(baseLayer, nextCustomId - 1)
  );
  const newLayerIds = new Set(layers.map((l) => l.id));

  // Identify layers to remove
  const oldLayerIds = Object.keys(previousSettings.customLayers).filter(
    (key) =>
      /strava heatmap/i.test(previousSettings.customLayers[key]?.name) &&
      previousSettings.customLayers[key]?.layerType === 'overlay'
  );

  const otherLayerIds = Object.keys(previousSettings.customLayers).filter(
    (key) =>
      !oldLayerIds.includes(key) &&
      previousSettings.customLayers[key]?.layerType === 'overlay'
  );

  const layerIdsToRemove = oldLayerIds.filter((id) => !newLayerIds.has(id));

  // Update settings
  const newSettings = structuredClone(previousSettings);

  // Remove old layers
  layerIdsToRemove.forEach((id) => {
    delete newSettings.customLayers[id];
    delete newSettings.opacities[id];
    delete newSettings.selectedOverlayTree.overlays.custom[id];
    delete newSettings.currentOverlays.overlays.custom[id];
    // delete newSettings.previousOverlays.overlays.custom[id];
  });

  newSettings.customOverlayOrder = newSettings.customOverlayOrder.filter((key) =>
    otherLayerIds.includes(key)
  );

  // Add new layers
  layers.forEach((layer) => {
    newSettings.customLayers[layer.id] = layer;
    newSettings.opacities[layer.id] = 0.8;
    newSettings.selectedOverlayTree.overlays.custom[layer.id] = true;
    newSettings.currentOverlays.overlays.custom[layer.id] ??= true;
    // newSettings.previousOverlays.overlays.custom[layer.id] ??= true;
    newSettings.customOverlayOrder.push(layer.id);
  });

  // Save and log
  const result = await store.put(newSettings);
  console.log(
    '[StravaHeatmapExt] Extended custom overlays with Strava Heatmap layers',
    result
  );
}

window.onload = async () => {
  main();
};
