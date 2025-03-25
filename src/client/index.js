// import {} from './activities.js';
import { createPaneContent } from './panel.js';
import { initializeColorList } from './colors.js';
import { initializeOpacitySlider } from './opacity.js';
import { getSetting, updateSetting } from './settings.js';
import {
  initializeStravaHeatmapTileObserver,
  updateExistingStravaHeatmapTiles,
} from './tiles.js';
import { onHashChange, setupOverlay, waitForDom } from './utils.js';

waitForDom(
  ['.map-controls', '.map-panes', '.supersurface', '.layer-overlay-list'],
  (mapControls, mapPanes, supersurfaceElement, overlaysList) => {
    const paneContent = createPaneContent(mapControls, mapPanes);

    initializeStravaHeatmapTileObserver(supersurfaceElement, tileCallback);

    // Initialize the opacity slider functionality
    initializeOpacitySlider(paneContent, getSetting('opacity'), (opacity) => {
      updateSetting('opacity', opacity);
      updateExistingStravaHeatmapTiles(supersurfaceElement, tileCallback);
    });

    initializeColorList(paneContent, getSetting('color'), (color) => {
      updateSetting('color', color);
      updateExistingStravaHeatmapTiles(supersurfaceElement, tileCallback);
    });

    window.addEventListener('hashchange', () => onHashChange(paneContent));

    updateExistingStravaHeatmapTiles(supersurfaceElement, tileCallback);

    onHashChange(paneContent);
    setupOverlay(overlaysList);
  }
);

function tileCallback(img) {
  img.style.opacity = getSetting('opacity');
  const activity = getSetting('activity');
  const color = getSetting('color');
  return (img.src = img.src.replace(
    /^https:\/\/heatmap-external-(.*)\.strava\.com\/tiles(.*)\/(.*?)\/(.*?)\/(\d+)\/(\d+)\/(\d+)\.png(.*)$/,
    `https://heatmap-external-$1.strava.com/tiles$2/${activity}/${color}/$5/$6/$7.png$8`
  ));
}
