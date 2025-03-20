browser.runtime.sendMessage('clearStravaCredentials').catch((error) => {
  console.error('Failed to send message:', error);
});
