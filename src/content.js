// inject script
const script = document.createElement('script');
script.src = browser.runtime.getURL('src/inject.js');
script.onload = () => script.remove(); // Removes after execution
(document.head || document.documentElement).appendChild(script);

// check for updates availables and notify user
browser.runtime.sendMessage('checkForUpdate').catch((error) => {
  console.error('Failed to send message:', error);
});

// request Strava Credentials
browser.runtime.sendMessage('requestStravaCredentials').catch((error) => {
  console.error('Failed to send message:', error);
});
