import "./browser-polyfill.min.js";

async function clearStravaCookie (name) {
  return browser.cookies.remove({
    url: `https://www.strava.com/heatmap`,
    name
  });
}

async function getStravaCookie (name) {
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

async function clearCredentials() {
  await clearStravaCookie('CloudFront-Key-Pair-Id');
  await clearStravaCookie('CloudFront-Policy');
  await clearStravaCookie('CloudFront-Signature');
}

async function getCredentials () {
  const keyPairId = await getStravaCookie('CloudFront-Key-Pair-Id');
  const policy    = await getStravaCookie('CloudFront-Policy');
  const signature = await getStravaCookie('CloudFront-Signature');

  const error = !keyPairId || !policy || !signature;
  const credentials = error ? null : { keyPairId, policy, signature };

  if (error) {
    await clearCredentials();
  }

  return credentials;
}

async function getSettings () {
  const settings = await browser.storage.sync.get({
    color: 'hot',
    activity: 'all',
    opacity: 100,
    ts: Date.now()
  })
  return settings;
}

async function updateRules (credentials, settings) {
  const { color, activity, ts } = settings;
  const { keyPairId, policy, signature } = credentials;

  const updatedRules = browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ 1 ],
    addRules: credentials ? [
      {
        id: 1,
        priority: 1,
        condition: {
          regexFilter: "^https://heatmap-external-(.*).strava.com/tiles(-auth)?/(.*)/(.*)/(.*)/(.*)/(.*).png\??(.*)",
          resourceTypes: ['main_frame', 'sub_frame', 'image'],
        },
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: `https://heatmap-external-\\1.strava.com/tiles-auth/${activity}/${color}/\\5/\\6/\\7.png?Key-Pair-Id=${keyPairId}&Policy=${policy}&Signature=${signature}&ts=${ts}`
          },
        }
      }
    ] : []
  });
  return updatedRules;
}

async function updateSettings(tabsQuery) {
  const tabs = await browser.tabs.query(tabsQuery || {});
  const credentials = await getCredentials();
  const settings = await getSettings();
  const rules = await updateRules(credentials, settings);

  for (const tab of tabs) {
    browser.tabs.sendMessage(tab.id, { settings })
  }
}

async function requestSettings() {
  updateSettings({ currentWindow: true, active: true })
}

browser.runtime.onMessage.addListener(async function(message) {
  if (message === 'requestSettings')
    return requestSettings();
  if (message === 'updateSettings')
    return updateSettings();
  if (message === 'getCredentials')
    return getCredentials();
  if (message === 'clearCredentials')
    return clearCredentials();
});

//requestStravaCredentials();