import { reporters } from 'mocha';
import { TestRail } from './testrail';
import { titleToCaseIds } from './shared';
import { Status, TestRailResult } from './testrail.interface';

export class CypressTestRailReporter extends reporters.Spec {
  private testRail: TestRail;

  constructor(runner: any, options: any) {
    super(runner);

    let reporterOptions = options.reporterOptions;

    if (process.env.CYPRESS_TESTRAIL_REPORTER_PASSWORD) {
      reporterOptions.password = process.env.CYPRESS_TESTRAIL_REPORTER_PASSWORD;
    }

    this.testRail = new TestRail(reporterOptions);
    this.validate(reporterOptions, 'host');
    this.validate(reporterOptions, 'username');
    this.validate(reporterOptions, 'password');
    this.validate(reporterOptions, 'projectId');
    this.validate(reporterOptions, 'runId');

    runner.on('pass', test => {
      const caseIds = titleToCaseIds(test.title);
      if (caseIds.length > 0) {
        
        // For each item in caseIds, create a new result object
        for (let i = 0; i < caseIds.length; i++) {
          var result: TestRailResult[] = [];
          result[0] = {
              case_id: caseIds[i],
              status_id: Status.Passed,
              comment: `Execution time: ${test.duration}ms`
            };
          this.testRail.publishResults(result)
        }
      }
    });

    runner.on('fail', test => {
      const caseIds = titleToCaseIds(test.title);
      if (caseIds.length > 0) {
        // For each item in caseIds, create a new result object
        // Test
        for (let i = 0; i < caseIds.length; i++) {
          var result: TestRailResult[] = [];
          result[0] = {
              case_id: caseIds[i],
              status_id: Status.Failed,
              comment: `${test.err.message}`
            };
          this.testRail.publishResults(result)
        }
      }
    });

    runner.on('end', () => {
      // publish test cases results & close the run
      // Do Nothing, all results should already be published
    });
  }

  private validate(options, name: string) {
    if (options == null) {
      throw new Error('Missing reporterOptions in cypress.json');
    }
    if (options[name] == null) {
      throw new Error(`Missing ${name} value. Please update reporterOptions in cypress.json`);
    }
  }
}
