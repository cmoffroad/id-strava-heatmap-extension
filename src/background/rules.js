import { base64EncodeSVG } from './utils.js';

const IMAGERY_RULE_ID = 1;

const IMAGERY_REGEX_FILTER = [
  '^https://www.openstreetmap.org/',
  'assets/iD/data/',
  'imagery.min-(.+).json',
].join('');

const IMAGERY_REDIRECT_URL = browser.runtime.getURL('assets/imagery.json');

const HEATMAP_RULE_ID = 2;

const HEATMAP_REGEX_FILTER = [
  '^https://([^/]+)\\.strava\\.com/',
  '(anon|identified)/globalheat/',
  '([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)\\.png',
].join('');

const HEATMAP_FALLBACK_SVG = base64EncodeSVG(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <rect width="100%" height="100%" fill="transparent"/>
    <text x="50%" y="50%" font-family="Helvetica Neue" font-size="18" fill="#fc5200" text-anchor="middle" alignment-baseline="middle">
      <tspan x="50%" dy="0em">Log in at <tspan text-decoration="underline">strava.com/login</tspan></tspan>
      <tspan x="50%" dy="1.4em">and navigate to <tspan font-weight="bold">Maps</tspan></tspan>
      <tspan x="50%" dy="1.4em">to visualize the</tspan>
      <tspan x="50%" dy="1.4em">Strava Heatmap overlay</tspan>
    </text>
  </svg>
`);

export function updateImageryRules() {
  const rule = {
    id: IMAGERY_RULE_ID,
    priority: 1,
    condition: {
      regexFilter: IMAGERY_REGEX_FILTER,
      resourceTypes: ['main_frame', 'xmlhttprequest'],
    },
    action: {
      type: 'redirect',
      redirect: {
        url: IMAGERY_REDIRECT_URL,
      },
    },
  };
  return browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [rule.id],
    addRules: [rule],
  });
}

export function updateHeatmapRules(credentials) {
  const action = credentials
    ? {
        type: 'modifyHeaders',
        requestHeaders: [
          {
            header: 'Cookie',
            operation: 'set',
            value: credentials,
          },
        ],
        responseHeaders: [
          {
            header: 'Access-Control-Allow-Origin',
            operation: 'set',
            value: '*',
          },
        ],
      }
    : {
        type: 'redirect',
        redirect: {
          url: HEATMAP_FALLBACK_SVG,
        },
      };

  const rule = {
    id: HEATMAP_RULE_ID,
    priority: 1,
    condition: {
      regexFilter: HEATMAP_REGEX_FILTER,
      resourceTypes: ['main_frame', 'sub_frame', 'image'],
    },
    action,
  };

  return browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [rule.id],
    addRules: [rule],
  });
}
