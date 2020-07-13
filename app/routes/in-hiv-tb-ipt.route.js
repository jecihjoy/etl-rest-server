var authorizer = require('../../authorization/etl-authorizer');
import {
    HivTBReport
} from '../../service/in-hiv-tb-ipt-monthly-summary.service';
var etlHelpers = require('../../etl-helpers');
var privileges = authorizer.getAllPrivileges();
var preRequest = require('../../pre-request-processing');
const routes = [
    {
        method: 'GET',
        path: '/etl/hiv-tb-ipt-monthly-summary',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        let requestParams = Object.assign({}, request.query, request.params);
                        let reportParams = etlHelpers.getReportParams('tb-on-hiv-monthly-summary',
                            ['endDate', 'locationUuids'],
                            requestParams);

                        let service = new HivTBReport('TbIptReport', reportParams.requestParams);
                        service.generateAggregateReport().then((result) => {
                            reply(result);

                        }).catch((error) => {
                            reply(error);
                        });
                    });

            },
            description: 'tb-on-hiv monthly summary dataset',
            notes: 'tb-on-hiv monthly summary dataset',
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
        path: '/etl/hiv-tb-ipt-monthly-summary-patient-list',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                request.query.reportName = 'tb-hiv-summary-patient-list';
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        let requestParams = Object.assign({}, request.query, request.params);

                        let requestCopy = _.cloneDeep(requestParams);
                        let reportParams = etlHelpers.getReportParams(request.query.reportName, ['startDate', 'endDate', 'locationUuids', 'locations'], requestParams);
                        const service = new HivTBReport('TbIptReport', requestCopy);

                        service.generatePatientListReport(requestParams.indicators.split(',')).then((results) => {
                            reply(results);
                        })
                            .catch((err) => {
                                reply(Boom.internal('An error occured', err));
                            });
                    });

            },
            description: 'Get patient list for tb-on-hiv monthly summary report of the location and month provided',
            notes: 'Returns patient list of tb-on-hiv monthly summary indicators',
            tags: ['api']
        }

    }
]
exports.routes = server => server.route(routes); 