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
exports.filterClassAnimatorSettings = void 0;
var CLASS_ALLOWED_SETTINGS = [
    'duration',
    'animate',
    'root',
    'merge',
    'combine',
    'manager',
    'onAnimateMount',
    'onAnimateEntering',
    'onAnimateEntered',
    'onAnimateExiting',
    'onAnimateExited',
    'onAnimateUnmount'
];
function filterClassAnimatorSettings(providedSettings) {
    return CLASS_ALLOWED_SETTINGS
        .filter(function (key) { return providedSettings[key] !== undefined; })
        .reduce(function (obj, key) {
        var _a;
        return (__assign(__assign({}, obj), (_a = {}, _a[key] = providedSettings[key], _a)));
    }, {});
}
exports.filterClassAnimatorSettings = filterClassAnimatorSettings;
