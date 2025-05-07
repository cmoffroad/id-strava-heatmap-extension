import { addHashChangeListener, getHashParams } from '../common/hash.js';

const opacityStep = 10;
const opacityClassPrefix = 'overlays-opacity';
const hiddenClass = 'overlays-hidden';
const storageKeyLastUsed = 'overlays-last-used';
const storageKeyOpacity = opacityClassPrefix;

export function setupOverlaysListeners(context) {
	// const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	// const altPrefix = isMac ? '⌥' : 'Alt';

	document.body.style.setProperty(
		`--${opacityClassPrefix}-help`,
		`"ℹ️ Use the keyboard shortcut Shift+Q to toggle the visibility of all overlays."`
		// `"ℹ️ Use ⌨️ shortcuts Shift+Q to toggle all ayers visibiliy, and ${altPrefix}+[ or ${altPrefix}+] to adjust opacity."`
	);

	context.keybinding().on(iD.uiCmd('⇧Q'), function (d3_event) {
		d3_event.stopImmediatePropagation();
		d3_event.preventDefault();
		toggleHiddenOverlays();
	});

	context.keybinding().on(iD.uiCmd('⇧W'), function (d3_event) {
		d3_event.stopImmediatePropagation();
		d3_event.preventDefault();
		const osmLayer = context.layers().layer('osm');
		osmLayer.enabled(!osmLayer.enabled());
	});

	addHashChangeListener((oldHash, newHash) => {
		const newValue = newHash.get('overlays') ?? '';
		const oldValue = oldHash.get('overlays') ?? '';
		// if overlays selection changed,
		if (oldValue !== newValue) {
			// do not hide overlays
			toggleHiddenOverlays(false);

			// keep track of last used overlays fallback to empty string
			localStorage.setItem(storageKeyLastUsed, newValue);
		}
	});

	// changeOverlayOpacity();
}

export function getDefaultOverlayIds() {
	const hash = getHashParams(location).get('overlays');
	const lastUsed = localStorage.getItem(storageKeyLastUsed);

	if (hash !== null) {
		return hash.split(',').filter(Boolean);
	} else if (lastUsed !== null) {
		return lastUsed.split(',').filter(Boolean);
	} else {
		return ['strava-heatmap-1'];
	}
}

function isOverlaysHidden() {
	return document.body.classList.contains(hiddenClass);
}

function toggleHiddenOverlays(hidden) {
	document.body.classList.toggle(hiddenClass, hidden);
	document.body.style.setProperty(
		`--${opacityClassPrefix}-summary`,
		isOverlaysHidden() ? '"Hidden"' : ''
	);
	// changeOverlayOpacity();
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
			// text: 'Toggle Overlays',
			text: 'shortcuts.browsing.display_options.map_data',
		},
		{
			modifiers: ['⇧'],
			shortcuts: ['W'],
			text: 'shortcuts.browsing.display_options.map_data',
		},
	];

	rows.splice(targetIndex, 1, ...customShortcuts);
}

// function changeOverlayOpacity(step = 0) {
// 	if (isOverlaysHidden()) {
// 		document.body.style.setProperty(`--${opacityClassPrefix}-summary`, '"Hidden"');
// 		return;
// 	}

// 	const oldOpacity = parseInt(localStorage.getItem(storageKeyOpacity)) || 100;
// 	const newOpacity = Math.max(opacityStep, Math.min(oldOpacity + step, 100));

// 	localStorage.setItem(storageKeyOpacity, newOpacity);

// 	updateOverlayOpacityClass(newOpacity);
// }

// function updateOverlayOpacityClass(value) {
// 	const current = [...document.body.classList].find((cls) =>
// 		cls.startsWith(opacityClassPrefix)
// 	);
// 	if (current) document.body.classList.remove(current);

// 	if (value < 100) {
// 		document.body.classList.add(`${opacityClassPrefix}-${value}`);
// 	}

// 	document.body.style.setProperty(`--${opacityClassPrefix}`, value / 100);
// 	document.body.style.setProperty(
// 		`--${opacityClassPrefix}-summary`,
// 		`"Opacity: ${value}%"`
// 	);
// }
