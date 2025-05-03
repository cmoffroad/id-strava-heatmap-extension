export async function watchTiles(callback, urls, reasons, cooldown) {
  let lastErrorTime = 0;

  async function maybeTrigger(tabId, url, reason) {
    if (tabId === -1) return;
    const now = Date.now();
    if (now - lastErrorTime > cooldown) {
      lastErrorTime = now;
      await callback(tabId, url, reason);
    }
  }

  function handleDetails(details, key) {
    if (details.type === 'image' && reasons.includes(details[key])) {
      maybeTrigger(details.tabId, details.url, details[key]);
    }
  }

  browser.webRequest.onCompleted.addListener(
    (details) => handleDetails(details, 'statusCode'),
    { urls }
  );

  browser.webRequest.onErrorOccurred.addListener(
    (details) => handleDetails(details, 'error'),
    { urls }
  );
}
