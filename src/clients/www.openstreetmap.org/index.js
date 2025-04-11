import { extendImageryWithStravaHeatmapLayers } from './imagery.js';
import { setupToggleOverlaysKeyboardListener } from './overlays.js';

async function main() {
  extendImageryWithStravaHeatmapLayers();
  setupToggleOverlaysKeyboardListener();
}

main();
