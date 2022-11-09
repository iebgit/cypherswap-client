"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unloadBleep = void 0;
var unloadBleep = function (bleeps, bleepName) {
    var _a;
    (_a = bleeps[bleepName]) === null || _a === void 0 ? void 0 : _a.unload();
    delete bleeps[bleepName];
};
exports.unloadBleep = unloadBleep;
