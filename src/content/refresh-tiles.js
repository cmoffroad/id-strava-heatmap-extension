(() => {
  const refreshLocalTiles = () => {
    console.debug('[StravaHeatmapExt] Starting tile refresh');
    const tiles = document.querySelectorAll('img[src*="strava.com"]');
    tiles.forEach((tile) => {
      tile.src = tile.src;
    });
    console.debug(`[StravaHeatmapExt] Refreshed ${tiles.length} local tiles`);
  };

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
        refreshLocalTiles();
      }
    }
  });
})();
