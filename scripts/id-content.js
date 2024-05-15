// inject id-script to override iD imagery,json on load
const script = document.createElement('script');
script.src = browser.runtime.getURL('scripts/id-script.js');
(document.head || document.documentElement).appendChild(script);
script.remove();

const extraStyleSheet = new CSSStyleSheet();
document.adoptedStyleSheets = [...document.adoptedStyleSheets, extraStyleSheet];

// listen to extension background messages
browser.runtime.onMessage.addListener((request) => {
  // receiving settings
  if (request.settings) {
    const { ts, opacity } = request.settings;

    // retrieve all visible Strava Heatmap tiles
    const tiles = Array.from(document.querySelectorAll('img.tile'))
      .filter(tile => tile.src.match('strava') && tile.src.match('heatmap'))

    // reload URL for each tile by adding ts
    tiles.forEach(tile => {
      tile.src = tile.src + '&ts=' + ts;
    })

    extraStyleSheet.replaceSync(`
      .layer.layer-overlay > img.tile[src*=strava][src*=heatmap] {
        opacity: ${opacity / 100};
      }
    `);
  }
});


browser.runtime.sendMessage('requestSettings');