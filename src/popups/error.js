const params = new URLSearchParams(location.search);
const tabId = params.get('tabId');

document.getElementById('popup').addEventListener('click', () => {
	browser.runtime.sendMessage({ type: 'openLogin', payload: tabId });
	// window.close();
});

// if (timeout) {
// 	setTimeout(() => {
// 		window.close();
// 	}, parseInt(timeout));
// }
