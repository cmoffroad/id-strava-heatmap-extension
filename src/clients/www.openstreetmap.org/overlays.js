export function setupToggleOverlaysKeyboardListener() {
	document.addEventListener('keydown', (event) => {
		if (event.code === 'KeyO' && event.altKey) {
			toggleOverlays();
		}
	});
}

export function toggleOverlays() {
	document.body.classList.toggle('hide-overlays');
}
