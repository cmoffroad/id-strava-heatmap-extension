import { addHashChangeListener, getHashParams } from '../common/hash.js';

const opacityStep = 10;
const opacityClassPrefix = 'overlays-opacity';
const hiddenClass = 'overlays-hidden';
const storageKeyLastUsed = 'overlays-last-used';
const storageKeyOpacity = opacityClassPrefix;

export function setupOverlaysListeners() {
	// const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	// const altPrefix = isMac ? '⌥' : 'Alt';

	document.body.style.setProperty(
		`--${opacityClassPrefix}-help`,
		`"ℹ️ Use the keyboard shortcut Shift+Q to toggle the visibility of all overlays."`
		// `"ℹ️ Use ⌨️ shortcuts Shift+Q to toggle all ayers visibiliy, and ${altPrefix}+[ or ${altPrefix}+] to adjust opacity."`
	);

	document.addEventListener('keydown', (event) => {
		// Prevent execution if focused on an input, textarea, or content editable element.
		const tagName = event.target.tagName;
		if (tagName === 'INPUT' || tagName === 'TEXTAREA' || event.target.isContentEditable) {
			return;
		}

		if (!event.shiftKey) return;

		switch (event.key.toUpperCase()) {
			case 'Q':
				toggleHiddenOverlays();
				break;
			case 'W':
				const osmLayer = context.layers().layer('osm');
				osmLayer.enabled(!osmLayer.enabled());
				break;
		}
		return;
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
