import { getLayerConfigs } from '../common/layers.js';
import {
  adjustOverlaysOrder,
  bindOverlaysShortcuts,
  getDefaultOverlaysHash,
} from './overlays.js';

export async function applyImagery(context, layerPresets, authenticated, version) {
  const stravaConfigs = getLayerConfigs(layerPresets, authenticated, version);
  const background = context.background();
  const imagery = await background.ensureLoaded();

  // toggle off all layers
  background
    .overlayLayerSources()
    .forEach((layer) => background.toggleOverlayLayer(layer));

  // remove all strava heatmap layers from background sources array
  imagery.backgrounds = imagery.backgrounds.filter(
    (b) => !b.id.startsWith('strava-heatmap-')
  );

  // re-add configured strava heatmap layers
  stravaConfigs.forEach((config) => {
    const source = iD.rendererBackgroundSource({
      ...config,
      overlay: true,
      terms_url:
        'https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!',
    });
    imagery.backgrounds.push(source);
  });

  // update background sources
  await background.init();

  // re-toggle selected overlays
  const defaultOverlaysHash = getDefaultOverlaysHash();
  await adjustOverlaysOrder(background, defaultOverlaysHash, false);

  // redraw ui
  await context.ui().restart();

  // ensure overlay shortcuts are re-binded
  bindOverlaysShortcuts(context);

  console.log(
    `[StravaHeatmapExt] Updated iD imagery with Strava layer configs`,
    stravaConfigs
  );
}
