// import {} from './activities.js';
import { createPaneContent } from './panel.js';
import { initializeColorList } from './colors.js';
import { initializeOpacitySlider } from './opacity.js';
import { getSetting, updateSetting } from './settings.js';
import {
  initializeStravaHeatmapTileObserver,
  updateExistingStravaHeatmapTiles,
} from './tiles.js';
import { onHashChange, toggleOverlay, waitForDom } from './utils.js';

waitForDom('.map-controls', (mapControls) => {
  const paneContent = createPaneContent(
    mapControls,
    document.querySelector('.map-panes')
  );

  waitForDom('.supersurface', (supersurfaceElement) => {
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

    const layer = Array.from(document.querySelector('.layer-overlay-list').children).find(
      (child) => child.innerText === 'Strava Heatmap'
    );

    document.addEventListener('keydown', (event) => {
      if ((event.code === 'KeyS')) {
        layer.click();
      }
    });
  });
});

function tileCallback(img) {
  img.style.opacity = getSetting('opacity');
  const activity = getSetting('activity');
  const color = getSetting('color');
  return (img.src = img.src.replace(
    /^https:\/\/heatmap-external-(.*)\.strava\.com\/tiles(.*)\/(.*?)\/(.*?)\/(\d+)\/(\d+)\/(\d+)\.png(.*)$/,
    `https://heatmap-external-$1.strava.com/tiles$2/${activity}/${color}/$5/$6/$7.png$8`
  ));
}
