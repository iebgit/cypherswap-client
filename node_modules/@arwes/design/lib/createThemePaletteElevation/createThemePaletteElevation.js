"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThemePaletteElevation = void 0;
var updateColorContrastLuminance_1 = require("../updateColorContrastLuminance");
var createThemePaletteElevation = function (main, elevationOffset) {
    var elevate = function (level) {
        var value = elevationOffset * level;
        if (value === 0) {
            return main;
        }
        return updateColorContrastLuminance_1.updateColorContrastLuminance(value, main);
    };
    return Object.freeze({ main: main, elevate: elevate });
};
exports.createThemePaletteElevation = createThemePaletteElevation;
