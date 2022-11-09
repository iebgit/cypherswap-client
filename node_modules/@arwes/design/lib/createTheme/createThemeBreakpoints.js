"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThemeBreakpoints = void 0;
var constants_1 = require("../constants");
var createThemeBreakpoints = function (setup) {
    var getBreakpointValue = function (key) {
        if (Number.isFinite(setup.breakpoints.values[key])) {
            return setup.breakpoints.values[key];
        }
        return Number(key);
    };
    var up = function (key) { return ("@media screen and (min-width: " + getBreakpointValue(key) + "px)"); };
    var down = function (key) { return ("@media screen and (max-width: " + (getBreakpointValue(key) - 1) + "px)"); };
    var only = function (key) {
        var lastBreakpointKey = constants_1.THEME_BREAKPOINTS_KEYS[constants_1.THEME_BREAKPOINTS_KEYS.length - 1];
        if (key !== lastBreakpointKey) {
            var currentBreakpoint = setup.breakpoints.values[key];
            if (process.env.NODE_ENV !== 'production' && !Number.isFinite(currentBreakpoint)) {
                throw new Error("Provided value \"" + key + "\" to theme.breakpoints.only() is not valid.");
            }
            var nextBreakpointIndex = constants_1.THEME_BREAKPOINTS_KEYS.findIndex(function (val) { return val === key; }) + 1;
            var nextBreakpointKey = constants_1.THEME_BREAKPOINTS_KEYS[nextBreakpointIndex];
            var nextBreakpoint = setup.breakpoints.values[nextBreakpointKey];
            return "@media screen and (min-width: " + currentBreakpoint + "px) and (max-width: " + (nextBreakpoint - 1) + "px)";
        }
        return up(key);
    };
    var between = function (start, end) {
        var min = getBreakpointValue(start);
        var max = getBreakpointValue(end);
        if (process.env.NODE_ENV !== 'production' && max < min) {
            throw new Error('The provided breakpoints to theme.breakpoints.between() are not valid.');
        }
        return "@media screen and (min-width: " + min + "px) and (max-width: " + (max - 1) + "px)";
    };
    return Object.freeze({
        keys: constants_1.THEME_BREAKPOINTS_KEYS,
        values: setup.breakpoints.values,
        up: up,
        down: down,
        only: only,
        between: between
    });
};
exports.createThemeBreakpoints = createThemeBreakpoints;
