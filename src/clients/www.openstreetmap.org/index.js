import { setupAuthStatusChangeListener } from '../common/auth.js';
import { setupOverlaysListeners } from './overlays.js';
import { refreshTiles } from './tiles.js';

async function main() {
  setupOverlaysListeners();
  setupAuthStatusChangeListener((authenticated) => {
    refreshTiles();
  });
}

main();
