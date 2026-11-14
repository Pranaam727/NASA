import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backupsDir = path.join(rootDir, 'backups');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

function addDirectoryToZip(zip, folderPath, baseInZip = '', excludeList = []) {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    if (excludeList.includes(item)) continue;
    const fullPath = path.join(folderPath, item);
    const inZipPath = baseInZip ? `${baseInZip}/${item}` : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectoryToZip(zip, fullPath, inZipPath, excludeList);
    } else {
      zip.file(inZipPath, fs.readFileSync(fullPath));
    }
  }
}

async function createBackup1() {
  console.log('Generating ZIP 1: AstroCare_P12_Backup.zip (Complete standalone project)...');
  const zip = new JSZip();
  const excludeList = ['node_modules', 'dist', 'backups', '.git', '.gemini', '.system_generated', 'temp_extract'];

  // Root files
  const rootFiles = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'index.html',
    'PROJECT_HANDOFF.md',
    'PROMPT_STATUS.md',
    'CHANGELOG.md',
  ];

  for (const rf of rootFiles) {
    const fullP = path.join(rootDir, rf);
    if (fs.existsSync(fullP)) {
      zip.file(rf, fs.readFileSync(fullP));
    }
  }

  // src folder
  addDirectoryToZip(zip, path.join(rootDir, 'src'), 'src', excludeList);
  // integration folder
  addDirectoryToZip(zip, path.join(rootDir, 'integration'), 'integration', excludeList);
  // DOCUMENTATION folder
  addDirectoryToZip(zip, path.join(rootDir, 'DOCUMENTATION'), 'DOCUMENTATION', excludeList);

  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const targetPath = path.join(backupsDir, 'AstroCare_P12_Backup.zip');
  fs.writeFileSync(targetPath, content);
  console.log(`ZIP 1 created: ${targetPath} (${(content.length / 1024).toFixed(1)} KB)`);
}

async function createBackup2() {
  console.log('Generating ZIP 2: AstroCare_P12_Integration_Package.zip...');
  const zip = new JSZip();
  const excludeList = ['node_modules', 'dist', 'backups', '.git'];

  // src and integration
  addDirectoryToZip(zip, path.join(rootDir, 'src'), 'src', excludeList);
  addDirectoryToZip(zip, path.join(rootDir, 'integration'), 'integration', excludeList);

  // Key documentation
  zip.file('DOCUMENTATION/ASTROCARE_P12_MASTER_HANDOFF.md', fs.readFileSync(path.join(rootDir, 'DOCUMENTATION/ASTROCARE_P12_MASTER_HANDOFF.md')));
  zip.file('DOCUMENTATION/P12_INTEGRATION_GUIDE.md', fs.readFileSync(path.join(rootDir, 'DOCUMENTATION/P12_INTEGRATION_GUIDE.md')));
  zip.file('DOCUMENTATION/P12_DATA_DICTIONARY.md', fs.readFileSync(path.join(rootDir, 'DOCUMENTATION/P12_DATA_DICTIONARY.md')));
  zip.file('DOCUMENTATION/P12_NASA_RESOURCES.md', fs.readFileSync(path.join(rootDir, 'DOCUMENTATION/P12_NASA_RESOURCES.md')));
  zip.file('DOCUMENTATION/P12_DEPENDENCIES.md', fs.readFileSync(path.join(rootDir, 'DOCUMENTATION/P12_DEPENDENCIES.md')));
  zip.file('package.json', fs.readFileSync(path.join(rootDir, 'package.json')));

  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const targetPath = path.join(backupsDir, 'AstroCare_P12_Integration_Package.zip');
  fs.writeFileSync(targetPath, content);
  console.log(`ZIP 2 created: ${targetPath} (${(content.length / 1024).toFixed(1)} KB)`);
}

async function createBackup3() {
  console.log('Generating ZIP 3: AstroCare_P12_Prompt_Package.zip...');
  const zip = new JSZip();

  addDirectoryToZip(zip, path.join(rootDir, 'DOCUMENTATION'), 'DOCUMENTATION', []);
  zip.file('PROJECT_HANDOFF.md', fs.readFileSync(path.join(rootDir, 'PROJECT_HANDOFF.md')));
  zip.file('PROMPT_STATUS.md', fs.readFileSync(path.join(rootDir, 'PROMPT_STATUS.md')));
  zip.file('CHANGELOG.md', fs.readFileSync(path.join(rootDir, 'CHANGELOG.md')));

  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const targetPath = path.join(backupsDir, 'AstroCare_P12_Prompt_Package.zip');
  fs.writeFileSync(targetPath, content);
  console.log(`ZIP 3 created: ${targetPath} (${(content.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  await createBackup1();
  await createBackup2();
  await createBackup3();
  console.log('All 3 ZIP archives generated successfully!');
}

main().catch(console.error);
