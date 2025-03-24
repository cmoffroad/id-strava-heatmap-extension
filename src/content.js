// inject script
const script = document.createElement('script');
script.src = browser.runtime.getURL('src/client/index.js');
script.type = 'module'; // Specify it as a module
script.onload = () => script.remove(); // Removes after execution
(document.head || document.documentElement).appendChild(script);

// check for updates availables and notify user
browser.runtime.sendMessage('checkForUpdate').catch((error) => {
  console.error('Failed to send message:', error);
});

// request Strava Credentials
browser.runtime
  .sendMessage('requestStravaCredentials')
  .then((credentials) => {})
  .catch((error) => {
    console.error('Failed to send message:', error);
  });

let settingsDiv = document.createElement('div');
settingsDiv.id = 'extension-settings';
settingsDiv.style.display = 'none';
document.body.appendChild(settingsDiv);
