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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nanoid_1 = require("nanoid");
var BaseApp_1 = __importDefault(require("./BaseApp"));
var RabbitApp_1 = __importDefault(require("./RabbitApp"));
var Response_1 = __importDefault(require("./Response"));
var Server_1 = __importDefault(require("./Server"));
var utils_1 = require("./utils");
var loger_1 = __importDefault(require("./loger"));
var log = loger_1.default.getLogger('MicroService');
var MicroService = /** @class */ (function (_super) {
    __extends(MicroService, _super);
    function MicroService(options) {
        var _this = _super.call(this, options) || this;
        _this._requests = new Map();
        if (options.microservices && options.microservices.length) {
            _this._microservices = options.microservices.reduce(function (object, name) {
                var _a;
                return (__assign(__assign({}, object), (_a = {}, _a[name] = new RabbitApp_1.default({
                    rabbit: options.rabbit,
                    name: name,
                }), _a)));
            }, {});
        }
        return _this;
    }
    MicroService.prototype._startConsumers = function () {
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
                                            // reuse current microservice connection
                                            microservice.connection = connection;
                                            return [4 /*yield*/, Promise.all([
                                                    microservice.createChannelByPid({
                                                        autoDelete: true,
                                                    }),
                                                    // prepare requests channel for this.ask
                                                    microservice.createRequestsChannel(),
                                                ])];
                                        case 1:
                                            channel = (_a.sent())[0];
                                            channel.consume(microservice.queuePidName, function (message) {
                                                var json = (0, utils_1.parseRabbitMessage)(message);
                                                if (!json) {
                                                    channel.ack(message);
                                                    return;
                                                }
                                                var response = json.response, statusCode = json.statusCode, requestId = json.requestId;
                                                var resolve = _this._requests.get(requestId).resolve;
                                                resolve({ status: statusCode, response: response });
                                                _this._requests.delete(requestId);
                                                channel.ack(message);
                                            });
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
    MicroService.prototype.ask = function (name, query) {
        return __awaiter(this, void 0, void 0, function () {
            var microservice, error, resolve, requestId, promise, channel;
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
                            log.error('MicroService : Error', error);
                            throw error;
                        }
                        requestId = (0, nanoid_1.nanoid)();
                        promise = new Promise(function (r) { return (resolve = r); });
                        this._requests.set(requestId, { resolve: resolve });
                        return [4 /*yield*/, microservice.createRequestsChannel()];
                    case 3:
                        channel = _a.sent();
                        return [4 /*yield*/, channel.sendToQueue(microservice.requestsQueueName, Buffer.from(JSON.stringify(__assign(__assign({}, query), { requestId: requestId, queue: microservice.queuePidName }))))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    MicroService.prototype.listen = function (port) {
        var _this = this;
        var server = new Server_1.default();
        server.all('(.*)', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req.app = this;
                        res.app = this;
                        return [4 /*yield*/, this._next(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return server.createServer(port);
    };
    MicroService.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestsChannel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRequestsChannel()];
                    case 1:
                        requestsChannel = _a.sent();
                        log.debug("MicroService : starting to consume ".concat(this.requestsQueueName));
                        // prepare responses channel before consume
                        return [4 /*yield*/, this.createResponsesChannel()];
                    case 2:
                        // prepare responses channel before consume
                        _a.sent();
                        requestsChannel.consume(this.requestsQueueName, function (message) { return __awaiter(_this, void 0, void 0, function () {
                            var json, requestId, queue, request, responsesChannel, response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        json = (0, utils_1.parseRabbitMessage)(message);
                                        if (!json) {
                                            requestsChannel.ack(message);
                                            return [2 /*return*/];
                                        }
                                        requestId = json.requestId, queue = json.queue, request = __rest(json, ["requestId", "queue"]);
                                        return [4 /*yield*/, this.createResponsesChannel()];
                                    case 1:
                                        responsesChannel = _a.sent();
                                        response = new Response_1.default(responsesChannel, queue, requestId);
                                        request.app = this;
                                        response.app = this;
                                        return [4 /*yield*/, this._next(request, response)];
                                    case 2:
                                        _a.sent();
                                        requestsChannel.ack(message);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    return MicroService;
}(BaseApp_1.default));
exports.default = MicroService;
