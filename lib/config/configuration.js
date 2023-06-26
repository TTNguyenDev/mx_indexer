"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = void 0;
var fs_1 = require("fs");
var yaml = require("js-yaml");
var path_1 = require("path");
var YAML_CONFIG_FILENAME = "config.yaml";
function readConfig() {
    var fileStr = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, YAML_CONFIG_FILENAME), "utf8");
    var env = process.env;
    Object.entries(env).map(function (_a) {
        var k = _a[0], v = _a[1];
        fileStr = fileStr.replace(new RegExp("\\$\\{".concat(k, "\\}"), "gm"), v || "");
    });
    return yaml.load(fileStr);
}
exports.readConfig = readConfig;
//# sourceMappingURL=configuration.js.map