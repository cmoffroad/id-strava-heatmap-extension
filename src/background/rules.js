import extension from './extension.js';
import { base64EncodeSVG } from './utils.js';

const IMAGERY_RULE_ID = 1;

const IMAGERY_REGEX_FILTER = [
  '^https://www.openstreetmap.org/',
  'assets/iD/data/',
  'imagery.min-(.+).json',
].join('');

const HEATMAP_RULE_ID = 2;

const HEATMAP_REGEX_FILTER = [
  '^https://([^/]+)\\.strava\\.com/',
  '(anon|identified)/globalheat/',
  '([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)\\.png',
].join('');

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
        url: extension.imageryUrl,
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
          url: extension.heatmapFallbackUrl,
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
