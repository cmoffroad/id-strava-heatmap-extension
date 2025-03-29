async function fetchCookie(url, name) {
  try {
    const cookie = await browser.cookies.get({ url, name });
    return cookie?.value &&
      (!cookie.expirationDate || cookie.expirationDate > Date.now() / 1000)
      ? cookie.value
      : null;
  } catch (error) {
    console.error(`Error fetching cookie "${name}" for ${url}:`, error);
    return null;
  }
}

export async function fetchCookies(url, cookieNames) {
  const cookies = await Promise.all(
    cookieNames.map(async (name) => [name, await fetchCookie(url, name)])
  );

  // Check if all cookies are missing
  if (cookies.every(([, value]) => value === null)) return null;

  // If some are missing, log an error and return null
  if (!cookies.every(([, value]) => value)) {
    console.error('Some required cookies are missing:', Object.fromEntries(cookies));
    return null;
  }

  // Return cookies as a formatted string
  return cookies.map(([name, value]) => `${name}=${value}`).join('; ');
}

async function clearCookie(url, name) {
  try {
    return await browser.cookies.remove({ url, name });
  } catch (error) {
    console.error(`Error clearing cookie "${name}" for ${url}:`, error);
    return null;
  }
}

export async function clearCookies(url, cookieNames) {
  try {
    await Promise.all(cookieNames.map((name) => clearCookie(url, name)));
    console.log(`Cookies for ${url} cleared successfully.`);
  } catch (error) {
    console.error(`Error clearing cookies for ${url}:`, error);
  }
}
