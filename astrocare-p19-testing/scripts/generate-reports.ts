import { TestOrchestrator } from './src/engine/TestOrchestrator';
import { TestReportGenerator } from './src/engine/TestReportGenerator';
import { createDefaultSuites } from './src/ui/default-suites';
import * as fs from 'fs';
import * as path from 'path';

async function generateSampleReports() {
  const orchestrator = new TestOrchestrator();
  createDefaultSuites().forEach((s) => orchestrator.registerSuite(s));

  console.log('Running test suites to generate authoritative sample reports...');
  const report = await orchestrator.runAll();

  const reportsDir = path.resolve(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // 1. JSON Report
  const jsonContent = TestReportGenerator.toJSON(report);
  fs.writeFileSync(path.join(reportsDir, 'AstroCare_QA_Report.json'), jsonContent, 'utf-8');

  // 2. HTML Report
  const htmlContent = TestReportGenerator.toHTML(report);
  fs.writeFileSync(path.join(reportsDir, 'AstroCare_QA_Report.html'), htmlContent, 'utf-8');

  // 3. CSV Report
  const csvContent = TestReportGenerator.toCSV(report);
  fs.writeFileSync(path.join(reportsDir, 'AstroCare_QA_Report.csv'), csvContent, 'utf-8');

  console.log('Sample reports successfully written to ./reports/');
}

generateSampleReports().catch(console.error);
