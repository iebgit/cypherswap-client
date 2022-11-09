"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStyles = void 0;
var rgba_1 = __importDefault(require("polished/lib/color/rgba"));
var generateStyles = function (theme, options) {
    var _a;
    var space = theme.space, outline = theme.outline, shadowBlur = theme.shadowBlur;
    var defaultPalette = theme.palette.primary;
    var colorPalette = (_a = theme.palette[options.palette]) !== null && _a !== void 0 ? _a : defaultPalette;
    var color = colorPalette.main;
    var colorBg = rgba_1.default(colorPalette.light1, 0.05);
    return {
        root: {
            position: 'relative',
            display: 'block',
            margin: 0,
            marginBottom: space(4),
            border: 'none',
            padding: 0,
            backgroundColor: 'transparent'
        },
        bg: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: colorBg
        },
        line: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: outline(6),
            height: '100%',
            backgroundColor: color,
            boxShadow: "0 0 " + shadowBlur(2) + "px " + color,
            transformOrigin: 'top'
        },
        content: {
            paddingLeft: space(4) + outline(6),
            paddingRight: space(4),
            paddingTop: space(2),
            paddingBottom: space(2)
        }
    };
};
exports.generateStyles = generateStyles;
