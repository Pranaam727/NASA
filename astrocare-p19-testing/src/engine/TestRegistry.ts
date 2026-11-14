/**
 * AstroCare Test Registry
 * Structured repository for registering and discovering test definitions and historical results.
 */

import {
  TestCaseResult,
  TestSuiteDefinition,
  TestCategory,
  TestSeverity,
  TestStatus,
} from '../types/test-results';

export class TestRegistry {
  private suites: Map<string, TestSuiteDefinition> = new Map();
  private resultsHistory: TestCaseResult[] = [];

  /**
   * Register a full test suite
   */
  public registerSuite(suite: TestSuiteDefinition): void {
    if (this.suites.has(suite.id)) {
      throw new Error(`Test suite with ID "${suite.id}" is already registered.`);
    }
    // Verify unique test IDs within the suite
    const ids = new Set<string>();
    for (const test of suite.tests) {
      if (ids.has(test.id)) {
        throw new Error(`Duplicate test ID "${test.id}" within suite "${suite.id}".`);
      }
      ids.add(test.id);
    }
    this.suites.set(suite.id, suite);
  }

  /**
   * Retrieve all registered suites
   */
  public getAllSuites(): TestSuiteDefinition[] {
    return Array.from(this.suites.values());
  }

  /**
   * Find suite by ID
   */
  public getSuite(id: string): TestSuiteDefinition | undefined {
    return this.suites.get(id);
  }

  /**
   * Find suites by category
   */
  public getSuitesByCategory(category: TestCategory): TestSuiteDefinition[] {
    return this.getAllSuites().filter((s) => s.category === category);
  }

  /**
   * Find suites by module name
   */
  public getSuitesByModule(moduleName: string): TestSuiteDefinition[] {
    return this.getAllSuites().filter((s) => s.moduleName === moduleName);
  }

  /**
   * Record an execution result
   */
  public recordResult(result: TestCaseResult): void {
    this.resultsHistory.push(result);
  }

  /**
   * Clear recorded history
   */
  public clearResultsHistory(): void {
    this.resultsHistory = [];
  }

  /**
   * Filter historical results
   */
  public filterResults(criteria: {
    category?: TestCategory;
    severity?: TestSeverity;
    status?: TestStatus;
    moduleName?: string;
  }): TestCaseResult[] {
    return this.resultsHistory.filter((res) => {
      if (criteria.category && res.category !== criteria.category) return false;
      if (criteria.severity && res.severity !== criteria.severity) return false;
      if (criteria.status && res.status !== criteria.status) return false;
      if (criteria.moduleName && res.moduleName !== criteria.moduleName) return false;
      return true;
    });
  }

  /**
   * Get all recorded results
   */
  public getHistory(): TestCaseResult[] {
    return [...this.resultsHistory];
  }

  /**
   * Reset the registry (useful for unit tests)
   */
  public reset(): void {
    this.suites.clear();
    this.resultsHistory = [];
  }
}
