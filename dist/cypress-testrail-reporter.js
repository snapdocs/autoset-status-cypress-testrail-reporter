"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressTestRailReporter = void 0;
var mocha_1 = require("mocha");
var testrail_1 = require("./testrail");
var shared_1 = require("./shared");
var testrail_interface_1 = require("./testrail.interface");
var CypressTestRailReporter = /** @class */ (function (_super) {
    __extends(CypressTestRailReporter, _super);
    function CypressTestRailReporter(runner, options) {
        var _this = _super.call(this, runner) || this;
        var reporterOptions = options.reporterOptions;
        if (process.env.CYPRESS_TESTRAIL_REPORTER_PASSWORD) {
            reporterOptions.password = process.env.CYPRESS_TESTRAIL_REPORTER_PASSWORD;
        }
        _this.testRail = new testrail_1.TestRail(reporterOptions);
        _this.validate(reporterOptions, 'host');
        _this.validate(reporterOptions, 'username');
        _this.validate(reporterOptions, 'password');
        _this.validate(reporterOptions, 'projectId');
        _this.validate(reporterOptions, 'runId');
        runner.on('pass', function (test) {
            var caseIds = (0, shared_1.titleToCaseIds)(test.title);
            if (caseIds.length > 0) {
                // For each item in caseIds, create a new result object
                for (var i = 0; i < caseIds.length; i++) {
                    var result = [];
                    result[0] = {
                        case_id: caseIds[i],
                        status_id: testrail_interface_1.Status.Passed,
                        comment: "Execution time: ".concat(test.duration, "ms")
                    };
                    _this.testRail.publishResults(result);
                }
            }
        });
        runner.on('fail', function (test) {
            var caseIds = (0, shared_1.titleToCaseIds)(test.title);
            if (caseIds.length > 0) {
                // For each item in caseIds, create a new result object
                // Test
                for (var i = 0; i < caseIds.length; i++) {
                    var result = [];
                    result[0] = {
                        case_id: caseIds[i],
                        status_id: testrail_interface_1.Status.Failed,
                        comment: "".concat(test.err.message)
                    };
                    _this.testRail.publishResults(result);
                }
            }
        });
        runner.on('end', function () {
            // publish test cases results & close the run
            // Do Nothing, all results should already be published
        });
        return _this;
    }
    CypressTestRailReporter.prototype.validate = function (options, name) {
        if (options == null) {
            throw new Error('Missing reporterOptions in cypress.json');
        }
        if (options[name] == null) {
            throw new Error("Missing ".concat(name, " value. Please update reporterOptions in cypress.json"));
        }
    };
    return CypressTestRailReporter;
}(mocha_1.reporters.Spec));
exports.CypressTestRailReporter = CypressTestRailReporter;
//# sourceMappingURL=cypress-testrail-reporter.js.map