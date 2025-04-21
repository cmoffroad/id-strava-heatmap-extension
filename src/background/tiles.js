export async function watchTileErrors(callback) {
  const urls = ['*://*.strava.com/identified/globalheat/*/*/*.png*'],
    cooldown = 10000;

  let lastErrorTime = 0;

  async function maybeTrigger(url, reason) {
    const now = Date.now();
    if (now - lastErrorTime > cooldown) {
      if (await callback(url, reason)) {
        lastErrorTime = now;
      }
    }
  }

  browser.webRequest.onCompleted.addListener(
    (details) => {
      if (details.type === 'image' && details.statusCode !== 200) {
        maybeTrigger(details.url, `${details.statusCode}`);
      }
    },
    { urls }
  );

  browser.webRequest.onErrorOccurred.addListener(
    (details) => {
      if (details.type === 'image') {
        maybeTrigger(details.url, details.error);
      }
    },
    { urls }
  );
}
