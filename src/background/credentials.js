import { getStravaCookie, clearStravaCookie } from './cookies.js';
import { updateRequestRules } from './rules.js';

const COOKIE_NAMES = [
  'CloudFront-Key-Pair-Id',
  'CloudFront-Policy',
  'CloudFront-Signature',
];

let stravaCredentials = null;

async function fetchStravaCredentials() {
  const credentials = Object.fromEntries(
    await Promise.all(
      COOKIE_NAMES.map(async (name) => [name, await getStravaCookie(name)])
    )
  );
  if (Object.values(credentials).some((value) => !value)) {
    return null;
  }
  return credentials;
}

export async function requestStravaCredentials(force = false) {
  const newStravaCredentials = await fetchStravaCredentials();
  if (
    force ||
    JSON.stringify(newStravaCredentials) !== JSON.stringify(stravaCredentials)
  ) {
    await updateRequestRules(newStravaCredentials);
    stravaCredentials = newStravaCredentials;
  }
}

export async function clearStravaCredentials() {
  await Promise.all(COOKIE_NAMES.map(clearStravaCookie));
  await updateRequestRules(null);
  stravaCredentials = null;
}

export async function isUserAuthenticated() {
  return stravaCredentials !== null;
}
