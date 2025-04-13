import { clearCookies, fetchCookies } from './cookies.js';
import { updateHeatmapRules } from './rules.js';

const STRAVA_COOKIE_URL = 'https://www.strava.com';
const STRAVA_COOKIE_NAMES = [
  '_strava_idcf',
  'CloudFront-Key-Pair-Id',
  'CloudFront-Policy',
  'CloudFront-Signature',
];

export async function requestCredentials() {
  const credentials = await fetchCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  console.debug('[StravaHeatmapExt] Credentials fetched:', credentials);

  const authenticated = credentials !== null;
  await browser.storage.local.set({ authenticated });
  console.debug('[StravaHeatmapExt] Set authenticated to:', authenticated);

  const rules = await updateHeatmapRules(credentials);
  console.debug('[StravaHeatmapExt] Heatmap rules updated', rules);
  return authenticated;
}

export async function resetCredentials() {
  await clearCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  console.debug('[StravaHeatmapExt] Credentials cleared');

  await browser.storage.local.set({ authenticated: false });
  console.debug('[StravaHeatmapExt] Set authenticated to: false');

  const rules = await updateHeatmapRules(null);
  console.debug('[StravaHeatmapExt] Heatmap rules reset', rules);
}
