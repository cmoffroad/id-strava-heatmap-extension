import { setupAuthStatusChangeListener } from '../common/auth.js';
import { restoreiDContainer, setupiDCoreContextListener } from './id.js';
import { extendImageryWithStravaHeatmapLayers } from './imagery.js';
import { setupOverlaysListeners } from './overlays.js';

async function main() {
  const authenticated =
    document.querySelector('script[data-authenticated]').dataset.authenticated === 'true';

  setupiDCoreContextListener(async (context) => {
    window.context = context; // DEBUG

    await extendImageryWithStravaHeatmapLayers(context, authenticated);

    setupOverlaysListeners();
    setupAuthStatusChangeListener(async (authenticated) => {
      await extendImageryWithStravaHeatmapLayers(context, authenticated);
    });
  });

  restoreiDContainer();
}

main();
