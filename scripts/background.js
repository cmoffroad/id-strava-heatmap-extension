// import "scripts/browser-polyfill.min.js";

let stravaCredentials = null;

async function clearStravaCookie(name) {
  return browser.cookies.remove({ name, url: `https://www.strava.com/heatmap` });
}

async function getStravaCookie(name) {
  const cookie = await browser.cookies.get({
    url: 'https://www.strava.com/heatmap',
    name: name,
  });
  if (!cookie)
    return null;

  const { expirationDate, value } = cookie;
  const nowInSeconds = Date.now() / 1000;
  if (expirationDate && expirationDate <= nowInSeconds)
    return null;
  if (value === undefined)
    return null;
  else
    return value;
}

async function requestStravaCredentials() {
  const url = 'https://www.strava.com/heatmap';
  const keyPairId = await getStravaCookie('CloudFront-Key-Pair-Id');
  const policy    = await getStravaCookie('CloudFront-Policy');
  const signature = await getStravaCookie('CloudFront-Signature');

  const error = !keyPairId || !policy || !signature;
  const credentials = error ? null : { keyPairId, policy, signature };

  stravaCredentials = credentials;
}

async function clearStravaCredentials() {
  await clearStravaCookie('CloudFront-Key-Pair-Id');
  await clearStravaCookie('CloudFront-Policy');
  await clearStravaCookie('CloudFront-Signature');

  stravaCredentials = null;
}

browser.runtime.onMessage.addListener(async function(message) {
  if (message === 'requestStravaCredentials')
    return requestStravaCredentials();
  if (message === 'clearStravaCredentials')
    return clearStravaCredentials();
});

browser.webRequest.onBeforeRequest.addListener(
  function (info) {
    let redirectUrl = info.url;

    if (stravaCredentials) {
      const { keyPairId, policy, signature } = stravaCredentials;
      const url = new URL(info.url);
      redirectUrl = url.origin 
        + url.pathname.replace('tiles', 'tiles-auth') 
        + `?Key-Pair-Id=${keyPairId}&Policy=${policy}&Signature=${signature}` 
        + (url.search ? `&${url.search}` : '');
    }
    return { redirectUrl };
  },
  {
    urls: [ 
      'https://*.strava.com/tiles/*' 
    ],
    types: [ 
      'image', 
      'main_frame'
    ]
  },
  [
    'blocking'
  ]
);