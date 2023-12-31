"use strict";
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
var amqplib_1 = __importDefault(require("amqplib"));
var loger_1 = __importDefault(require("./loger"));
var log = loger_1.default.getLogger('RabbitApp');
var RabbitApp = /** @class */ (function () {
    function RabbitApp(options) {
        this.options = options;
        this.requestsQueueName = "".concat(this.options.name, ":requests");
        this.responsesQueueName = "".concat(this.options.name, ":responses");
    }
    Object.defineProperty(RabbitApp.prototype, "connection", {
        get: function () {
            return this._connection;
        },
        set: function (connection) {
            this._connection = connection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RabbitApp.prototype, "queuePidName", {
        get: function () {
            return "".concat(this.responsesQueueName, "-").concat(process.pid);
        },
        enumerable: false,
        configurable: true
    });
    RabbitApp.prototype.createConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.connection) return [3 /*break*/, 2];
                        log.debug('RabbitApp : creating connection');
                        _a = this;
                        return [4 /*yield*/, amqplib_1.default.connect(this.options.rabbit.url)];
                    case 1:
                        _a.connection = _b.sent();
                        ['error', 'close'].forEach(function (event) {
                            _this.connection.on(event, function () {
                                _this.connection = null;
                                _this.createConnection();
                            });
                        });
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.connection];
                }
            });
        });
    };
    RabbitApp.prototype.createChannel = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createConnection()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.createChannel()];
                    case 2:
                        channel = _a.sent();
                        log.debug("RabbitApp : creating channel and asserting to ".concat(queueName, " queue"));
                        if (!queueName) return [3 /*break*/, 4];
                        return [4 /*yield*/, channel.assertQueue(queueName, this.options)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, channel];
                }
            });
        });
    };
    RabbitApp.prototype.createResponsesChannel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.responsesChannel) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.createChannel(this.responsesQueueName)];
                    case 1:
                        _a.responsesChannel = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.responsesChannel];
                }
            });
        });
    };
    RabbitApp.prototype.createRequestsChannel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.requestsChannel) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.createChannel(this.requestsQueueName)];
                    case 1:
                        _a.requestsChannel = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.requestsChannel];
                }
            });
        });
    };
    RabbitApp.prototype.createChannelByPid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.pidChannel) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.createChannel(this.queuePidName)];
                    case 1:
                        _a.pidChannel = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.pidChannel];
                }
            });
        });
    };
    return RabbitApp;
}());
exports.default = RabbitApp;
