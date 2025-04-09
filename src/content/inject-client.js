function injectClientScript() {
  try {
    const host = window.location.host;
    const path = `src/clients/${host}/index.js`;
    const script = document.createElement('script');
    script.src = browser.runtime.getURL(path);
    script.type = 'module';
    script.onload = () => {
      script.remove();
      console.log('[StravaHeatmapExt] Injected client script.', path);
    };
    script.onerror = () =>
      console.warn('[StravaHeatmapExt] Failed to inject client script', path);
    (document.head || document.documentElement).appendChild(script);
  } catch (e) {
    console.error('[StravaHeatmapExt] Unexpected error injecting client script:', e);
  }
}

injectClientScript();
