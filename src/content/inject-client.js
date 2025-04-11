function injectClientScript() {
  try {
    const host = window.location.host;
    const path = `src/clients/${host}/index.js`;
    const script = document.createElement('script');
    script.src = browser.runtime.getURL(path);
    script.type = 'module';
    script.async = false;
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

function injectClientCSS() {
  try {
    const host = window.location.host;
    const path = `src/clients/${host}/index.css`;
    const href = browser.runtime.getURL(path);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => {
      console.log('[StravaHeatmapExt] Injected client CSS.', path);
    };
    link.onerror = () =>
      console.warn('[StravaHeatmapExt] Failed to inject client CSS', path);

    (document.head || document.documentElement).prepend(link);
  } catch (e) {
    console.error('[StravaHeatmapExt] Unexpected error injecting client CSS:', e);
  }
}

injectClientCSS();
injectClientScript();
