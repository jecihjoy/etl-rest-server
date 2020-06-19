var authorizer = require('../../authorization/etl-authorizer');
import {
    PrepMonthlySummaryService
} from '../../service/prep-monthly-summary.service';
var privileges = authorizer.getAllPrivileges();
const routes = [
    {
        method: 'GET',
        path: '/etl/prep-monthly-summary',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                let requestParams = Object.assign({}, request.query, request.params);
                requestParams.reportName = 'prepMonthlySummaryReport';
                let service = new PrepMonthlySummaryService();
                service.getAggregateReport(requestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });

            },
            description: 'prep monthly summary dataset',
            notes: 'prep monthly summary dataset',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {}
            }
        }
    },
    {
        method: 'GET',
        path: '/etl/prep-monthly-summary-patient-list',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                let requestParams = Object.assign({}, request.query, request.params);
                requestParams.reportName = 'prepMonthlySummaryReport';
                let service = new PrepMonthlySummaryService();
                service.getPatientListReport(requestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });

            },
            description: 'Get patient list for prep monthly summary report of the location and month provided',
            notes: 'Returns patient list of prep monthly summary indicators',
            tags: ['api']
        }

    }
]
exports.routes = server => server.route(routes);