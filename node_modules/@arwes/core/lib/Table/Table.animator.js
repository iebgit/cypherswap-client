"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animator = void 0;
var playTableTransitionBleep = function (bleeps) {
    var _a;
    (_a = bleeps.readout) === null || _a === void 0 ? void 0 : _a.play();
};
var stopTableTransitionBleep = function (bleeps) {
    var _a, _b;
    if ((_a = bleeps.readout) === null || _a === void 0 ? void 0 : _a.getIsPlaying()) {
        (_b = bleeps.readout) === null || _b === void 0 ? void 0 : _b.stop();
    }
};
var onAnimateEntering = function (animator, bleeps) {
    playTableTransitionBleep(bleeps);
};
var onAnimateEntered = function (animator, bleeps) {
    stopTableTransitionBleep(bleeps);
};
var onAnimateExiting = function (animator, bleeps) {
    playTableTransitionBleep(bleeps);
};
var onAnimateExited = function (animator, bleeps) {
    stopTableTransitionBleep(bleeps);
};
var onAnimateUnmount = function (animator, bleeps) {
    stopTableTransitionBleep(bleeps);
};
var animator = {
    combine: true,
    manager: 'stagger',
    onAnimateEntering: onAnimateEntering,
    onAnimateEntered: onAnimateEntered,
    onAnimateExiting: onAnimateExiting,
    onAnimateExited: onAnimateExited,
    onAnimateUnmount: onAnimateUnmount
};
exports.animator = animator;
