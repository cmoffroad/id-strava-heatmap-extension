const STRAVA_URL = 'https://www.strava.com/heatmap';

export async function clearStravaCookie(name) {
  return browser.cookies.remove({ name, url: STRAVA_URL });
}

export async function getStravaCookie(name) {
  try {
    const cookie = await browser.cookies.get({ url: STRAVA_URL, name });
    if (!cookie || !cookie.value) return null;
    const { expirationDate, value } = cookie;
    return expirationDate && expirationDate <= Date.now() / 1000 ? null : value;
  } catch (error) {
    console.error(`Error getting cookie "${name}":`, error);
    return null;
  }
}
