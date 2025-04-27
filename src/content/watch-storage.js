(async function () {
  console.debug('[StravaHeatmapExt] executing content/watch-storage.js');

  function watchStorage(target, property, callback) {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === target && property in changes) {
        const { oldValue, newValue } = changes[property];
        if (newValue != oldValue) {
          console.debug(
            `[StravaHeatmapExt] ${target} storage '${property}' changed from`,
            oldValue,
            'to',
            newValue
          );
          callback(newValue, oldValue);
        }
      }
    });
  }

  watchStorage('local', 'credentials', (newValue, oldValue) => {
    console.debug('[StravaHeatmapExt] Broadcasting authenticated change to client');
    window.postMessage(
      { type: 'authStatusChanged', payload: !!newValue },
      window.location.origin
    );
  });

  watchStorage('local', 'layers', (newValue, oldValue) => {
    console.debug('[StravaHeatmapExt] Broadcasting layer presets change to client');
    window.postMessage(
      { type: 'layerPresetsChanged', payload: newValue },
      window.location.origin
    );
  });
})();
