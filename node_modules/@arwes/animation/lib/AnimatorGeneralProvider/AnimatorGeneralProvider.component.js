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
exports.AnimatorGeneralProvider = void 0;
var react_1 = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var AnimatorGeneralContext_1 = require("../AnimatorGeneralContext");
var AnimatorGeneralProvider = function (props) {
    var localSettings = props.animator, children = props.children;
    var parentSettings = react_1.useContext(AnimatorGeneralContext_1.AnimatorGeneralContext);
    var toProvideSettings = react_1.useMemo(function () {
        if (!localSettings) {
            return parentSettings;
        }
        var settings = __assign(__assign({}, parentSettings), localSettings);
        if (localSettings.duration) {
            settings.duration = __assign(__assign({}, parentSettings === null || parentSettings === void 0 ? void 0 : parentSettings.duration), localSettings === null || localSettings === void 0 ? void 0 : localSettings.duration);
        }
        return settings;
    }, [localSettings, parentSettings]);
    return (react_1.default.createElement(AnimatorGeneralContext_1.AnimatorGeneralContext.Provider, { value: toProvideSettings }, children));
};
exports.AnimatorGeneralProvider = AnimatorGeneralProvider;
AnimatorGeneralProvider.propTypes = {
    // @ts-expect-error
    animator: prop_types_1.default.shape({
        duration: prop_types_1.default.shape({
            enter: prop_types_1.default.number,
            exit: prop_types_1.default.number,
            stagger: prop_types_1.default.number,
            delay: prop_types_1.default.number,
            offset: prop_types_1.default.number
        })
    }),
    children: prop_types_1.default.any
};
