(() => {
  console.debug('[StravaHeatmapExt] Setting auth change listener via storage');
  browser.storage.onChanged.addListener((changes, area) => {
    console.debug('[StravaHeatmapExt] Storage change detected in', area, ':', changes);
    if (area === 'local' && 'credentials' in changes) {
      const { oldValue, newValue } = changes.credentials;
      console.debug(
        '[StravaHeatmapExt] Authenticated changed from',
        oldValue,
        'to',
        newValue
      );
      console.debug('[StravaHeatmapExt] Broadcasting authenticated change to client');
      window.postMessage(
        { type: 'authStatusChanged', payload: newValue },
        window.location.origin
      );
    }
  });
})();
