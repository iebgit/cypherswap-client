"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBleepsSetup = void 0;
var react_1 = require("react");
var BleepsContext_1 = require("../BleepsContext");
function useBleepsSetup() {
    return react_1.useContext(BleepsContext_1.BleepsContext);
}
exports.useBleepsSetup = useBleepsSetup;
