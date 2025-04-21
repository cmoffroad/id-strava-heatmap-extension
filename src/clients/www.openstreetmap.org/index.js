import { setupAuthStatusChangeListener } from '../common/auth.js';
import { setupHeatmapFallbackClickListener } from '../common/layers.js';
import { restoreiDContainer, setupiDCoreContextListener } from './id.js';
import { initImagery, updateImagery } from './imagery.js';
import { setupOverlaysListeners } from './overlays.js';

async function main() {
  const authenticated =
    document.querySelector('script[data-authenticated]').dataset.authenticated === 'true';

  setupiDCoreContextListener(async (context) => {
    window.context = context; // DEBUG
    console.log(
      '[StravaHeatmapExt] iD context initialization callback triggered',
      context
    );

    // make sure ui fully loaded
    await context.ui().ensureLoaded();

    await initImagery(context, authenticated);

    setupOverlaysListeners();
    setupAuthStatusChangeListener(async (authenticated) => {
      await updateImagery(context, authenticated);
    });

    document.body.setAttribute('tabindex', '0');
    document.body.focus();
  });

  restoreiDContainer();
}

main();
