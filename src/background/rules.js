import extension from './extension.js';

const HEATMAP_RULE_ID = 1;

export async function updateHeatmapRules(credentials) {
  const timestamp = Date.now().toString();

  const removeRuleIds = [HEATMAP_RULE_ID, 2, 3, 4, 5];

  const condition = {
    regexFilter:
      '^https://[^/]+\\.strava\\.com/identified/globalheat/[^/]+/[^/]+/[^/]+/[^/]+/[^/]+\\.png',
    resourceTypes: ['image', 'xmlhttprequest'],
    excludedInitiatorDomains: ['strava.com'],
  };

  if (!credentials) {
    const addRules = [
      {
        id: HEATMAP_RULE_ID,
        priority: 1,
        condition,
        action: {
          type: 'redirect',
          redirect: {
            url: extension.heatmapFallbackUrl,
          },
        },
      },
    ];

    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules,
    });
    return addRules;
  } else {
    const addRules = [
      {
        id: HEATMAP_RULE_ID,
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
    ];

    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules,
    });

    return addRules;
  }
}
