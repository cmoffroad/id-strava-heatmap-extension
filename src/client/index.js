import { setupOverlay } from './overlay.js';
import { waitForDom } from './utils.js';

waitForDom(['.layer-overlay-list'], (overlaysList) => {
  setupOverlay(overlaysList);
});
