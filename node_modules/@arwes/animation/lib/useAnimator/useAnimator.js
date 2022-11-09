"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimator = void 0;
var react_1 = require("react");
var AnimatorContext_1 = require("../AnimatorContext");
function useAnimator() {
    return react_1.useContext(AnimatorContext_1.AnimatorContext);
}
exports.useAnimator = useAnimator;
