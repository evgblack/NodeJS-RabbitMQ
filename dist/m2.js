"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MicroService_1 = __importDefault(require("./MicroService"));
var loger_1 = __importDefault(require("./loger"));
var log = loger_1.default.getLogger('M2');
var app = new MicroService_1.default({
    name: 'data',
    rabbit: {
        url: process.env.RABBIT_URL,
    },
});
app.all('/status', function (req, res) {
    res.json({
        text: 'Thinking...',
    });
});
log.info('M2 : start');
app.start();
