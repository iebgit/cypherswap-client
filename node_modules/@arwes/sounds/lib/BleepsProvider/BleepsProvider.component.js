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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleepsProvider = void 0;
var react_1 = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var constants_1 = require("../constants");
var BleepsContext_1 = require("../BleepsContext");
var createOrUpdateBleeps_1 = require("../utils/createOrUpdateBleeps");
var BleepsProvider = function (props) {
    var parentSetup = react_1.useContext(BleepsContext_1.BleepsContext);
    // The bleeps object reference is always kept to properly unload/remove/update
    // current playing bleeps before settings updates.
    // Also, bleeps can not be extended in multiple providers to independently
    // manage them by each provider in the tree.
    var bleepsGenerics = react_1.useState({})[0];
    var bleepsSetup = react_1.useMemo(function () {
        var _a, _b;
        var parentAudioCategories = parentSetup === null || parentSetup === void 0 ? void 0 : parentSetup.audioSettings.categories;
        var localAudioCategories = (_a = props.audioSettings) === null || _a === void 0 ? void 0 : _a.categories;
        var audioCategories = __assign({}, parentAudioCategories);
        if (localAudioCategories) {
            Object.keys(localAudioCategories).forEach(function (key) {
                var categoryName = key;
                if (process.env.NODE_ENV !== 'production' &&
                    !constants_1.BLEEPS_CATEGORIES.includes(categoryName)) {
                    throw new Error("Bleep category \"" + categoryName + "\" is not valid.");
                }
                audioCategories[categoryName] = __assign(__assign({}, audioCategories[categoryName]), localAudioCategories === null || localAudioCategories === void 0 ? void 0 : localAudioCategories[categoryName]);
            });
        }
        var audioSettings = {
            common: __assign(__assign({}, parentSetup === null || parentSetup === void 0 ? void 0 : parentSetup.audioSettings.common), (_b = props.audioSettings) === null || _b === void 0 ? void 0 : _b.common),
            categories: audioCategories
        };
        var parentPlayersSettings = parentSetup === null || parentSetup === void 0 ? void 0 : parentSetup.playersSettings;
        var playersSettings = __assign({}, parentPlayersSettings);
        if (props.playersSettings) {
            Object.keys(props.playersSettings).forEach(function (playerName) {
                var _a;
                playersSettings[playerName] = __assign(__assign({}, playersSettings[playerName]), (_a = props.playersSettings) === null || _a === void 0 ? void 0 : _a[playerName]);
            });
        }
        var parentBleepsSettings = parentSetup === null || parentSetup === void 0 ? void 0 : parentSetup.bleepsSettings;
        var bleepsSettings = __assign(__assign({}, parentBleepsSettings), props.bleepsSettings);
        createOrUpdateBleeps_1.createOrUpdateBleeps(bleepsGenerics, audioSettings, playersSettings, bleepsSettings);
        return { audioSettings: audioSettings, playersSettings: playersSettings, bleepsSettings: bleepsSettings, bleepsGenerics: bleepsGenerics };
    }, [props.audioSettings, props.playersSettings, parentSetup]);
    return (react_1.default.createElement(BleepsContext_1.BleepsContext.Provider, { value: bleepsSetup }, props.children));
};
exports.BleepsProvider = BleepsProvider;
var bleepsAudioGroupSettingsProps = prop_types_1.default.shape({
    volume: prop_types_1.default.number,
    rate: prop_types_1.default.number,
    preload: prop_types_1.default.bool,
    disabled: prop_types_1.default.bool
});
BleepsProvider.propTypes = {
    // @ts-expect-error
    audioSettings: prop_types_1.default.shape({
        common: bleepsAudioGroupSettingsProps,
        categories: prop_types_1.default.shape({
            background: bleepsAudioGroupSettingsProps,
            transition: bleepsAudioGroupSettingsProps,
            interaction: bleepsAudioGroupSettingsProps,
            notification: bleepsAudioGroupSettingsProps
        })
    }),
    // @ts-expect-error
    playersSettings: prop_types_1.default.object,
    // @ts-expect-error
    bleepsSettings: prop_types_1.default.object
};
