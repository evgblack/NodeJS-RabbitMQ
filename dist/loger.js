"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var intel_1 = __importDefault(require("intel"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var LOG_LEVEL = intel_1.default.INFO;
var LOG_LEVEL_MAP = {
    'TRACE': intel_1.default.TRACE,
    'VERBOSE': intel_1.default.VERBOSE,
    'DEBUG': intel_1.default.DEBUG,
    'INFO': intel_1.default.INFO,
    'WARN': intel_1.default.WARN,
    'ERROR': intel_1.default.ERROR,
    'CRITICAL': intel_1.default.CRITICAL
};
if (process.env.LOG_LEVEL in LOG_LEVEL_MAP) {
    LOG_LEVEL = LOG_LEVEL_MAP[process.env.LOG_LEVEL];
}
intel_1.default.setLevel(LOG_LEVEL);
fs_extra_1.default.ensureFileSync(process.env.LOG_FILE);
intel_1.default.addHandler(new intel_1.default.handlers.File(process.env.LOG_FILE));
var loger = intel_1.default;
exports.default = loger;
