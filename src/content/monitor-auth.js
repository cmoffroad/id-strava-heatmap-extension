(() => {
  console.debug('[StravaHeatmapExt] Setting auth change listener via storage');
  browser.storage.onChanged.addListener((changes, area) => {
    console.debug('[StravaHeatmapExt] Storage change detected in', area, ':', changes);
    if (area === 'local' && 'authenticated' in changes) {
      const { oldValue, newValue } = changes.authenticated;
      console.debug(
        '[StravaHeatmapExt] Authenticated changed from',
        oldValue,
        'to',
        newValue
      );
      if (oldValue !== newValue) {
        console.debug('[StravaHeatmapExt] Broadcasting authenticated change to client');
        window.postMessage(
          { type: 'authStatusChanged', payload: newValue },
          window.location.origin
        );
      }
    }
  });
})();
