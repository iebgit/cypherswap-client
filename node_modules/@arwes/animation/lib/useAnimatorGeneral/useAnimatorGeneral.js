"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimatorGeneral = void 0;
var react_1 = require("react");
var AnimatorGeneralContext_1 = require("../AnimatorGeneralContext");
function useAnimatorGeneral() {
    return react_1.useContext(AnimatorGeneralContext_1.AnimatorGeneralContext);
}
exports.useAnimatorGeneral = useAnimatorGeneral;
