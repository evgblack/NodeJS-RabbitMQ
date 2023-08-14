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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var methods_1 = __importDefault(require("methods"));
var path_to_regexp_1 = require("path-to-regexp");
var RabbitApp_1 = __importDefault(require("./RabbitApp"));
var utils_1 = require("./utils");
var BaseApp = /** @class */ (function (_super) {
    __extends(BaseApp, _super);
    function BaseApp(options) {
        var _this = _super.call(this, options) || this;
        _this._handlers = new Map();
        _this._middlewares = [];
        return _this;
    }
    BaseApp.prototype._next = function (req, res, idx) {
        if (idx === void 0) { idx = -1; }
        if (this._middlewares.length > idx + 1) {
            var _a = this._middlewares[idx + 1], match = _a.match, fn = _a.fn;
            return match(req)
                ? fn(req, res)
                : this._next(req, res, idx + 1);
        }
    };
    BaseApp.prototype._createEndpoint = function (path, method) {
        var _this = this;
        var middlewares = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            middlewares[_i - 2] = arguments[_i];
        }
        var paths = path && (0, utils_1.toArray)(path).map(function (path) {
            var keys = [];
            return {
                regex: (0, path_to_regexp_1.pathToRegexp)(path, keys),
                keys: keys,
            };
        });
        middlewares.forEach(function (middleware) {
            var idx = _this._middlewares.length;
            _this._middlewares.push({
                match: function (req) {
                    var pathMatch = !paths || paths.find(function (path) { return path.regex.test(req.path); });
                    var methodMatch = !method || req.method === method;
                    if (typeof pathMatch === 'object') {
                        req.params = __assign(__assign({}, req.params), req.path.match(pathMatch.regex).slice(1).reduce(function (object, value, index) {
                            var _a;
                            var name = pathMatch.keys[index].name;
                            return name ? __assign(__assign({}, object), (_a = {}, _a[name] = value, _a)) : object;
                        }, {}));
                    }
                    return pathMatch && methodMatch;
                },
                fn: function (req, res) { return middleware(req, res, function () { return _this._next(req, res, idx); }); },
            });
        });
    };
    BaseApp.prototype.on = function (event, handler) {
        this._handlers.set(event, handler);
        return this;
    };
    BaseApp.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handler = this._handlers.get(event);
        if (!handler) {
            console.error("Emitting on not found handler was ignored (".concat(event, ")"));
            return;
        }
        handler.apply(void 0, args);
        return this;
    };
    BaseApp.prototype.use = function () {
        var middlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
        }
        this._createEndpoint.apply(this, __spreadArray([undefined, undefined], middlewares, false));
        return this;
    };
    BaseApp.prototype.all = function (path) {
        var middlewares = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            middlewares[_i - 1] = arguments[_i];
        }
        this._createEndpoint.apply(this, __spreadArray([path, undefined], middlewares, false));
        return this;
    };
    return BaseApp;
}(RabbitApp_1.default));
methods_1.default.forEach(function (method) {
    BaseApp.prototype[method] = function (path) {
        var middlewares = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            middlewares[_i - 1] = arguments[_i];
        }
        this._createEndpoint.apply(this, __spreadArray([path, method], middlewares, false));
        return this;
    };
});
exports.default = BaseApp;
