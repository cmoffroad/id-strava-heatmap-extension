export function addKeyboardBinding({ code, altKey = false }, callback) {
	document.addEventListener('keydown', (event) => {
		// Prevent execution if focused on an input, textarea, or content editable element.
		const tagName = event.target.tagName;
		if (tagName === 'INPUT' || tagName === 'TEXTAREA' || event.target.isContentEditable) {
			return;
		}

		if (event.code === code && event.altKey === altKey) {
			return callback();
		}

		return;
	});
}
