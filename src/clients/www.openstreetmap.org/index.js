import { setupAuthStatusChangeListener } from '../common/auth.js';
import { restoreiDContainer, setupiDCoreContextListener } from './id.js';
import { initImagery, updateImagery } from './imagery.js';
import { setupOverlaysListeners } from './overlays.js';

async function main() {
  const script = document.querySelector('script#strava-heatmap-client');

  const authenticated = script.dataset.authenticated === 'true';
  const version = script.dataset.version;

  setupiDCoreContextListener(async (context) => {
    window.context = context; // DEBUG
    console.log(
      '[StravaHeatmapExt] iD context initialization callback triggered',
      context
    );

    // make sure ui fully loaded
    await context.ui().ensureLoaded();

    await initImagery(context, authenticated, version);

    setupOverlaysListeners();
    setupAuthStatusChangeListener(async (authenticated) => {
      await updateImagery(context, authenticated, version);
    });

    // ensure document is focused to listen to keyboard events
    document.body.setAttribute('tabindex', '0');
    document.body.focus();
  });

  restoreiDContainer();
}

main();
