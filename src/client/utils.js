export function waitForDom(selectors, callback) {
  if (!Array.isArray(selectors)) {
    selectors = [selectors]; // Ensure it's an array
  }

  const observer = new MutationObserver(() => {
    const elements = selectors.map((selector) => document.querySelector(selector));

    if (elements.every((el) => el)) {
      observer.disconnect(); // Stop observing once all elements are found
      callback(...elements);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check in case elements are already present
  const elements = selectors.map((selector) => document.querySelector(selector));
  if (elements.every((el) => el)) {
    observer.disconnect();
    callback(...elements);
  }
}

export function onHashChange(paneContent) {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const overlays = hashParams.get('overlays')?.split(',') || [];
  const disabled = !overlays.includes('strava-heatmap');
  paneContent.querySelectorAll('input').forEach((input) => (input.disabled = disabled));
}

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
