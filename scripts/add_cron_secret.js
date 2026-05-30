const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const projectJsonPath = path.join('d:\\My_Code_Projects\\Harnessing\\projects\\hk-sme-receipt-pro', '.vercel', 'project.json');
const projectData = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
const projectId = projectData.projectId;

const possibleConfigPaths = [
  path.join(process.env.APPDATA || '', 'xdg.data', 'com.vercel.cli', 'auth.json'),
  path.join(os.homedir(), '.vercel', 'auth.json'),
  path.join(os.homedir(), '.config', 'vercel', 'auth.json'),
  path.join(process.env.LOCALAPPDATA || '', 'vercel', 'auth.json'),
  path.join(process.env.APPDATA || '', 'vercel', 'auth.json'),
];

let token = null;
for (const p of possibleConfigPaths) {
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    token = data.token;
    console.log('Found token at:', p);
    break;
  } catch (e) {}
}

if (!token) {
  try {
    const result = execSync('vercel whoami 2>&1', { encoding: 'utf8' });
    console.log('whoami result:', result);
  } catch (e) {
    console.log('whoami error:', e.message);
  }
  console.log('Could not find auth token. Trying VERCEL_TOKEN env var...');
  token = process.env.VERCEL_TOKEN;
}

if (!token) {
  console.error('No auth token found. Exiting.');
  process.exit(1);
}

const body = JSON.stringify({
  key: 'CRON_SECRET',
  value: 'hk-receipt-pro-cron-2026',
  type: 'encrypted',
  target: ['production'],
});

const options = {
  hostname: 'api.vercel.com',
  path: `/v9/projects/${projectId}/env`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(body);
req.end();
