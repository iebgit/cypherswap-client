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
exports.mergeClassAndInstanceAnimatorSettings = void 0;
var filterClassAnimatorSettings_1 = require("../filterClassAnimatorSettings");
function mergeClassAndInstanceAnimatorSettings(providedClassAnimator, instanceAnimator) {
    var classAnimator = providedClassAnimator ? filterClassAnimatorSettings_1.filterClassAnimatorSettings(providedClassAnimator) : {};
    var newAnimatorSettings = __assign(__assign({}, classAnimator), instanceAnimator);
    var newDuration;
    if ((classAnimator === null || classAnimator === void 0 ? void 0 : classAnimator.duration) !== undefined) {
        newDuration = classAnimator.duration;
    }
    if ((instanceAnimator === null || instanceAnimator === void 0 ? void 0 : instanceAnimator.duration) !== undefined) {
        var newInstanceDuration = newDuration !== null && newDuration !== void 0 ? newDuration : {};
        newDuration = __assign(__assign({}, newInstanceDuration), instanceAnimator.duration);
    }
    if (newDuration) {
        newAnimatorSettings.duration = newDuration;
    }
    return newAnimatorSettings;
}
exports.mergeClassAndInstanceAnimatorSettings = mergeClassAndInstanceAnimatorSettings;
