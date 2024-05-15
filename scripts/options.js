// Saves options to browser.storage
async function saveOptions () {
  const color = document.getElementById('color').value;
  const activity = document.getElementById('activity').value;
  const opacity = document.getElementById('opacity').value;
  const ts = Date.now();

  await browser.storage.sync.set({ color, activity, opacity, ts });

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
  const credentials = await browser.runtime.sendMessage('getCredentials');
  document.getElementById('logged_in').style.display = credentials ? 'block' : 'none';
  document.getElementById('logged_out').style.display = !credentials ? 'block' : 'none';

  const { color, activity, opacity } = await browser.runtime.sendMessage('getSettings');
  document.getElementById('color').value = color;
  document.getElementById('activity').value = activity;
  document.getElementById('opacity').value = opacity;
};

async function logout() {
  await browser.runtime.sendMessage('clearCredentials');
  await restoreOptions();
}

document.querySelector('body').style.display = 'block';

document.getElementById('color').addEventListener('change', saveOptions);
document.getElementById('activity').addEventListener('change', saveOptions);
document.getElementById('opacity').addEventListener('change', saveOptions);
document.getElementById('logout').addEventListener('click', logout);

document.addEventListener('DOMContentLoaded', restoreOptions);