import { setupOverlaysListeners } from './overlays.js';
import { setupRefreshTilesListener } from './tiles.js';

async function main() {
  setupOverlaysListeners();
  setupRefreshTilesListener();
}

main();
