const fs = require('fs');
const path = require('path');

const mappings = [
    { name: 'System Architecture', token: '![System Architecture]', file: './docs/diagrams/architecture.svg' },
    { name: 'Database ERD', token: '![Database ERD]', file: './docs/diagrams/erd.svg' },
    { name: 'Onboarding Flow', token: '![Onboarding Flow]', file: './docs/diagrams/auth_flow.svg' },
    { name: 'Payroll Logic', token: '![Payroll Logic]', file: './docs/diagrams/payroll_flow.svg' },
    { name: 'Leave Workflow', token: '![Leave Workflow]', file: './docs/diagrams/leave_flow.svg' }
];

const readmePath = 'README.md';

try {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    mappings.forEach(m => {
        // Regex to find ![Token](ANYTHING)
        // We escape the token for regex usage
        const escapedToken = m.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`${escapedToken}\\(.*?\\)`, 'g');

        // Replace with ![Token](./path/to/file)
        const newMarkdown = `${m.token}(${m.file})`;

        // Only replace if found
        if (readmeContent.match(regex)) {
            readmeContent = readmeContent.replace(regex, newMarkdown);
            console.log(`Updated ${m.name}`);
        } else {
            console.warn(`Could not find placeholder for ${m.name}`);
        }
    });

    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('README.md updated to use local SVG files.');

} catch (err) {
    console.error('Error:', err);
}
