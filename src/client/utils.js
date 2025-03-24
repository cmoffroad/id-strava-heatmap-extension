export function waitForDom(selector, callback) {
  const observer = new MutationObserver((mutationsList, observer) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect(); // Stop observing once found
      callback(element);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export function onHashChange(paneContent) {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const overlays = hashParams.get('overlays')?.split(',') || [];
  const disabled = !overlays.includes('strava-heatmap');
  paneContent.querySelectorAll('input').forEach((input) => (input.disabled = disabled));
}

export function toggleOverlay() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const overlays = hashParams.get('overlays')?.split(',') || [];
  const index = overlays.indexOf('strava-heatmap');
  if (index !== -1) {
    overlays.splice(index, 1);
  } else {
    overlays.push('strava-heatmap');
  }
  if (overlays.length) {
    hashParams.set('overlays', overlays.join(','));
  } else {
    hashParams.delete('overlays');
  }
  // history.pushState({ hash: `#${hashParams.toString()}` }, '');
  window.location.hash = `#${hashParams.toString()}`;
}
