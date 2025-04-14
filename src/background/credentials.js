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

  return processCredentials(credentials);
}

export async function resetCredentials() {
  const credentials = await clearCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  console.debug('[StravaHeatmapExt] Credentials cleared');

  return processCredentials(credentials);
}

async function processCredentials(credentials) {
  const authenticated = credentials !== null;
  const previousAuthenticated = await browser.storage.local.get('authenticated');
  if (authenticated != previousAuthenticated) {
    await browser.storage.local.set({ authenticated });
    console.debug('[StravaHeatmapExt] Set authenticated to:', authenticated);

    const rules = await updateHeatmapRules(credentials);
    console.debug('[StravaHeatmapExt] Heatmap rules updated', rules);
  } else {
    console.debug('[StravaHeatmapExt] Autentication status unchanged', authenticated);
  }
  return authenticated;
}
