"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStyles = void 0;
var generateStyles = function (options) {
    var animate = options.animate;
    return {
        root: {
            position: 'relative',
            display: 'inline-block'
        },
        actualChildren: {
            display: 'inline-block',
            zIndex: 1,
            opacity: animate ? 0 : undefined
        },
        blink: {
            position: 'relative',
            display: 'inline-block',
            width: 0,
            height: 0,
            lineHeight: '0',
            color: 'inherit'
        },
        blinkKeyframes: {
            '0%, 100%': {
                color: 'transparent'
            },
            '50%': {
                color: 'inherit'
            }
        }
    };
};
exports.generateStyles = generateStyles;
