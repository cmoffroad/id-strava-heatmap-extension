(async function () {
  console.debug('[StravaHeatmapExt] executing content/monitor-credentials.js');

  function watchCredentialsStorage(callback) {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && 'credentials' in changes) {
        const { oldValue, newValue } = changes.credentials;
        if (newValue != oldValue) {
          console.debug(
            '[StravaHeatmapExt] Credentials changed from',
            oldValue,
            'to',
            newValue
          );
          callback(newValue, oldValue);
        }
      }
    });
  }

  watchCredentialsStorage((newValue, oldValue) => {
    console.debug('[StravaHeatmapExt] Broadcasting authenticated change to client');
    window.postMessage(
      { type: 'authStatusChanged', payload: !!newValue },
      window.location.origin
    );
  });
})();
