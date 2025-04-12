(function () {
  console.debug('[StravaHeatmapExt] executing inject-start.js');

  function injectStartScript() {
    try {
      const host = window.location.host;
      const path = `src/clients/${host}/start.js`;
      const script = document.createElement('script');
      script.src = browser.runtime.getURL(path);
      script.type = 'module';
      script.async = false;
      script.onload = () => {
        script.remove();
        console.debug('[StravaHeatmapExt] Injected start script.', path);
      };
      script.onerror = () =>
        console.warn('[StravaHeatmapExt] Failed to inject start script', path);

      // Inject the script as early as possible
      (document.head || document.documentElement).prepend(script);
    } catch (e) {
      console.error('[StravaHeatmapExt] Unexpected error injecting start script:', e);
    }
  }

  injectStartScript();
})();
