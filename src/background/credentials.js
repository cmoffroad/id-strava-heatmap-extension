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
  let credentials = await fetchCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  console.debug('[StravaHeatmapExt] Credentials fetched:', credentials);

  const { credentials: oldCredentials } = await browser.storage.local.get('credentials');

  if (!credentials && oldCredentials) {
    try {
      const response = await fetch(
        'https://content-a.strava.com/identified/globalheat/all/hot/8/198/114.png?v=19'
      );

      if (response.status === 403 || !response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      credentials = oldCredentials; // fallback to old creds if tile request succeeds
    } catch (error) {
      console.warn(
        '[StravaHeatmapExt] Failed to validate access, clearing stored credentials:',
        error
      );
    }
  }

  return processCredentials(credentials);
}

export async function resetCredentials() {
  await clearCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  console.debug('[StravaHeatmapExt] Credentials cleared');

  return processCredentials(null);
}

async function processCredentials(credentials) {
  await browser.storage.local.set({ credentials });
  console.debug('[StravaHeatmapExt] Storage credentials updated', credentials);

  const authenticated = credentials !== null;
  const rules = await updateHeatmapRules(credentials);
  console.debug('[StravaHeatmapExt] Heatmap rules updated', rules);

  await browser.action.setBadgeText({ text: '󠀠' });
  await browser.action.setTitle({
    title: authenticated
      ? 'Strava Heatmap ON — enable an overlay to view it'
      : 'Strava Heatmap OFF — log in to Strava to view the heatmap',
  });
  await browser.action.setBadgeBackgroundColor({
    color: authenticated ? 'green' : 'red',
  });

  return authenticated;
}
