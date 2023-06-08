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
  const response = await browser.runtime.sendMessage({
    name: "requestStravaCredentials"
  });
  if (response.error) {
    // TODO
  } else {
    await injectScript(`window.StravaHeatmapCredentials = ${JSON.stringify(response.credentials)};`);
    await injectScript(browser.runtime.getURL("script.js"));
  }
}

main();