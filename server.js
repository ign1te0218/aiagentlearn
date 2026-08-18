const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const startPort = Number(process.env.PORT || 4173);
const maxAttempts = 12;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function resolveFile(urlPath) {
  const pathname = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const absolutePath = path.resolve(root, relativePath);
  return absolutePath.startsWith(root) ? absolutePath : null;
}

function createServer() {
  return http.createServer((request, response) => {
    const filePath = resolveFile(request.url);
    if (!filePath) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return;
    }

    fs.stat(filePath, (statError, stat) => {
      if (statError || !stat.isFile()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      response.writeHead(200, {
        'Content-Type': mimeTypes[extension] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      fs.createReadStream(filePath).pipe(response);
    });
  });
}

function listen(port, attempt = 0) {
  const server = createServer();
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < maxAttempts) {
      listen(port + 1, attempt + 1);
      return;
    }
    console.error(error);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`AgentPath is running at http://127.0.0.1:${port}`);
  });
}

listen(startPort);
