import { setupAuthStatusChangeListener } from '../common/auth.js';
import { restoreiDContainer, setupiDCoreContextListener } from './id.js';
import { extendImageryWithStravaHeatmapLayers } from './imagery.js';
import { setupOverlaysListeners } from './overlays.js';
import { refreshTiles } from './tiles.js';

async function main() {
  // const { authenticated } = document.querySelector('script[data-authenticated]').dataset;

  setupiDCoreContextListener(async (context) => {
    window.context = context; // DEBUG

    await extendImageryWithStravaHeatmapLayers(context);

    setupOverlaysListeners();
    setupAuthStatusChangeListener(async (authenticated) => {
      // await extendImageryWithStravaHeatmapLayers(context);
      refreshTiles(context);
    });
  });

  restoreiDContainer();
}

main();
