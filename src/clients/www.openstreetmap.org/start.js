(function () {
	// look for id-container and change id name to prevent iD native rendering
	const observer = new MutationObserver((mutations) => {
		for (const { addedNodes } of mutations) {
			for (const node of addedNodes) {
				if (node.nodeType === Node.ELEMENT_NODE && node.id === 'id-container') {
					node.id = 'id-container-blocked';
					console.debug('[StravaHeatmapExt] Blocked #id-container');
					observer.disconnect();
					return;
				}
			}
		}
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});
})();
