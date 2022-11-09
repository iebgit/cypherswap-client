"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColorContrastLuminance = void 0;
var readableColor_1 = __importDefault(require("polished/lib/color/readableColor"));
var darken_1 = __importDefault(require("polished/lib/color/darken"));
var lighten_1 = __importDefault(require("polished/lib/color/lighten"));
var updateColorContrastLuminance = function (offset, color) {
    var isColorLight = readableColor_1.default(color) === '#000';
    return isColorLight ? darken_1.default(offset, color) : lighten_1.default(offset, color);
};
exports.updateColorContrastLuminance = updateColorContrastLuminance;
