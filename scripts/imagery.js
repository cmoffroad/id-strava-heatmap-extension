const fs = require('fs');
const path = require('path');
const axios = require('axios');

// URL of the JSON file to download
const url =
  'https://raw.githubusercontent.com/openstreetmap/iD/refs/heads/develop/data/imagery.json';

// Path to save the modified file
const outputPath = path.join(process.cwd(), 'assets', 'imagery.json');

// Data to add to the imagery.json array
const newImagery = `,
  {
    "id": "StravaHeatmap",
    "name": "Strava Heatmap",
    "description": "The Strava Heatmap shows heat made by aggregated, public activities over the last year.",
    "template":
        "https://heatmap-external-{switch:a,b,c}.strava.com/tiles/all/hot/{zoom}/{x}/{y}.png?v=19",
    "terms_url":
        "https://wiki.openstreetmap.org/wiki/Strava#Data_Permission_-_Allowed_for_tracing!",
    "zoomExtent": [0, 15],
    "overlay": true
  }
]`;

// Function to download the JSON and modify it
async function downloadAndModifyJson() {
  const response = await axios.get(url, { responseType: 'text' });
  const modifiedResponse = response.data.replace(/\n\]$/, newImagery);

  fs.writeFileSync(outputPath, modifiedResponse);

  console.log('imagery.json updated and saved successfully!');
}

// Run the function
downloadAndModifyJson();
