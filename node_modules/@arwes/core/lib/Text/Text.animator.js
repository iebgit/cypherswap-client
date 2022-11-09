"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animator = void 0;
var textAnimations_1 = require("../utils/textAnimations");
var onAnimateEntering = function (animator, refs, bleeps) {
    var _a;
    (_a = bleeps.type) === null || _a === void 0 ? void 0 : _a.play();
    textAnimations_1.startTextAnimation(animator, refs);
};
var onAnimateEntered = function (animator, refs, bleeps) {
    var _a;
    (_a = bleeps.type) === null || _a === void 0 ? void 0 : _a.stop();
};
var onAnimateExiting = function (animator, refs, bleeps) {
    var _a;
    (_a = bleeps.type) === null || _a === void 0 ? void 0 : _a.play();
    textAnimations_1.startTextAnimation(animator, refs);
};
var onAnimateExited = function (animator, refs, bleeps) {
    var _a;
    (_a = bleeps.type) === null || _a === void 0 ? void 0 : _a.stop();
};
var onAnimateUnmount = function (animator, refs, bleeps) {
    var _a;
    textAnimations_1.stopTextAnimation(animator, refs);
    (_a = bleeps.type) === null || _a === void 0 ? void 0 : _a.stop();
};
var animator = {
    onAnimateEntering: onAnimateEntering,
    onAnimateEntered: onAnimateEntered,
    onAnimateExiting: onAnimateExiting,
    onAnimateExited: onAnimateExited,
    onAnimateUnmount: onAnimateUnmount
};
exports.animator = animator;
