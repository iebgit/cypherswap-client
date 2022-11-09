"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStyles = void 0;
var generateStyles = function (options) {
    var animate = options.animate;
    return {
        root: {
            '& > li': {
                opacity: animate ? 0 : undefined
            }
        }
    };
};
exports.generateStyles = generateStyles;
