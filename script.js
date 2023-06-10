// generate imagery attributes for given Strava Heatmap type, color and credentials
function getStravaHeatmapImagery(type, color, credentials) {
  const { keyPairId, policy, signature} = credentials;
  return {
    id: `StravaHeatmap${type}`,
    name: `Strava Heatmap (${type})`,
    description: "The Strava Heatmap shows 'heat' made by aggregated, public activities over the last year.",
    template: `https://heatmap-external-{switch:a,b,c}.strava.com/tiles-auth/${type.toLowerCase()}/${color.toLowerCase()}/{zoom}/{x}/{y}.png?Key-Pair-Id=${keyPairId}&Policy=${policy}&Signature=${signature}`,
    zoomExtent: [0, 24],
    overlay: true,
    terms_url: "https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!"
  }
}

// override global fetch function used by iD to retrieve imagery json file
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {

  const [resource, config] = args;

  const response = await originalFetch(resource, config);

  if (resource.match('/assets/iD/data/imagery.')) {
    // response interceptor
    const json = () => response
      .clone()
      .json()
      .then(data => resolveImageryWithStravaHeatmap(data, 10000));

    response.json = json;
  }
  return response;
};

window.addEventListener('DOMContentLoaded', () => addStravaLink());

window.clearCookies = () => {
  window.postMessage('clearStravaCredentials');
}

function resolveImageryWithStravaHeatmap(data, timeout) {
  var start = Date.now();

  return new Promise(waitForStravaCredentials);

  function waitForStravaCredentials(resolve, reject) {
    const { stravaCredentials } = window;
    if (stravaCredentials === null) {
      resolve(data);
    } else if (stravaCredentials !== undefined) {
      resolve([
        ...data,
        getStravaHeatmapImagery('Ride', 'Hot', stravaCredentials),
        getStravaHeatmapImagery('Run', 'Hot', stravaCredentials),
        getStravaHeatmapImagery('Water', 'Hot', stravaCredentials),
        getStravaHeatmapImagery('Winter', 'Hot', stravaCredentials),
        getStravaHeatmapImagery('All', 'Hot', stravaCredentials),
      ])
    } else if (timeout && (Date.now() - start) >= timeout)
      resolve(data);
    else
      setTimeout(waitForStravaCredentials.bind(this, resolve, reject), 250);
  }
}

async function addStravaLink() {
  const overlayDiv = await waitForElm('.layer-overlay-list');
  if (window.stravaCredentials) {
    const logoutLink = document.createElement('a');
    logoutLink.addEventListener("click", function() {
      window.postMessage("clearStravaCredentials");
      window.top.location.reload();
    });
    logoutLink.href = "#";
    logoutLink.target = "top";
    logoutLink.innerText = 'Strava Heatmap: Logout';
    logoutLink.style.color = 'red'
    logoutLink.style.paddingLeft = '30px';
    logoutLink.style.lineHeight = '30px';
    overlayDiv.appendChild(logoutLink);
  } else {
    const loginLink = document.createElement('a');
    // loginLink.addEventListener("click", function() {
    //   window.top.location.href = "";
    // });
    loginLink.href = "https://www.strava.com/heatmap";
    loginLink.target = "parent";
    loginLink.innerText = 'Strava Heatmap: Login';
    loginLink.style.color = 'red'
    loginLink.style.paddingLeft = '30px';
    loginLink.style.lineHeight = '30px';
    overlayDiv.appendChild(loginLink);
  }
}


function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}