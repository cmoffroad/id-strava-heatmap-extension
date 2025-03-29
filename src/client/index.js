// import {} from './activities.js';
import { observeAuthMeta } from './auth.js';
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
  [
    '.map-controls',
    '.map-panes',
    '.supersurface',
    '.layer-overlay-list',
    'meta[name="strava-heatmap-authenticated"]',
  ],
  (mapControls, mapPanes, supersurfaceElement, overlaysList, metaTag) => {
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

    observeAuthMeta(metaTag, (isAuthenticated) => {
      //updateExistingStravaHeatmapTiles(supersurfaceElement, tileCallback);
    });
  }
);

async function tileCallback(img) {
  const opacity = getSetting('opacity');
  const activity = getSetting('activity');
  const color = getSetting('color');

  img.style.opacity = opacity;
  // img.style.backgroundColor = color;

  img.src = img.src.replace(
    /^\/(.*?)\/(.*?)\/(\d+)\/(\d+)\/(\d+)\.png(.*)$/,
    `/${activity}/${color}/$3/$4/$5.png$6`
  );

  // const newSrc = img.src.replace(
  //   /^https:\/\/([^/]+)\.strava\.com\/anon\/globalheat\/([^/]+)\/([^/]+)\/(\d+)\/(\d+)\/(\d+)\.png(.*)$/,
  //   (match, subdomain, activity, color, z, x, y, query) => {
  //     return `https://${subdomain}.strava.com/identified/globalheat/${activity}/${color}/${z}/${x}/${y}.png${query}`;
  //   }
  // );

  // const imageBlob = await fetch(newSrc, {
  //   method: 'GET', // The request method
  //   // credentials: 'include', // Ensure cookies are sent with the request
  //   mode: 'no-cors',
  // });
  // const imageUrl = URL.createObjectURL(imageBlob);
  // img.src = imageUrl;
}
