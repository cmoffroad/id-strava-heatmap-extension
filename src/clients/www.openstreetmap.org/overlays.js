import { addHashChangeListener, getHashParams } from '../common/hash.js';

const opacityStep = 10;
const opacityClassPrefix = 'overlays-opacity';
const hiddenClass = 'overlays-hidden';

let overlayOpacity = parseInt(localStorage.getItem(opacityClassPrefix) || '80');

export function setupOverlaysListeners() {
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
				if (!isOverlaysHidden()) changeOverlayOpacity(-opacityStep);
				break;
			case 'BracketRight':
				if (!isOverlaysHidden()) changeOverlayOpacity(opacityStep);
				break;
		}
	});

	addHashChangeListener((oldHash, newHash) => {
		// if overlays selection changed, do not hide overlays
		if (oldHash.get('overlays') !== newHash.get('overlays')) {
			toggleHiddenOverlays(false);
			localStorage.setItem('overlays-last-used', newHash.get('overlays'));
		}
	});

	updateOverlayOpacityClass(overlayOpacity);
	ensureOverlaysInHash();
}

function isOverlaysHidden() {
	return document.body.classList.contains(hiddenClass);
}

function toggleHiddenOverlays(hidden) {
	document.body.classList.toggle(hiddenClass, hidden);
}

function changeOverlayOpacity(step) {
	overlayOpacity = Math.max(opacityStep, Math.min(overlayOpacity + step, 100));
	localStorage.setItem(opacityClassPrefix, `${overlayOpacity}`);
	updateOverlayOpacityClass(overlayOpacity);
}

function updateOverlayOpacityClass(value) {
	const current = [...document.body.classList].find((cls) =>
		cls.startsWith(opacityClassPrefix)
	);
	if (current) document.body.classList.remove(current);

	if (value < 100) {
		document.body.classList.add(`${opacityClassPrefix}-${value}`);
	}

	document.body.style.setProperty(`--${opacityClassPrefix}`, overlayOpacity / 100);
	document.body.style.setProperty(`--${opacityClassPrefix}-percent`, overlayOpacity);
}

function ensureOverlaysInHash(location = window.location) {
	const currentHashParams = getHashParams(location);

	if (!currentHashParams.has('overlays')) {
		const lastUsedOverlays = localStorage.getItem('overlays-last-used');
		if (lastUsedOverlays && lastUsedOverlays.trim() !== '') {
			currentHashParams.set('overlays', lastUsedOverlays);
			const newHash = `#${currentHashParams.toString()}`;
			if (location.hash !== newHash) {
				location.hash = newHash;
			}
		}
	}
}
