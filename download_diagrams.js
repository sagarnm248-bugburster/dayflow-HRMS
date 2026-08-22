const fs = require('fs');
const https = require('https');

const mappings = [
    { name: 'architecture', file: 'docs/diagrams/architecture.mmd', output: 'docs/diagrams/architecture.svg' },
    { name: 'erd', file: 'docs/diagrams/erd.mmd', output: 'docs/diagrams/erd.svg' },
    { name: 'auth_flow', file: 'docs/diagrams/auth_flow.mmd', output: 'docs/diagrams/auth_flow.svg' },
    { name: 'payroll_flow', file: 'docs/diagrams/payroll_flow.mmd', output: 'docs/diagrams/payroll_flow.svg' },
    { name: 'leave_flow', file: 'docs/diagrams/leave_flow.mmd', output: 'docs/diagrams/leave_flow.svg' }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded: ${filepath}`);
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}: Status ${res.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const processFiles = async () => {
    for (const m of mappings) {
        try {
            if (fs.existsSync(m.file)) {
                const data = fs.readFileSync(m.file, 'utf8');
                const b64 = Buffer.from(data).toString('base64');
                const url = `https://mermaid.ink/svg/${b64}`;

                await downloadImage(url, m.output);
            }
        } catch (err) {
            console.error(`Error processing ${m.name}:`, err.message);
        }
    }
};

processFiles();
