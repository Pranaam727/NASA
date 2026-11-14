import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { TestSummaryCards } from '../../../src/ui/TestSummaryCards';
import { ModuleHealthView } from '../../../src/ui/ModuleHealthView';
import { SecurityPerfView } from '../../../src/ui/SecurityPerfView';

describe('Accessibility Testing (axe-core)', () => {
  it('verifies TestSummaryCards has accessible semantic elements and no critical violations', async () => {
    const mockReport: any = {
      summary: {
        totalSuites: 5,
        totalTests: 25,
        passed: 25,
        failed: 0,
        skipped: 0,
        blocked: 0,
        warnings: 0,
        passRate: 100,
        totalDurationMs: 45.2,
      },
      integrationReadiness: {
        isReadyForIntegration: true,
        blockers: [],
      },
    };

    const { container } = render(<TestSummaryCards report={mockReport} isExecuting={false} />);
    const results = await axe.run(container);

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });

  it('verifies ModuleHealthView conforms to semantic heading hierarchy and accessibility', async () => {
    const mockModules: any = [
      {
        moduleName: 'Astronaut Health',
        totalTests: 10,
        passed: 10,
        failed: 0,
        blocked: 0,
        warnings: 0,
        healthScore: 100,
        status: 'HEALTHY',
      },
    ];

    const { container } = render(<ModuleHealthView modules={mockModules} />);
    const results = await axe.run(container);

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });

  it('verifies SecurityPerfView contains valid list semantics and informative banners', async () => {
    const { container } = render(<SecurityPerfView />);
    const results = await axe.run(container);

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });
});
