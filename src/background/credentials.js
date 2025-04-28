import { clearCookies, fetchCookies } from './cookies.js';
import { updateHeatmapRules } from './rules.js';

const STRAVA_COOKIE_URL = 'https://www.strava.com';
const STRAVA_COOKIE_NAMES = [
  '_strava_idcf',
  'CloudFront-Key-Pair-Id',
  'CloudFront-Policy',
  'CloudFront-Signature',
];

const VALIDATION_TILE_URL =
  'https://content-a.strava.com/identified/globalheat/all/hot/8/198/114.png?v=19';

export async function validateCredentials() {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${VALIDATION_TILE_URL}&t=${Date.now()}`);
      resolve(response.ok ? null : `${response.status}`);
    } catch (error) {
      resolve(error.name);
    }
  });
}

export async function requestCredentials(skipValidation = false) {
  let credentials = await fetchCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  console.debug('[StravaHeatmapExt] Credentials fetched:', credentials);

  const { credentials: storedCredentials } =
    await browser.storage.local.get('credentials');

  if (!credentials && storedCredentials) {
    console.debug('[StravaHeatmapExt] Falling back to stored credentials');
    credentials = storedCredentials;
  }

  const rules = await updateHeatmapRules(credentials);
  console.debug('[StravaHeatmapExt] Heatmap rules updated', rules);

  // Validate credentials by attempting to access a protected tile
  if (credentials && !skipValidation) {
    const error = await validateCredentials();
    if (['403'].includes(error)) {
      await clearCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
      await updateHeatmapRules(null);
      credentials = null;
    }
  }

  // Update local storage only if credentials changed
  if (credentials !== storedCredentials) {
    await browser.storage.local.set({ credentials });
    console.debug('[StravaHeatmapExt] Stored credentials updated', credentials);
  }

  const authenticated = Boolean(credentials);
  updateActionIcon(authenticated);

  return authenticated;
}

export async function resetCredentials() {
  await clearCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  await browser.storage.local.set({
    credentials: null,
  });
  console.debug('[StravaHeatmapExt] Credentials cleared');

  return requestCredentials(true);
}

export async function expireCredentials() {
  const credentials =
    '_strava_idcf=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDUxNDI3NjYsImlhdCI6MTc0NTA1NjM2NiwiYXRobGV0ZUlkIjo5OTcwODM1NSwidGltZXN0YW1wIjoxNzQ1MDU2MzY2fQ.cm-dbxMcuT6-nX8quL-5J0P6HdalxZp7yZxscf2T7MM; CloudFront-Key-Pair-Id=K3VK9UFQYD04PI; CloudFront-Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vKmNvbnRlbnQtKi5zdHJhdmEuY29tL2lkZW50aWZpZWQvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc0NTE0Mjc2Nn19fV19; CloudFront-Signature=Cc3~gm4FZxsm~nFuYzXqOibwSi4dPhseKq5hY3fkbGpXUcykPWD82u6CgPp3E9ZjHBz7Sdz0K2vdtup9Btf6FPPjH212TUw4XyYm14G9xSW5hDgDP-p4XTNL6-LXSobaO8Meri3WEAIXi9RezSVgsYS4r6M9OXXwYjFisq4kXfF6xbrPuUsK5mEqlFvBpDLYP84MkRsSMogD6SWY8gpD0wKWoZpgh03HyoyDmary7cgm6LXnTU9pjxcziM4OkMQ4Q-rBAGBRtwmhQ18mIzawTKjxLjytT621fRHUaSBUzmT1t2DTosxpiPlCw8EyUlczkWc5kxphwxgxpstqN7f9vg__';
  await clearCookies(STRAVA_COOKIE_URL, STRAVA_COOKIE_NAMES);
  await browser.storage.local.set({
    credentials,
  });
  return requestCredentials(true);
}

async function updateActionIcon(authenticated) {
  const title = authenticated
    ? '🟢 Strava Heatmap ON:\n\nEnable an overlay to view it.'
    : `🔴 Strava Heatmap OFF:\n\nClick here to log into Strava and view the heatmap.`;

  const color = authenticated ? 'green' : 'red';
  const text = '󠀠';

  await browser.action.setTitle({ title });
  await browser.action.setBadgeBackgroundColor({ color });
  await browser.action.setBadgeText({ text });

  if (authenticated) {
    await browser.action.setPopup({
      popup: 'src/background/popups/settings.html',
    });
  } else {
    await browser.action.setPopup({ popup: '' });
  }
}
