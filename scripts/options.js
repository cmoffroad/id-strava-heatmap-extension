// Saves options to chrome.storage
async function saveOptions () {
  const color = document.getElementById('color').value;
  const activity = document.getElementById('activity').value;
  const opacity = document.getElementById('opacity').value;
  const ts = Date.now();

  await chrome.storage.sync.set({ color, activity, opacity, ts });

  browser.runtime.sendMessage('updateSettings');

  // Update status to let user know options were saved.
  const status = document.getElementById('status');
  status.textContent = 'Options saved.';
  setTimeout(() => {
    status.textContent = '';
  }, 750);
};

// Restores form state using the preferences stored in chrome.storage.
async function restoreOptions () {
  const { color, activity, opacity } = await chrome.storage.sync.get({ color: 'hot', activity: 'all', opacity: 100, ts: Date.now() })
  document.getElementById('color').value = color;
  document.getElementById('activity').value = activity;
  document.getElementById('opacity').value = opacity;
};

document.getElementById('color').addEventListener('change', saveOptions);
document.getElementById('activity').addEventListener('change', saveOptions);
document.getElementById('opacity').addEventListener('change', saveOptions);

document.addEventListener('DOMContentLoaded', restoreOptions);