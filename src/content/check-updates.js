const manifest = browser.runtime.getManifest();

// Function to check for software updates
async function checkForUpdates() {
  try {
    const updateInfo = await browser.runtime.sendMessage('checkForUpdates');
    console.log('[StravaHeatmapExt] Checked for updates.', updateInfo);
    return updateInfo;
  } catch (error) {
    console.error('[StravaHeatmapExt] Error checking for updates:', error);
    return null;
  }
}

// Function to format the update message
function formatUpdateMessage(updateInfo) {
  const { number, changes } = updateInfo;
  return `
    A new version of the ${manifest.name} extension (${number}) is available.

    Please update to access the latest features and improvements:
    ${changes.map((change) => `- ${change}`).join('\n')}

    Click OK to proceed to the update page.
  `;
}

// Function to handle the user confirmation and redirect if necessary
function handleUpdateConfirmation(message, url) {
  const userConfirmed = confirm(message);

  if (userConfirmed) {
    window.top.location.href = url;
  }
}

// Main function to orchestrate everything
async function main() {
  const updateInfo = await checkForUpdates();
  if (updateInfo) {
    const message = formatUpdateMessage(updateInfo);
    handleUpdateConfirmation(message, updateInfo.url);
  }
}

main();
