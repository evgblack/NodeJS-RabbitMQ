"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var loger_1 = __importDefault(require("./loger"));
var log = loger_1.default.getLogger('Response');
var Response = /** @class */ (function () {
    function Response(responsesChannel, responsesQueueName, requestId) {
        this.statusCode = 200;
        this.headers = {};
        this._responsesChannel = responsesChannel;
        this._responsesQueueName = responsesQueueName;
        this._requestId = requestId;
    }
    Response.prototype._send = function (response) {
        this.response = response;
        log.debug("Response : sending response to ".concat(this._responsesQueueName, ": ").concat(JSON.stringify({
            response: response,
            statusCode: this.statusCode,
            headers: this.headers,
            requestId: this._requestId,
        })));
        this._responsesChannel.sendToQueue(this._responsesQueueName, Buffer.from(JSON.stringify({
            response: response,
            statusCode: this.statusCode,
            headers: this.headers,
            requestId: this._requestId,
        })));
    };
    Response.prototype.status = function (statusCode) {
        this.statusCode = statusCode;
        return this;
    };
    Response.prototype.writeHead = function (statusCode, headers) {
        if (headers === void 0) { headers = {}; }
        this.statusCode = statusCode;
        this.headers = headers;
        return this;
    };
    Response.prototype.end = function (response) {
        this._send(response);
        return this;
    };
    Response.prototype.json = function (response) {
        this.writeHead(this.statusCode, __assign(__assign({}, this.headers), { 'Content-Type': 'application/json' }));
        this._send(response);
        return this;
    };
    return Response;
}());
exports.default = Response;
