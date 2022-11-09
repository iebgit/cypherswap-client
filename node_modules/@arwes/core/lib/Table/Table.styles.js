"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStyles = void 0;
var generateStyles = function (theme) {
    var space = theme.space;
    return {
        root: {
            display: 'block',
            overflow: 'auto',
            margin: "0 0 " + space(4) + "px",
            width: '100%'
        },
        rootIsTransitioning: {
            overflow: 'hidden'
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        }
    };
};
exports.generateStyles = generateStyles;
