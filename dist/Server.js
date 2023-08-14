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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var middlewares_1 = require("./middlewares");
var BaseApp_1 = __importDefault(require("./BaseApp"));
var loger_1 = __importDefault(require("./loger"));
var log = loger_1.default.getLogger('Server');
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server(options) {
        if (options === void 0) { options = { name: 'test-app' }; }
        var _this = _super.call(this, options) || this;
        _this.use((0, cookie_parser_1.default)());
        _this.use(middlewares_1.prepareRequest);
        _this.use(middlewares_1.upgradeServerResponse);
        return _this;
    }
    Server.prototype.createServer = function (port) {
        var _this = this;
        log.debug("starting to listen ".concat(port, " port"));
        return http_1.default
            .createServer(function (req, res) { return _this._next(req, res); })
            .listen(port);
    };
    return Server;
}(BaseApp_1.default));
exports.default = Server;
