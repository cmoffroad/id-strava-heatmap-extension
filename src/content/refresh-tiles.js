(() => {
  console.debug('[StravaHeatmapExt] Setting up storage change listener');
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
        console.debug(
          '[StravaHeatmapExt] Triggering tile refresh due to authenticated change'
        );
        window.postMessage({ type: 'REFRESH_TILES' }, window.location.origin);
      }
    }
  });
})();
