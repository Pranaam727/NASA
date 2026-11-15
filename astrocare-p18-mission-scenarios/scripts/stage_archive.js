import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple script to bundle into a zip using native powershell/.NET or built-in methods
const rootDir = process.cwd();
const stageDir = path.join(rootDir, '_stage_zip');

if (fs.existsSync(stageDir)) {
  fs.rmSync(stageDir, { recursive: true, force: true });
}
fs.mkdirSync(stageDir, { recursive: true });

const excludes = new Set(['node_modules', 'dist', '_stage_zip', '.git']);

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (excludes.has(entry.name) || entry.name.endsWith('.zip')) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(rootDir, stageDir);
console.log('Staging completed in', stageDir);
