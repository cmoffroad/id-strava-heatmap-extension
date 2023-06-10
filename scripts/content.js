async function injectScript(content) {
  const script = document.createElement('script');
  if (content.indexOf('chrome-extension://') === 0) 
    script.src = content;
  else 
    script.textContent = content;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

async function main() {
  injectScript(browser.runtime.getURL("scripts/script.js"));

  window.addEventListener("message", (event) => {
    if (event.data === 'clearStravaCredentials') {
      browser.runtime.sendMessage({
        name: "clearStravaCredentials"
      });
    }
  }, false);

  const response = await browser.runtime.sendMessage({
    name: "requestStravaCredentials"
  });
  // console.debug('requestStravaCredentials', response);
  await injectScript(`window.stravaCredentials = ${JSON.stringify(response.credentials)};`);
}

main();