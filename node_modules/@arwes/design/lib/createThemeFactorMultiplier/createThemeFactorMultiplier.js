"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThemeFactorMultiplier = void 0;
var createThemeFactorMultiplier = function (factor) {
    if (process.env.NODE_ENV !== 'production' && !Number.isFinite(factor)) {
        throw new Error("Factor value was expected to be a number, but received \"" + String(factor) + "\".");
    }
    return function (multiplier) {
        if (multiplier === void 0) { multiplier = 1; }
        if (process.env.NODE_ENV !== 'production' && !Number.isFinite(multiplier)) {
            throw new Error("Multiplier value was expected to be a number, but received \"" + multiplier + "\".");
        }
        return Math.round(factor * multiplier);
    };
};
exports.createThemeFactorMultiplier = createThemeFactorMultiplier;
