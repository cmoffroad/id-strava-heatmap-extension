export function setupiDCoreContextListener(initCallback) {
	const originalID = window.iD;

	window.iD = {
		...originalID,
		coreContext() {
			const context = originalID.coreContext();
			const originalInit = context.init;

			context.init = () => {
				originalInit();
				initCallback(context);
				return context;
			};

			return context;
		},
	};
}

export function restoreiDContainer() {
	const container = document.getElementById('id-container-blocked');
	if (!container) return;

	container.id = 'id-container';

	document.dispatchEvent(
		new Event('DOMContentLoaded', {
			bubbles: true,
			cancelable: true,
		})
	);
}
