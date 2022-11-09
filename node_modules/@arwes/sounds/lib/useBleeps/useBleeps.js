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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBleeps = void 0;
var react_1 = require("react");
var useBleepsSetup_1 = require("../useBleepsSetup");
var instanceIdCounter = 0;
function useBleeps() {
    var bleepsSetup = useBleepsSetup_1.useBleepsSetup();
    var instanceId = react_1.useMemo(function () { return instanceIdCounter++; }, []);
    var bleeps = react_1.useMemo(function () {
        if (!bleepsSetup) {
            return {};
        }
        return Object
            .keys(bleepsSetup.bleepsGenerics)
            .map(function (bleepName) {
            var bleepGeneric = bleepsSetup.bleepsGenerics[bleepName];
            var bleepItem = {
                name: bleepName,
                bleep: __assign(__assign({}, bleepGeneric), { play: function () { return bleepGeneric.play(instanceId); }, stop: function () { return bleepGeneric.stop(instanceId); } })
            };
            return bleepItem;
        })
            .reduce(function (bleeps, bleepItem) {
            var _a;
            var name = bleepItem.name, bleep = bleepItem.bleep;
            return __assign(__assign({}, bleeps), (_a = {}, _a[name] = bleep, _a));
        }, {});
    }, [bleepsSetup]);
    return bleeps;
}
exports.useBleeps = useBleeps;
