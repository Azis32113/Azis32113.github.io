// Copies the Vite build output into the folder root so GitHub Pages can serve
// https://<user>.github.io/hajj-education-prototype/ directly from the branch.
import { copyFile, cp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const assetsDir = path.join(root, 'assets');

if (!existsSync(path.join(dist, 'dev.html'))) {
  throw new Error('dist/dev.html not found. Run "vite build" first.');
}

const builtHtml = await readFile(path.join(dist, 'dev.html'), 'utf8');
const entryScript = builtHtml.match(/src="\.\/assets\/([^"]+\.js)"/)?.[1];
const entryStyle = builtHtml.match(/href="\.\/assets\/([^"]+\.css)"/)?.[1];

if (!entryScript) {
  throw new Error('Could not find the built entry script in dist/dev.html.');
}

await rm(assetsDir, { recursive: true, force: true });
await cp(path.join(dist, 'assets'), assetsDir, { recursive: true });

// index.html uses content-hashed filenames, so a new deploy never reuses a
// stale cached bundle.
await writeFile(path.join(root, 'index.html'), builtHtml);

// Keep stable aliases for clients that still have the previous index.html
// cached (GitHub Pages caches HTML for up to 10 minutes).
await copyFile(path.join(assetsDir, entryScript), path.join(assetsDir, 'app.js'));
if (entryStyle) {
  await copyFile(path.join(assetsDir, entryStyle), path.join(assetsDir, 'app.css'));
}

await copyFile(path.join(dist, 'favicon.svg'), path.join(root, 'favicon.svg'));
await copyFile(path.join(dist, '.nojekyll'), path.join(root, '.nojekyll'));

console.log(`Published index.html -> ${entryScript}${entryStyle ? ` + ${entryStyle}` : ''}`);
