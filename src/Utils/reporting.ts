import * as reporter from 'cucumber-html-reporter';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdrip from 'mkdirp';

const jsonReports = path.join(process.cwd(), '/Reporting/json');
const htmlReports = path.join(process.cwd(), '/Reporting/html');

const cucumberReporterOptions: reporter.Options = {
  jsonDir: jsonReports,
  output: `${htmlReports}/cucumber_reporter.html`,
  reportSuiteAsScenarios: true,
  theme: 'bootstrap',
  name: 'Assessment',
  launchReport: true,
  ignoreBadJsonFile: true,
};

export class Reporter {
  public static createDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      mkdrip.sync(dir);
    }
  }

  public static htmlReportGen() {
    try {
      reporter.generate(cucumberReporterOptions);
    } catch (err) {
      if (err) {
        console.log(err);
        throw new Error('Failed to save cucumber test results to json file.');
      }
    }
  }
}
