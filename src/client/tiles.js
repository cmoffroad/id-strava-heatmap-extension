// Initialize the observer to monitor for `div.layer.layer-overlay` elements and their children
export function initializeStravaHeatmapTileObserver(callback) {
  // Get the supersurface element
  const supersurface = document.querySelector('.supersurface');

  // Check if supersurface exists
  if (!supersurface) {
    console.error('Supersurface element not found');
    return;
  }

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
  observer.observe(supersurface, { childList: true, subtree: true });
}

// Update opacity for all existing and future heatmap tiles
export function updateExistingStravaHeatmapTiles(callback) {
  const supersurface = document.querySelector('.supersurface');
  const images = supersurface.querySelectorAll('img.tile[src*="strava.com/tiles"]');
  images.forEach((img) => {
    callback(img);
  });
}
