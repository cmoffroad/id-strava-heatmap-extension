const defaultSettings = {
  opacity: 0.5,
  color: 'hot',
  activity: 'all',
};

function getSettings() {
  return {
    ...defaultSettings,
    ...(JSON.parse(localStorage.getItem('strava-heatmap-settings')) || {}),
  };
}

export function getSetting(key) {
  const settings = getSettings();
  return settings.hasOwnProperty(key) ? settings[key] : null;
}

export function updateSetting(key, value) {
  const settings = getSettings();
  settings[key] = value;
  localStorage.setItem('strava-heatmap-settings', JSON.stringify(settings));
}
