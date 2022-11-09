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
exports.createOrUpdateBleeps = void 0;
var constants_1 = require("../../constants");
var createBleep_1 = require("../createBleep");
var updateBleep_1 = require("../updateBleep");
var unloadBleep_1 = require("../unloadBleep");
var unloadBleeps_1 = require("../unloadBleeps");
var createOrUpdateBleeps = function (providedBleeps, audioSettings, playersSettings, bleepsSettings) {
    var _a;
    var bleeps = providedBleeps !== null && providedBleeps !== void 0 ? providedBleeps : {};
    if ((_a = audioSettings.common) === null || _a === void 0 ? void 0 : _a.disabled) {
        unloadBleeps_1.unloadBleeps(bleeps);
        return bleeps;
    }
    Object.keys(bleepsSettings).forEach(function (bleepName) {
        var _a, _b, _c, _d;
        var bleepSettings = bleepsSettings[bleepName];
        if (!bleepSettings) {
            unloadBleep_1.unloadBleep(bleeps, bleepName);
            return;
        }
        var bleepCategory = bleepSettings.category;
        if (process.env.NODE_ENV !== 'production' &&
            bleepCategory !== undefined &&
            !constants_1.BLEEPS_CATEGORIES.includes(bleepCategory)) {
            throw new Error("Bleep category \"" + bleepCategory + "\" is not valid.");
        }
        var audioCategorySettings = (_a = audioSettings.categories) === null || _a === void 0 ? void 0 : _a[bleepCategory];
        var processedAudioSettings = __assign(__assign({}, audioSettings.common), audioCategorySettings);
        if (processedAudioSettings.disabled) {
            unloadBleep_1.unloadBleep(bleeps, bleepName);
            return;
        }
        var playerSettings = playersSettings[bleepSettings.player];
        if (!playerSettings) {
            throw new Error("Component bleep requires a provided player. Player \"" + bleepSettings.player + "\" was not found.");
        }
        if (playerSettings.disabled) {
            unloadBleep_1.unloadBleep(bleeps, bleepName);
            return;
        }
        // If a bleep has updated `src` or `format` settings, it should be re-created.
        // Otherwise it is updated to be fast and prevent more HTTP requests.
        var hasBleepUpdatedSrc = !!((_b = bleeps[bleepName]) === null || _b === void 0 ? void 0 : _b._settings.src.find(function (v, i) { return v !== playerSettings.src[i]; }));
        var hasBleepUpdatedFormat = !!((_d = (_c = bleeps[bleepName]) === null || _c === void 0 ? void 0 : _c._settings.format) === null || _d === void 0 ? void 0 : _d.find(function (v, i) { var _a; return v !== ((_a = playerSettings.format) === null || _a === void 0 ? void 0 : _a[i]); }));
        if (bleeps[bleepName] && !hasBleepUpdatedSrc && !hasBleepUpdatedFormat) {
            updateBleep_1.updateBleep(bleeps[bleepName], processedAudioSettings, playerSettings);
        }
        else {
            unloadBleep_1.unloadBleep(bleeps, bleepName);
            bleeps[bleepName] = createBleep_1.createBleep(processedAudioSettings, playerSettings);
        }
    });
    return bleeps;
};
exports.createOrUpdateBleeps = createOrUpdateBleeps;
