import extension from './extension.js';

const IMAGERY_RULE_ID = 1;

const IMAGERY_REGEX_FILTER = [
  '^https://www.openstreetmap.org/',
  'assets/iD/data/',
  'imagery.min-(.+).json',
].join('');

const HEATMAP_REDIRECT_RULE_ID = 2;
const HEATMAP_HEADERS_RULE_ID = 3;
const HEATMAP_FALLBACK_RULE_ID = 4;

export function updateImageryRules() {
  const rule = {
    id: IMAGERY_RULE_ID,
    priority: 1,
    condition: {
      regexFilter: IMAGERY_REGEX_FILTER,
      resourceTypes: ['main_frame', 'xmlhttprequest'],
    },
    action: {
      type: 'modifyHeaders',
      responseHeaders: [
        {
          header: 'Cache-Control',
          operation: 'set',
          value: 'no-store, no-cache, must-revalidate, max-age=0',
        },
      ],
    },
  };

  return browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [rule.id],
    addRules: [rule],
  });
}

export function updateHeatmapRules(credentials) {
  const timestamp = Date.now().toString();

  const removeRuleIds = [
    HEATMAP_REDIRECT_RULE_ID,
    HEATMAP_HEADERS_RULE_ID,
    HEATMAP_FALLBACK_RULE_ID,
  ];

  const condition = {
    regexFilter:
      '^https://[^/]+\\.strava\\.com/identified/globalheat/[^/]+/[^/]+/[^/]+/[^/]+/[^/]+\\.png',
    resourceTypes: ['image', 'xmlhttprequest'],
    excludedInitiatorDomains: ['strava.com'],
  };

  if (!credentials) {
    return browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: [
        {
          id: HEATMAP_FALLBACK_RULE_ID,
          priority: 1,
          condition,
          action: {
            type: 'redirect',
            redirect: {
              url: extension.heatmapFallbackUrl + `?t=` + timestamp,
            },
          },
        },
      ],
    });
  } else {
    return browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: [
        {
          id: HEATMAP_REDIRECT_RULE_ID,
          priority: 1,
          condition,
          action: {
            type: 'redirect',
            redirect: {
              transform: {
                queryTransform: {
                  addOrReplaceParams: [
                    {
                      key: 't',
                      value: timestamp,
                    },
                  ],
                },
              },
            },
          },
        },
        {
          id: HEATMAP_HEADERS_RULE_ID,
          priority: 1,
          condition,
          action: {
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
              {
                header: 'Cache-Control',
                operation: 'set',
                value: 'no-store, no-cache, must-revalidate, max-age=0',
              },
            ],
          },
        },
      ],
    });
  }
}
