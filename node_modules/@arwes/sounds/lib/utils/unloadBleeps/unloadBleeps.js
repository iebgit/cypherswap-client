"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unloadBleeps = void 0;
var unloadBleep_1 = require("../unloadBleep");
var unloadBleeps = function (bleeps) {
    Object.keys(bleeps).forEach(function (bleepName) { return unloadBleep_1.unloadBleep(bleeps, bleepName); });
};
exports.unloadBleeps = unloadBleeps;
