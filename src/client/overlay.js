export function setupOverlay(overlaysList) {
  const observer = new MutationObserver(() => {
    const layer = Array.from(overlaysList.children)
      .find((child) => child.innerText.includes('Strava Heatmap')) // Use `includes` for flexibility
      ?.querySelector('input[type="checkbox"]'); // Optional chaining to prevent errors

    if (layer) {
      console.log('Strava Heatmap found! Stopping observer.');
      observer.disconnect(); // Stop observing once found

      document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyS' && event.altKey) {
          layer.click();
        }
      });
    }
  });

  // Start observing child elements of overlaysList
  observer.observe(overlaysList, { childList: true, subtree: true });
}
