// import {} from './activities.js';
import { createPaneContent } from './control.js';
import { initializeColorList } from './colors.js';
import { initializeOpacitySlider } from './opacity.js';
import {
  initializeStravaHeatmapTileObserver,
  updateExistingStravaHeatmapTiles,
} from './tiles.js';
import { waitForDom } from './utils.js';

const settings = {
  opacity: 0.5,
  color: 'hot',
  activity: 'all',
};

waitForDom('.map-controls', (mapControls) => {
  const paneContent = createPaneContent(
    mapControls,
    document.querySelector('.map-panes')
  );

  // Call this function to initialize the observer once the page is loaded
  initializeStravaHeatmapTileObserver(tileCallback);

  // Initialize the opacity slider functionality
  initializeOpacitySlider(paneContent, settings.opacity, (opacity) => {
    settings.opacity = opacity;
    updateExistingStravaHeatmapTiles(tileCallback);
  });

  initializeColorList(paneContent, settings.color, (color) => {
    settings.color = color;
    updateExistingStravaHeatmapTiles(tileCallback);
  });
});

function tileCallback(img) {
  img.style.opacity = settings.opacity;
  return (img.src = img.src.replace(
    /^https:\/\/heatmap-external-(.*)\.strava\.com\/tiles(.*)\/(.*?)\/(.*?)\/(\d+)\/(\d+)\/(\d+)\.png/,
    `https://heatmap-external-$1.strava.com/tiles$2/${settings.activity}/${settings.color}/$5/$6/$7.png`
  ));
}
