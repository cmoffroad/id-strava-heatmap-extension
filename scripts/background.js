import "./browser-polyfill.min.js";

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
  if (expirationDate && expirationDate <= nowInSeconds) {
    return null;
  }
  else if (value === undefined) {
    return null;
  }
  else {
    return value;
  }
}

async function requestStravaCredentials() {
  const url = 'https://www.strava.com/heatmap';
  const keyPairId = await getStravaCookie('CloudFront-Key-Pair-Id');
  const policy    = await getStravaCookie('CloudFront-Policy');
  const signature = await getStravaCookie('CloudFront-Signature');

  const error = !keyPairId || !policy || !signature;
  const credentials = error ? null : { keyPairId, policy, signature };

  browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ 1, 2 ],
    addRules: credentials ? [
      {
        id: 2,
        priority: 2,
        condition: {
          regexFilter: "^https://heatmap-external-(.*).strava.com/tiles/(.*)/(.*)/(.*)/(.*)/(.*).png\??(.*)",
          resourceTypes: ['main_frame', 'sub_frame', 'image'],
        },
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: `https://heatmap-external-\\1.strava.com/tiles-auth/\\2/\\3/\\4/\\5/\\6.png?Key-Pair-Id=${keyPairId}&Policy=${policy}&Signature=${signature}`
          },
        }
      }, {
        id: 1,
        priority: 1,
        condition: {
          regexFilter: "^https://heatmap-external-(.*).strava.com/tiles",
          resourceTypes: ['main_frame', 'sub_frame', 'image'],
        },
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            { "header": "Referer", "operation": "set", value: "https://www.openstreetmap.org/" },
            { "header": "Access-Control-Allow-Origin", "operation": "set", "value": "*" }
          ]
        }
      }
    ] : []
  });

  stravaCredentials = credentials;
}

async function clearStravaCredentials() {
  await clearStravaCookie('CloudFront-Key-Pair-Id');
  await clearStravaCookie('CloudFront-Policy');
  await clearStravaCookie('CloudFront-Signature');

  browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ 1 ]
  });

  stravaCredentials = null;
}

browser.runtime.onMessage.addListener(async function(message) {
  if (message === 'requestStravaCredentials')
    return requestStravaCredentials();
  if (message === 'clearStravaCredentials')
    return clearStravaCredentials();
});

requestStravaCredentials();