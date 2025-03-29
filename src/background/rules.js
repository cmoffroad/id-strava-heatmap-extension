const RULE_ID = 2;

const FALLBACK_SVG = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <rect width="100%" height="100%" fill="transparent"/>
    <text x="50%" y="50%" font-family="Helvetica Neue" font-size="18" fill="#fc5200" text-anchor="middle" alignment-baseline="middle">
      <tspan x="50%" dy="0em">Log in at <tspan text-decoration="underline">strava.com/login</tspan></tspan>
      <tspan x="50%" dy="1.4em">and navigate to <tspan font-weight="bold">Maps</tspan></tspan>
      <tspan x="50%" dy="1.4em">to visualize the</tspan>
      <tspan x="50%" dy="1.4em">Strava Heatmap overlay</tspan>
    </text>
  </svg>
`)}`;

const RULE_REGEX_FILTER =
  '^https://([^/]+)\\.strava\\.com/(anon|identified)/globalheat/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)\\.png(\\?(v=[^&]+))?$';

export async function updateRequestRules(credentialsCookieHeader) {
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: credentialsCookieHeader
      ? [
          {
            id: RULE_ID,
            priority: 1,
            condition: {
              regexFilter: RULE_REGEX_FILTER,
              resourceTypes: ['main_frame', 'sub_frame', 'image'],
            },
            action: {
              type: 'modifyHeaders',
              requestHeaders: [
                {
                  header: 'Cookie',
                  operation: 'set',
                  value: credentialsCookieHeader,
                },
              ],
              responseHeaders: [
                {
                  header: 'Access-Control-Allow-Origin',
                  operation: 'set',
                  value: '*',
                },
              ],
            },
          },
        ]
      : [
          {
            id: RULE_ID,
            priority: 1,
            condition: {
              regexFilter: RULE_REGEX_FILTER,
              resourceTypes: ['main_frame', 'sub_frame', 'image'],
            },
            action: {
              type: 'redirect',
              redirect: {
                url: FALLBACK_SVG,
              },
            },
          },
        ],
  });
}
