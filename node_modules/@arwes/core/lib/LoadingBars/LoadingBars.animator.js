"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animator = void 0;
var LoadingBars_effects_1 = require("./LoadingBars.effects");
var animator = {
    onAnimateEntering: LoadingBars_effects_1.startLoadingBarsTransition,
    onAnimateExiting: LoadingBars_effects_1.startLoadingBarsTransition,
    onAnimateUnmount: LoadingBars_effects_1.stopLoadingBarsTransition
};
exports.animator = animator;
