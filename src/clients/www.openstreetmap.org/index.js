import { setupAuthStatusChangeListener } from '../common/auth.js';
import { restoreiDContainer, setupiDCoreContextListener } from './id.js';
import { extendImageryWithStravaHeatmapLayers } from './imagery.js';
import { setupOverlaysListeners } from './overlays.js';
import { refreshTiles } from './tiles.js';

async function main() {
  const { authenticated } = document.querySelector('script[data-authenticated]').dataset;

  setupiDCoreContextListener((context) => {
    window.context = context; // DEBUG

    extendImageryWithStravaHeatmapLayers(context, authenticated); // TODO pass current authentication

    setupOverlaysListeners();
    setupAuthStatusChangeListener((authenticated) => {
      // TODO update layers URL with &a&t

      refreshTiles(context);
    });
  });

  restoreiDContainer();
}

main();
