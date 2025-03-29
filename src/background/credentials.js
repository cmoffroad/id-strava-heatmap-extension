const STRAVA_COOKIE_URL = 'https://www.strava.com';
const STRAVA_COOKIE_NAMES = [
  '_strava_idcf',
  'CloudFront-Key-Pair-Id',
  'CloudFront-Policy',
  'CloudFront-Signature',
];

export async function requestCredentials() {
  const credentials = await fetchCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  await updateHeatmapRules(credentials);
  return credentials !== null;
}

export async function resetCredentials() {
  await clearCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  await updateHeatmapRules(null);
}
