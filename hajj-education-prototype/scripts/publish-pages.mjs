// Copies the Vite build output into the folder root so GitHub Pages can serve
// https://<user>.github.io/hajj-education-prototype/ directly from the branch.
import { copyFile, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const bundle = path.join(dist, 'assets', 'app.js');

if (!existsSync(bundle)) {
  throw new Error('dist/assets/app.js not found. Run "vite build" first.');
}

await rm(path.join(root, 'assets'), { recursive: true, force: true });
await cp(path.join(dist, 'assets'), path.join(root, 'assets'), { recursive: true });
await copyFile(path.join(dist, 'favicon.svg'), path.join(root, 'favicon.svg'));
await copyFile(path.join(dist, '.nojekyll'), path.join(root, '.nojekyll'));

console.log('Published dist/assets -> assets/, dist/favicon.svg, and dist/.nojekyll.');
