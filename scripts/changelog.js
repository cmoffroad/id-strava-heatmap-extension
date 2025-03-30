const fs = require('fs');

// Read the content of updates.json synchronously
const data = fs.readFileSync('updates.json', 'utf8');

// Parse the JSON data
const updates = JSON.parse(data);

// Generate the changelog content
let changelogContent = '# Changelog\n\n';

changelogContent += `## Versions\n\n`;

updates.versions.forEach((version) => {
  changelogContent += `### \`${version.number}\` (${version.date})\n\n`;

  version.changes.forEach((change) => {
    changelogContent += `- ${change}\n`;
  });

  changelogContent += '\n';
});

// Add the latest version info at the end
changelogContent += `## Latest Available Version\n\n`;
changelogContent += `- Chrome: \`${updates.latest_version.chrome}\`\n`;
changelogContent += `- Firefox: \`${updates.latest_version.firefox}\`\n`;

// Write the changelog content to CHANGELOG.md synchronously
fs.writeFileSync('CHANGELOG.md', changelogContent);

console.log('CHANGELOG.md has been generated!');
