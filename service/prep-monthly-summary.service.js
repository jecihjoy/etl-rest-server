const Promise = require('bluebird');
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';
import {
    PatientlistMysqlReport
} from '../app/reporting-framework/patientlist-mysql.report';
const indicatorDefinitions = require('./prep-indicator-definitions.json');
export class PrepMonthlySummaryService {
    getAggregateReport(reportParams) {
        if (reportParams.locationUuids) {
            let locationUuids = reportParams.locationUuids ? reportParams.locationUuids.split(',') : [];
            reportParams.locationUuids = locationUuids;

        }
        return new Promise(function (resolve, reject) {
            let report = new BaseMysqlReport('prepMonthlySummaryReport', reportParams);
            Promise.join(report.generateReport(),
                (results) => {
                    let result = results.results.results;
                    results.size = result ? result.length : 0;
                    results.result = result;
                    results.sectionDefinitions = indicatorDefinitions;
                    delete results['results'];
                    resolve(results);
                }).catch((errors) => {
                    console.error('Error', errors);
                    reject(errors);
                });
        });
    }

    getPatientListReport(reportParams) {
        let indicators = reportParams.indicators ? reportParams.indicators.split(',') : [];
        if (reportParams.locationUuids) {
            let locationUuids = reportParams.locationUuids ? reportParams.locationUuids.split(',') : [];
            reportParams.locationUuids = locationUuids;

        }
        let report = new PatientlistMysqlReport('prepMonthlySummaryReport', reportParams);
        return new Promise(function (resolve, reject) {
            Promise.join(report.generatePatientListReport(indicators),
                (results) => {
                    resolve(results);
                }).catch((errors) => {
                    console.error('Error', errors);
                    reject(errors);
                });
        });
    }
}