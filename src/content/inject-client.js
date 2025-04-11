function injectClientScript() {
  try {
    const host = window.location.host;
    const path = `src/clients/${host}.js`;
    const script = document.createElement('script');
    script.src = browser.runtime.getURL(path);
    script.type = 'module';
    script.async = true; // Ensure the script loads asynchronously to avoid blocking page load
    script.onload = () => {
      script.remove();
      console.log('[StravaHeatmapExt] Injected client script.', path);
    };
    script.onerror = () =>
      console.warn('[StravaHeatmapExt] Failed to inject client script', path);

    // Inject the script as early as possible
    (document.head || document.documentElement).prepend(script);
  } catch (e) {
    console.error('[StravaHeatmapExt] Unexpected error injecting client script:', e);
  }
}

injectClientScript();
