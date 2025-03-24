// Initialize the observer to monitor for `div.layer.layer-overlay` elements and their children
export function initializeStravaHeatmapTileObserver(supersurfaceElement, callback) {
  // Create an intersection observer to track changes in the supersurface element
  const observer = new MutationObserver((mutationsList) => {
    // Iterate over each mutation
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeName === 'IMG' &&
            node.classList.contains('tile') &&
            node.src.includes('strava.com/tiles')
          ) {
            callback(node);
          }
        });
      }
    });
  });

  // Set up the observer to watch for child list changes in supersurface
  observer.observe(supersurfaceElement, { childList: true, subtree: true });
}

// Update opacity for all existing and future heatmap tiles
export function updateExistingStravaHeatmapTiles(supersurfaceElement, callback) {
  const images = supersurfaceElement.querySelectorAll(
    'img.tile[src*="strava.com/tiles"]'
  );
  images.forEach((img) => {
    callback(img);
  });
}
