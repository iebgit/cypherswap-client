"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCSSBoxProp = void 0;
function expandCSSBoxProp(value, defaultValue) {
    var _a, _b, _c, _d;
    var expansion = [];
    if (Array.isArray(value)) {
        switch (value.length) {
            case 0: {
                break;
            }
            case 1: {
                var data = value[0];
                expansion = [data, data, data, data];
                break;
            }
            case 2: {
                var y = value[0], x = value[1];
                expansion = [y, x, y, x];
                break;
            }
            case 3: {
                var top_1 = value[0], x = value[1], bottom = value[2];
                expansion = [top_1, x, bottom, x];
                break;
            }
            default: {
                expansion = value;
                break;
            }
        }
    }
    else {
        expansion = [value, value, value, value];
    }
    return [
        (_a = expansion[0]) !== null && _a !== void 0 ? _a : defaultValue,
        (_b = expansion[1]) !== null && _b !== void 0 ? _b : defaultValue,
        (_c = expansion[2]) !== null && _c !== void 0 ? _c : defaultValue,
        (_d = expansion[3]) !== null && _d !== void 0 ? _d : defaultValue
    ];
}
exports.expandCSSBoxProp = expandCSSBoxProp;
;
