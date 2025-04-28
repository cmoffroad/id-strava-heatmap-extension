export async function watchTileErrors(callback) {
  const urls = ['*://*.strava.com/identified/globalheat/*/*/*.png*'],
    cooldown = 10000;

  let lastErrorTime = 0;

  async function maybeTrigger(tabId, url, reason) {
    const now = Date.now();
    if (now - lastErrorTime > cooldown) {
      if (await callback(tabId, url, reason)) {
        lastErrorTime = now;
      }
    }
  }

  browser.webRequest.onCompleted.addListener(
    (details) => {
      if (details.type === 'image' && details.statusCode !== 200) {
        maybeTrigger(details.tabId, details.url, `${details.statusCode}`);
      }
    },
    { urls }
  );

  browser.webRequest.onErrorOccurred.addListener(
    (details) => {
      if (details.type === 'image') {
        maybeTrigger(details.tabId, details.url, details.error);
      }
    },
    { urls }
  );
}

export async function watchTileFallback(callback, cooldown = 30000) {
  const urls = [
    '*://*.githubusercontent.com/cmoffroad/id-strava-heatmap-extension/refs/heads/*/assets/heatmap-fallback.png*',
  ];

  let lastDetectionTime = 0;

  async function maybeTrigger(tabId, url, reason) {
    const now = Date.now();
    if (now - lastDetectionTime > cooldown) {
      if (await callback(tabId, url, reason)) {
        lastDetectionTime = now;
      }
    }
  }

  browser.webRequest.onCompleted.addListener(
    (details) => {
      if (details.type === 'image' && details.statusCode === 200) {
        maybeTrigger(details.tabId, details.url, `${details.statusCode}`);
      }
    },
    { urls }
  );
}
