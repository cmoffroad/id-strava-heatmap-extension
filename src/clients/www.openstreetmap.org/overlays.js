import { getHashParams } from '../common/hash.js';

const overlaysHelpVar = `--overlays-help`;
const overlaysSummaryVar = `--overlays-summary`;
const overlaysHiddenClass = 'overlays-hidden';
const storageKeyLastUsed = 'overlays-last-used';

export function bindOverlaysShortcuts(context) {
  const keybinding = context.keybinding();

  keybinding.on(iD.uiCmd('⇧Q'), function (d3_event) {
    d3_event.stopImmediatePropagation();
    d3_event.preventDefault();
    toggleOverlaysVisibility();
  });

  keybinding.on(iD.uiCmd('⇧W'), function (d3_event) {
    d3_event.stopImmediatePropagation();
    d3_event.preventDefault();
    const osmLayer = context.layers().layer('osm');
    osmLayer.enabled(!osmLayer.enabled());
  });
}

async function reorderOverlaysHash(background, hashValue) {
  const imagery = await background.ensureLoaded();

  // Get the preferred Strava layer order from background sources
  const stravaLayerIds = imagery.backgrounds
    .filter((b) => b.id.startsWith('strava-heatmap-'))
    .map((b) => b.id)
    .reverse();

  // Convert input value to array
  const inputIds = hashValue.split(',').filter(Boolean);

  // Separate Strava and non-Strava layers
  const stravaInInput = inputIds.filter((id) => stravaLayerIds.includes(id));
  const others = inputIds.filter((id) => !stravaLayerIds.includes(id));

  // Reorder Strava layers based on the predefined order
  const sortedStrava = stravaLayerIds.filter((id) => stravaInInput.includes(id));

  // Combine: others first (non-Strava), then sorted Strava layers
  const reordered = [...others, ...sortedStrava];

  return reordered.join(',');
}

export async function setupOverlaysListeners(context) {
  document.addEventListener('change', async (event) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.matches('input[type="checkbox"][name="layers"]')
    ) {
      // Ensure overlays are visible when toggling layer checkboxes
      toggleOverlaysVisibility(true);

      // Save the current overlay state (or empty string if none)
      const hashParams = getHashParams(location);
      const newValue = hashParams.get('overlays') ?? '';
      await adjustOverlaysOrder(context.background(), newValue, true);

      // Save the last used overlays in local storage
      localStorage.setItem(storageKeyLastUsed, newValue);
    }
  });

  // execute once
  updateOverlaysHelpText();
  updateOverlaySummary();

  await injectOverlaysShortcuts();
}

export async function adjustOverlaysOrder(background, newValue, reset) {
  const adjustedValue = await reorderOverlaysHash(background, newValue);

  if (adjustedValue === newValue) return;

  if (reset) {
    background
      .overlayLayerSources()
      .forEach((layer) => background.toggleOverlayLayer(layer));
  }

  adjustedValue
    .split(',')
    .filter(Boolean)
    .forEach((id) => {
      const source = background.findSource(id);
      if (source) {
        background.toggleOverlayLayer(source);
      } else {
        console.warn(
          `[StravaHeatmapExt] Missing overlay source for initialization: ${id}`
        );
      }
    });
}

export function getDefaultOverlaysHash() {
  const hash = getHashParams(location).get('overlays');
  const lastUsed = localStorage.getItem(storageKeyLastUsed);

  return hash ?? lastUsed ?? 'strava-heatmap-all';
}

function updateOverlaySummary() {
  const status = document.body.classList.contains(overlaysHiddenClass)
    ? 'Hidden'
    : 'Visible';
  document.body.style.setProperty(overlaysSummaryVar, `"${status}"`);
}

function updateOverlaysHelpText() {
  const helpText = [
    'ℹ️ Use [Shift+Q] to toggle the visibility of all overlays.',
    'Previously used overlays persist between sessions.',
  ]
    .join(' ')
    .trim();

  document.body.style.setProperty(overlaysHelpVar, `"${helpText}"`);
}

function toggleOverlaysVisibility(forceVisible) {
  const body = document.body;
  if (forceVisible === true) {
    body.classList.remove(overlaysHiddenClass);
  } else {
    body.classList.toggle(overlaysHiddenClass);
  }
  updateOverlaySummary();
}

export async function injectOverlaysShortcuts() {
  await iD.fileFetcher.get('shortcuts');
  const cache = iD.fileFetcher.cache?.();
  const browsingTab = cache?.shortcuts?.find((s) => s.tab === 'browsing');
  const rows = browsingTab?.columns?.[0]?.rows;

  if (!Array.isArray(rows)) {
    console.warn(
      '[StravaHeatmapExt] Shortcuts cache is unavailable or not in expected format.'
    );
    return;
  }

  const targetIndex = rows.findIndex(
    (r) => r.text === 'shortcuts.browsing.display_options.map_data'
  );
  if (targetIndex === -1) return;

  const customShortcuts = [
    {
      modifiers: ['⇧'],
      shortcuts: ['Q'],
      text: 'Toggle Overlays Visibility',
    },
    {
      modifiers: ['⇧'],
      shortcuts: ['W'],
      text: 'shortcuts.browsing.display_options.osm_data',
    },
  ];

  rows.splice(targetIndex, 1, ...customShortcuts);
}
