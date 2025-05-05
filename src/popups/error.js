const params = new URLSearchParams(location.search);
const tabId = params.get('tabId');

document.getElementById('popup').addEventListener('click', async () => {
  await browser.runtime.sendMessage({ type: 'openLogin', payload: tabId });
  await browser.action.setPopup({
    popup: '',
    tabId,
  });
  window.close();
});
