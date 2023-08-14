"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRabbitMessage = exports.isRpcAction = exports.toArray = void 0;
var toArray = function (value) { return Array.isArray(value) ? value : [value]; };
exports.toArray = toArray;
var isRpcAction = function (message) { return typeof message === 'object' && typeof message.server === 'object' && typeof message.server.action === 'string'; };
exports.isRpcAction = isRpcAction;
var parseRabbitMessage = function (message) {
    if (!message) {
        return;
    }
    var content = message.content.toString();
    if (!content) {
        return;
    }
    var json;
    try {
        json = JSON.parse(content);
    }
    catch (err) {
        console.error('Cannot parse rabbit message', err);
    }
    return json;
};
exports.parseRabbitMessage = parseRabbitMessage;
