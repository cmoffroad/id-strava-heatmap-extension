export function setupiDCoreContextListener(initCallback) {
  const originalID = window.iD;

  window.iD = {
    ...originalID,
    coreContext() {
      console.log('[StravaHeatmapExt] overriding window.iD.coreContext()');
      const context = originalID.coreContext();
      const originalInit = context.init;

      context.init = () => {
        console.log('[StravaHeatmapExt] add callback to window.iD.coreContext().init()');
        originalInit();
        initCallback(context);
        return context;
      };

      return context;
    },
  };
}

export function restoreiDContainer() {
  const container = document.getElementById('id-container');
  if (container) container.remove();
  document.dispatchEvent(
    new Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true,
    })
  );
}
