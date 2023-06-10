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

async function getStravaCredentials() {
  const url = 'https://www.strava.com/heatmap';
  const keyPairId = await getStravaCookie('CloudFront-Key-Pair-Id');
  const policy    = await getStravaCookie('CloudFront-Policy');
  const signature = await getStravaCookie('CloudFront-Signature');

  const error = !keyPairId || !policy || !signature;
  const credentials = error ? null : { keyPairId, policy, signature };

  return { error, credentials };
}

async function clearStravaCredentials() {
  await clearStravaCookie('CloudFront-Key-Pair-Id');
  await clearStravaCookie('CloudFront-Policy');
  await clearStravaCookie('CloudFront-Signature');

  // const cookies = await browser.cookies.getAll({domain: ".strava.com"});
  // await Promise.all(
  //   cookies.map(({ path, name }) => {
  //     chrome.cookies.remove({ name, url: `https://www.strava.com${path}` });
  //   })
  // );
}


browser.runtime.onMessage.addListener(async function(message) {
  // const cookies = await browser.cookies.getAll({domain: ".strava.com"});
  // console.log(cookies)

  if (message.name === 'requestStravaCredentials')
    return getStravaCredentials();
  if (message.name === 'clearStravaCredentials')
    return clearStravaCredentials();
});