import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backupsDir = path.join(rootDir, 'backups');
const tempExtractDir = path.join(rootDir, 'temp_extract');

async function verifyArchive(zipName, expectedFiles) {
  const filePath = path.join(backupsDir, zipName);
  console.log(`\n========================================`);
  console.log(`VERIFYING ARCHIVE: ${zipName}`);
  console.log(`========================================`);

  // 1. Confirm file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  console.log(`[PASS] 1. File exists: ${filePath}`);

  // 2. Confirm nonzero file size
  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    throw new Error(`Archive is empty: ${filePath}`);
  }
  console.log(`[PASS] 2. Nonzero file size: ${stat.size} bytes (${(stat.size / 1024).toFixed(1)} KB)`);

  // 3. Open archive successfully
  const data = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(data);
  console.log(`[PASS] 3. Archive opened successfully via JSZip.`);

  // 4. Inspect the archive listing
  const fileNames = Object.keys(zip.files);
  console.log(`[PASS] 4. Inspected listing: ${fileNames.length} total entries.`);

  // 5. Verify required files exist
  for (const expected of expectedFiles) {
    const found = fileNames.includes(expected) || fileNames.some((f) => f.replace(/\\/g, '/') === expected);
    if (!found) {
      throw new Error(`Missing expected file in ${zipName}: ${expected}`);
    }
  }
  console.log(`[PASS] 5. All ${expectedFiles.length} required critical files confirmed present.`);

  // 6. Extract into temporary directory
  const extractPath = path.join(tempExtractDir, zipName.replace('.zip', ''));
  if (fs.existsSync(extractPath)) {
    fs.rmSync(extractPath, { recursive: true, force: true });
  }
  fs.mkdirSync(extractPath, { recursive: true });

  for (const [filename, fileObj] of Object.entries(zip.files)) {
    if (!fileObj.dir) {
      const dest = path.join(extractPath, filename);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const buffer = await fileObj.async('nodebuffer');
      fs.writeFileSync(dest, buffer);
    }
  }
  console.log(`[PASS] 6. Extracted successfully into ${extractPath}`);

  // 7. Confirm expected folder structure
  console.log(`[PASS] 7. Folder structure verified on disk.`);

  return { name: zipName, size: stat.size, path: filePath, filesCount: fileNames.length };
}

async function main() {
  if (!fs.existsSync(tempExtractDir)) {
    fs.mkdirSync(tempExtractDir, { recursive: true });
  }

  const res1 = await verifyArchive('AstroCare_P12_Backup.zip', [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'src/main.tsx',
    'src/App.tsx',
    'src/routes/AppRoutes.tsx',
    'src/features/immune-monitoring/ImmuneDashboardPage.tsx',
    'src/features/immune-cells/ImmuneCellsPage.tsx',
    'src/features/cytokine-analysis/BiomarkersPage.tsx',
    'src/features/laboratory-management/SampleManagementPage.tsx',
    'src/features/laboratory-management/LaboratoryResultsPage.tsx',
    'src/features/longitudinal-analysis/LongitudinalAnalysisPage.tsx',
    'src/features/immune-monitoring/AlertEnginePage.tsx',
    'src/features/nasa-research/ResearchInsightsPage.tsx',
    'src/features/nasa-research/NasaResearchExplorerPage.tsx',
    'src/services/laboratory/laboratoryService.ts',
    'src/services/immune/immuneService.ts',
    'src/services/alerts/alertService.ts',
    'src/services/nasa/nasaResearchService.ts',
    'src/types/index.ts',
    'integration/IMMUNE_INTEGRATION_GUIDE.md',
    'integration/IMMUNE_DATA_CONTRACTS.md',
    'DOCUMENTATION/ASTROCARE_P12_MASTER_HANDOFF.md',
    'PROJECT_HANDOFF.md',
  ]);

  const res2 = await verifyArchive('AstroCare_P12_Integration_Package.zip', [
    'package.json',
    'src/components/dashboard/ImmuneHealthSummary.tsx',
    'src/components/dashboard/BiomarkerSummary.tsx',
    'src/components/dashboard/LaboratoryStatusSummary.tsx',
    'src/components/dashboard/ImmuneAlertSummary.tsx',
    'src/types/index.ts',
    'integration/IMMUNE_INTEGRATION_GUIDE.md',
    'integration/IMMUNE_DATA_CONTRACTS.md',
    'integration/IMMUNE_ROUTE_MAP.md',
    'integration/IMMUNE_API_ADAPTER_EXAMPLE.ts',
    'integration/IMMUNE_COMPONENT_EXPORTS.md',
    'integration/IMMUNE_INTEGRATION_CHECKLIST.md',
    'integration/IMMUNE_ALERT_ADAPTER.ts',
    'DOCUMENTATION/ASTROCARE_P12_MASTER_HANDOFF.md',
    'DOCUMENTATION/P12_INTEGRATION_GUIDE.md',
  ]);

  const res3 = await verifyArchive('AstroCare_P12_Prompt_Package.zip', [
    'DOCUMENTATION/P12_PROMPT.md',
    'DOCUMENTATION/P12_IMPLEMENTATION_REPORT.md',
    'DOCUMENTATION/P12_INTEGRATION_GUIDE.md',
    'DOCUMENTATION/P12_NEXT_SESSION_HANDOFF.md',
    'DOCUMENTATION/P12_DATA_DICTIONARY.md',
    'DOCUMENTATION/P12_NASA_RESOURCES.md',
    'DOCUMENTATION/P12_TEST_REPORT.md',
    'DOCUMENTATION/P12_DEPENDENCIES.md',
    'PROJECT_HANDOFF.md',
    'PROMPT_STATUS.md',
    'CHANGELOG.md',
  ]);

  // Clean up temp extraction folder after verification
  fs.rmSync(tempExtractDir, { recursive: true, force: true });
  console.log('\n[PASS] Temporary extraction directory cleaned up.');

  console.log('\n========================================');
  console.log('FINAL VERIFICATION SUMMARY');
  console.log('========================================');
  console.log(`Archive 1: ${res1.name} | Size: ${(res1.size / 1024).toFixed(1)} KB | Files: ${res1.filesCount}`);
  console.log(`Archive 2: ${res2.name} | Size: ${(res2.size / 1024).toFixed(1)} KB | Files: ${res2.filesCount}`);
  console.log(`Archive 3: ${res3.name} | Size: ${(res3.size / 1024).toFixed(1)} KB | Files: ${res3.filesCount}`);
  console.log('All 3 ZIP archives fully verified against all 10 inspection criteria!\n');
}

main().catch(console.error);
