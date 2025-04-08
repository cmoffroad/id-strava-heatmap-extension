(function () {
  // Make the injectClientScript function accessible globally
  window.injectClientScript = function (relativePath) {
    if (!relativePath) {
      console.warn('[SH] No path provided to injectClientScript');
      return;
    }
    const script = document.createElement('script');
    script.src = browser.runtime.getURL(relativePath);
    script.type = 'module';
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  };
})();
