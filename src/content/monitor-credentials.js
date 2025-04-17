(() => {
  console.debug('[StravaHeatmapExt] Setting auth change listener via storage');
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
        console.debug('[StravaHeatmapExt] Broadcasting authenticated change to client');
        window.postMessage(
          { type: 'authStatusChanged', payload: !!newValue },
          window.location.origin
        );
      }
    }
  });
})();
