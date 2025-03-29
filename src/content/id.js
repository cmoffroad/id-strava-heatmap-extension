async function main() {
  // check of for software updates
  const newUpdate = await browser.runtime.sendMessage('checkForUpdate');
  if (newUpdate) {
    const { version, url, changes } = newUpdate;
    const message = [
      `A new version of the iD Strava Heatmap extension (${version}) is available.`,
      '',
      'Please update to access the latest features and improvements:',
      ...changes.map((change) => `- ${change}`),
      '',
      'Click OK to proceed to the update page.',
    ].join('\n');
    if (confirm(message)) {
      window.location.href = url;
    }
  }

  await browser.runtime.sendMessage('requestStravaCredentials');
}

main();
