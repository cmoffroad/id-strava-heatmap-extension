import { addHashChangeListener, getHashParams } from '../common/hash.js';

const opacityStep = 10;
const opacityClassPrefix = 'overlays-opacity';
const hiddenClass = 'overlays-hidden';
const storageKeyLastUsed = 'overlays-last-used';
const storageKeyOpacity = opacityClassPrefix;

export function setupOverlaysListeners() {
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	const altPrefix = isMac ? '⌥' : 'Alt+';

	document.body.style.setProperty(
		`--${opacityClassPrefix}-help`,
		`"ℹ️ Use ⌨️ shortcuts ${altPrefix}+O to toggle all layers visibility, and ${altPrefix}+[ or ${altPrefix}+] to adjust opacity."`
	);

	document.addEventListener('keydown', (event) => {
		// Prevent execution if focused on an input, textarea, or content editable element.
		const tagName = event.target.tagName;
		if (tagName === 'INPUT' || tagName === 'TEXTAREA' || event.target.isContentEditable) {
			return;
		}

		if (!event.altKey) return;

		switch (event.code) {
			case 'KeyO':
				toggleHiddenOverlays();
				break;
			case 'BracketLeft':
				changeOverlayOpacity(-opacityStep);
				break;
			case 'BracketRight':
				changeOverlayOpacity(opacityStep);
				break;
		}
	});

	addHashChangeListener((oldHash, newHash) => {
		// if overlays selection changed,
		if (oldHash.get('overlays') !== newHash.get('overlays')) {
			// do not hide overlays
			toggleHiddenOverlays(false);

			// keep track of last used overlays
			localStorage.setItem(storageKeyLastUsed, newHash.get('overlays'));
		}
	});

	changeOverlayOpacity();
	ensureOverlaysInHash();
}

function isOverlaysHidden() {
	return document.body.classList.contains(hiddenClass);
}

function toggleHiddenOverlays(hidden) {
	document.body.classList.toggle(hiddenClass, hidden);
	changeOverlayOpacity();
}

function changeOverlayOpacity(step = 0) {
	if (isOverlaysHidden()) {
		document.body.style.setProperty(`--${opacityClassPrefix}-summary`, '"Hidden"');
		return;
	}

	const oldOpacity = parseInt(localStorage.getItem(storageKeyOpacity)) || 100;
	const newOpacity = Math.max(opacityStep, Math.min(oldOpacity + step, 100));

	localStorage.setItem(storageKeyOpacity, newOpacity);

	updateOverlayOpacityClass(newOpacity);
}

function updateOverlayOpacityClass(value) {
	const current = [...document.body.classList].find((cls) =>
		cls.startsWith(opacityClassPrefix)
	);
	if (current) document.body.classList.remove(current);

	if (value < 100) {
		document.body.classList.add(`${opacityClassPrefix}-${value}`);
	}

	document.body.style.setProperty(`--${opacityClassPrefix}`, value / 100);
	document.body.style.setProperty(
		`--${opacityClassPrefix}-summary`,
		`"Opacity: ${value}%"`
	);
}

function ensureOverlaysInHash(location = window.location) {
	const currentHashParams = getHashParams(location);

	if (!currentHashParams.has('overlays')) {
		const lastUsedOverlays = localStorage.getItem(storageKeyLastUsed);
		if (lastUsedOverlays && lastUsedOverlays.trim() !== '') {
			currentHashParams.set('overlays', lastUsedOverlays);
			const newHash = `#${currentHashParams.toString()}`;
			if (location.hash !== newHash) {
				location.hash = newHash;
			}
		}
	}
}
