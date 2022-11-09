"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeScheduler = void 0;
function makeScheduler() {
    var timeouts = {};
    function stop(id) {
        clearTimeout(timeouts[id]);
    }
    function stopAll() {
        Object.values(timeouts).forEach(function (timeout) { return clearTimeout(timeout); });
    }
    function start(a, b, c) {
        var id = c ? a : undefined;
        var time = c ? b : a;
        var callback = c || b;
        stop(id);
        timeouts[id] = setTimeout(callback, time);
    }
    return { stop: stop, stopAll: stopAll, start: start };
}
exports.makeScheduler = makeScheduler;
