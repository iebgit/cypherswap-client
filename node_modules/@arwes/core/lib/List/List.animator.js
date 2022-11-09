"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animator = void 0;
var animejs_1 = __importDefault(require("animejs"));
var transitionRemoveList = function (animator, containerRef) {
    var container = containerRef.current;
    if (container) {
        var items = container.querySelectorAll(':scope > li');
        animejs_1.default.remove(items);
    }
};
var transitionList = function (animator, containerRef, theme) {
    transitionRemoveList(animator, containerRef);
    var flow = animator.flow, duration = animator.duration;
    var isEntering = flow.entering || flow.entered;
    var durationTransition = isEntering ? duration.enter : duration.exit;
    var container = containerRef.current;
    var items = container.querySelectorAll(':scope > li');
    var space = theme.space;
    if (isEntering) {
        animejs_1.default({
            targets: items,
            delay: animejs_1.default.stagger(duration.stagger),
            opacity: {
                easing: 'easeOutExpo',
                duration: durationTransition / 3,
                value: [0, 1]
            },
            translateX: {
                easing: 'easeOutSine',
                duration: durationTransition,
                value: [-space(2), 0]
            }
        });
    }
    else {
        animejs_1.default({
            targets: items,
            // Only set `opacity: 0` when the animation is completed so the <List/>
            // children text components can be animated properly.
            easing: function () { return function (progress) { return progress === 1 ? 1 : 0; }; },
            duration: durationTransition,
            opacity: [1, 0]
        });
    }
};
var animator = {
    combine: true,
    manager: 'stagger',
    onAnimateEntering: transitionList,
    onAnimateExiting: transitionList,
    onAnimateUnmount: transitionRemoveList
};
exports.animator = animator;
