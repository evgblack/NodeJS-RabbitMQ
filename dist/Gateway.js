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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RabbitApp_1 = __importDefault(require("./RabbitApp"));
var Server_1 = __importDefault(require("./Server"));
var utils_1 = require("./utils");
var nanoid_1 = require("nanoid");
var loger_1 = __importDefault(require("./loger"));
var log = loger_1.default.getLogger('Gateway');
var Gateway = /** @class */ (function (_super) {
    __extends(Gateway, _super);
    function Gateway(options) {
        var _this = _super.call(this, __assign({ requests: {
                timeout: 10000,
            } }, options)) || this;
        _this._requests = new Map();
        _this._microservices = options.microservices.reduce(function (object, name) {
            var _a;
            return (__assign(__assign({}, object), (_a = {}, _a[name] = new RabbitApp_1.default({
                rabbit: options.rabbit,
                name: name,
            }), _a)));
        }, {});
        return _this;
    }
    Gateway.prototype._startConsumers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._consumersStarting) {
                            return [2 /*return*/];
                        }
                        this._consumersStarting = true;
                        return [4 /*yield*/, this.createConnection()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, Promise.all(Object.values(this._microservices).map(function (microservice) { return __awaiter(_this, void 0, void 0, function () {
                                var channel;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // reuse gateway connection for microservices
                                            microservice.connection = connection;
                                            return [4 /*yield*/, Promise.all([
                                                    microservice.createChannelByPid({
                                                        autoDelete: true,
                                                    }),
                                                    // prepare requests channel for delegate method
                                                    microservice.createRequestsChannel(),
                                                ])];
                                        case 1:
                                            channel = (_a.sent())[0];
                                            log.debug("Gateway : starting to consume ".concat(microservice.queuePidName));
                                            channel.consume(microservice.queuePidName, function (message) { return __awaiter(_this, void 0, void 0, function () {
                                                var json, statusCode, response, headers, requestId, request, timer, res, resolve;
                                                return __generator(this, function (_a) {
                                                    json = (0, utils_1.parseRabbitMessage)(message);
                                                    if (!json) {
                                                        channel.ack(message);
                                                        return [2 /*return*/];
                                                    }
                                                    statusCode = json.statusCode, response = json.response;
                                                    headers = json.headers, requestId = json.requestId;
                                                    request = this._requests.get(requestId);
                                                    if (!request || !response) {
                                                        channel.ack(message);
                                                        return [2 /*return*/];
                                                    }
                                                    timer = request.timer, res = request.res, resolve = request.resolve;
                                                    clearTimeout(timer);
                                                    res.writeHead(statusCode, headers);
                                                    res.end(typeof response === 'object' ? JSON.stringify(response) : response);
                                                    log.debug("Gateway : sending response to client: ".concat(statusCode, " ").concat(typeof response === 'object' ? JSON.stringify(response) : response));
                                                    resolve();
                                                    channel.ack(message);
                                                    this._requests.delete(requestId);
                                                    return [2 /*return*/];
                                                });
                                            }); });
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        this._consumersReady = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Gateway.prototype.delegate = function (name, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var microservice, error, resolve, requestsChannel, promise, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._consumersReady) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._startConsumers()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        microservice = this._microservices[name];
                        if (!microservice) {
                            error = new Error("Microservice ".concat(name, " not found"));
                            log.error('Gateway : Error', error);
                            throw error;
                        }
                        return [4 /*yield*/, microservice.createRequestsChannel()];
                    case 3:
                        requestsChannel = _a.sent();
                        promise = new Promise(function (r) { return (resolve = r); });
                        message = {
                            path: (req.originalUrl || req.url).split('?')[0],
                            method: req.method.toLowerCase(),
                            params: req.params,
                            query: req.query,
                            body: req.body,
                            headers: req.headers,
                            cookies: req.cookies,
                            session: req.session,
                            connection: {
                                connecting: req.connection.connecting,
                                destroyed: req.connection.destroyed,
                                localAddress: req.connection.localAddress,
                                localPort: req.connection.localPort,
                                pending: req.connection.pending,
                                remoteAddress: req.connection.remoteAddress,
                                remoteFamily: req.connection.remoteFamily,
                                remotePort: req.connection.remotePort,
                            },
                            requestId: (0, nanoid_1.nanoid)(),
                            queue: microservice.queuePidName,
                        };
                        this._requests.set(message.requestId, {
                            timer: setTimeout(function () {
                                res.writeHead(408, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({
                                    error: 'Timed out',
                                }));
                                _this._requests.delete(message.requestId);
                            }, this.options.requests.timeout),
                            res: res,
                            resolve: resolve,
                        });
                        log.debug("Gateway : sending request to ".concat(microservice.requestsQueueName, ": ").concat(JSON.stringify(message)));
                        requestsChannel.sendToQueue(microservice.requestsQueueName, Buffer.from(JSON.stringify(message)));
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    ;
    Gateway.prototype.listen = function (port) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._consumersReady) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._startConsumers()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.createServer(port);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Gateway;
}(Server_1.default));
exports.default = Gateway;
