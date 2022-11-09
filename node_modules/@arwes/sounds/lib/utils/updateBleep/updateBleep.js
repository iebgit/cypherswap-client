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
exports.updateBleep = void 0;
var updateBleep = function (bleep, audioSettings, playerSettings) {
    var settings = __assign(__assign({}, audioSettings), playerSettings);
    bleep._settings = settings;
    if (settings.volume !== undefined && settings.volume !== bleep._howl.volume()) {
        bleep._howl.volume(settings.volume);
    }
    if (settings.rate !== undefined && settings.rate !== bleep._howl.rate()) {
        bleep._howl.rate(settings.rate);
    }
    if (settings.loop !== undefined && settings.loop !== bleep._howl.loop()) {
        bleep._howl.loop(settings.loop);
    }
};
exports.updateBleep = updateBleep;
