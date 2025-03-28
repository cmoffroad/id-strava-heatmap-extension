// inject script
function injectClientScript() {
  const script = document.createElement('script');
  script.src = browser.runtime.getURL('src/client/index.js');
  script.type = 'module'; // Specify it as a module
  script.onload = () => script.remove(); // Removes after execution
  (document.head || document.documentElement).appendChild(script);
}

function injectOrUpdateAuthStatus(loggedIn) {
  let metaTag = document.querySelector('meta[name="strava-heatmap-authenticated"]');

  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.name = 'strava-heatmap-authenticated';
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute('content', loggedIn ? 'true' : 'false');

  // Dispatch a custom event so the client script can listen for changes
  const event = new Event('stravaAuthChanged');
  metaTag.dispatchEvent(event);
}

async function checkStravaAuth() {
  const isAuthenticated = await browser.runtime.sendMessage('requestStravaCredentials');
  injectOrUpdateAuthStatus(isAuthenticated);
}

// chrome.runtime.onMessage.addListener((message) => {
//   switch (message) {
//     case 'isUserLoggedIn':
//       return injectOrUpdateAuthStatus(true);
//     case 'isUserLoggedOut':
//       return injectOrUpdateAuthStatus(false);
//     default:
//       return null;
//   }
// });

async function main() {
  injectClientScript();

  // Initial check
  await checkStravaAuth();

  // Periodically check for changes (in case of logout/login)
  // setInterval(checkStravaAuth, 5000);
}

main();
