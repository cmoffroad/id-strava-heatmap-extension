browser.runtime.sendMessage('requestStravaCredentials').catch((error) => {
  console.error('Failed to send message:', error);
});
