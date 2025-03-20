browser.runtime.sendMessage('checkForUpdate').catch((error) => {
  console.error('Failed to send message:', error);
});
