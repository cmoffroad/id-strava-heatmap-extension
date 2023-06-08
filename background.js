async function getStravaHeatmapCookie(name) {
  const cookie = await browser.cookies.get({
    url: 'https://www.strava.com/heatmap',
    name: name,
  });
  return cookie?.value;
}

async function getStravaHeatmapCredentials() {
  const keyPairId = await getStravaHeatmapCookie('CloudFront-Key-Pair-Id');
  const policy    = await getStravaHeatmapCookie('CloudFront-Policy');
  const signature = await getStravaHeatmapCookie('CloudFront-Signature');

  const credentials = { keyPairId, policy, signature };
  const error = !keyPairId || !policy || !signature;

  return { error, credentials };
}

browser.runtime.onMessage.addListener(async function(message) {
  if (message.name === 'requestStravaCredentials')
    return getStravaHeatmapCredentials();
});