"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStyles = void 0;
var rootFullStyles = {
    display: 'flex',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};
var generateStyles = function (theme, options) {
    var palette = theme.palette, space = theme.space, outline = theme.outline, shadowBlur = theme.shadowBlur;
    var animate = options.animate, length = options.length, size = options.size, full = options.full;
    return {
        root: Object.assign({
            display: 'inline-block',
            padding: "0 " + space(2 * size) + "px"
        }, full ? rootFullStyles : undefined),
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 'auto',
            width: space(length * 2 * size),
            opacity: animate ? 0 : undefined
        },
        item: {
            width: space(1 * size),
            height: space(5 * size),
            borderStyle: 'solid',
            borderColor: palette.primary.main,
            borderWidth: outline(1),
            boxShadow: "0 0 " + shadowBlur(1 * size) + "px " + palette.primary.main,
            transform: 'skewX(330deg)',
            transformOrigin: 'center'
        },
        itemPrimaryActive: {
            backgroundColor: palette.primary.main,
            boxShadow: "0 0 " + shadowBlur(2 * size) + "px " + palette.primary.main
        },
        itemSecondaryActive: {
            backgroundColor: palette.primary.dark2,
            boxShadow: "0 0 " + shadowBlur(2 * size) + "px " + palette.primary.dark2
        },
        itemInactive: {
            backgroundColor: '',
            boxShadow: ''
        }
    };
};
exports.generateStyles = generateStyles;
