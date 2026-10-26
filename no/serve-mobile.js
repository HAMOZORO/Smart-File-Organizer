const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip',
  '.csv': 'text/csv; charset=utf-8'
};

function getNetworkInfo() {
  const interfaces = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        results.push({ name, ip: iface.address });
      }
    }
  }
  return results;
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const list = getNetworkInfo();
  console.log('\n================================================================');
  console.log('  📱 Smart File Organizer Pro - Mobile Wi-Fi Server Active');
  console.log('================================================================');
  console.log('Connect your phone to the same Wi-Fi network.');
  console.log('Then open your phone browser (Chrome or Safari) and go to:\n');

  // Put Wi-Fi first if present
  const wifiEntry = list.find(item => item.name.toLowerCase().includes('wi-fi'));
  if (wifiEntry) {
    console.log(`  ⭐ Recommended (Wi-Fi):`);
    console.log(`     👉 http://${wifiEntry.ip}:${PORT}\n`);
  }

  console.log('  All Detected Network Addresses:');
  list.forEach(item => {
    console.log(`     • [${item.name}]: http://${item.ip}:${PORT}`);
  });

  console.log('\n----------------------------------------------------------------');
  console.log('📲 How to Install on your Phone:');
  console.log('  • Android (Chrome / Samsung / Edge):');
  console.log('    1. Open the link above in Chrome');
  console.log('    2. Tap the "Install App" button at the top');
  console.log('       (or tap Menu ⋮ -> "Install app" / "Add to Home screen")');
  console.log('  • iPhone / iPad (Safari):');
  console.log('    1. Open the link above in Safari');
  console.log('    2. Tap the Share button (⬆) at the bottom');
  console.log('    3. Tap "Add to Home Screen" (+)');
  console.log('================================================================\n');
  console.log('Press Ctrl+C to stop the server at any time.\n');
});
