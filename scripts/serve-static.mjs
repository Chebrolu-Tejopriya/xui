#!/usr/bin/env node
/**
 * Minimal static file server for the built Storybook.
 *
 * Zero dependencies, for the same reason mcp/server.mjs is: serving a folder
 * over HTTP is ~40 lines, and a dependency here would be one more thing to
 * audit and keep current for no gain. Used only by playwright.config.ts to
 * put storybook-static in front of a browser.
 *
 *   node scripts/serve-static.mjs storybook-static 6008
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'storybook-static');
const port = Number(process.argv[3] ?? 6008);

if (!fs.existsSync(root)) {
  console.error(`No such directory: ${root}\nRun \`npm run build-storybook\` first.`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

http
  .createServer((req, res) => {
    // Strip the query (?id=…&globals=…) — only the path selects a file.
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = path.join(root, url);

    // `path.join` collapses `..`, so compare the result against root to
    // reject traversal rather than trusting the request.
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'index.html');
    }

    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
        return;
      }
      res.writeHead(200, {
        'content-type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
        // Baselines must reflect the build under test, never a cached one.
        'cache-control': 'no-store',
      });
      res.end(buf);
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`serving ${path.relative(process.cwd(), root)} on http://127.0.0.1:${port}`);
  });
