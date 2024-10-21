"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRail = void 0;
var axios = require('axios');
var chalk = require('chalk');
var TestRail = /** @class */ (function () {
    function TestRail(options) {
        this.options = options;
        this.base = "".concat(options.host, "/index.php?/api/v2");
        this.runId = options.runId;
    }
    TestRail.prototype.publishResults = function (results) {
        var _this = this;
        return axios({
            method: 'post',
            url: "".concat(this.base, "/add_results_for_cases/").concat(this.runId),
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
            data: JSON.stringify({ results: results }),
        })
            .then(function (response) {
            console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
            console.log('\n', " - Results are published to ".concat(chalk.magenta("".concat(_this.options.host, "/index.php?/runs/view/").concat(_this.runId))), '\n');
        })
            .catch(function (error) { return console.error(error); });
    };
    return TestRail;
}());
exports.TestRail = TestRail;
//# sourceMappingURL=testrail.js.map