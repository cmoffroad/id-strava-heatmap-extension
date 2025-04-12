export function getHashParams(url) {
  return new URLSearchParams(new URL(url).hash.slice(1));
}

export function addHashChangeListener(callbackFn) {
  window.addEventListener('hashchange', ({ oldURL, newURL }) => {
    callbackFn(getHashParams(oldURL), getHashParams(newURL));
  });
}
