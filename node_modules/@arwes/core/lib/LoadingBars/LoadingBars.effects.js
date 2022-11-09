"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLoadingBarsUndeterminateAnimation = exports.stopLoadingBarsUndeterminateAnimation = exports.startLoadingBarsTransition = exports.stopLoadingBarsTransition = void 0;
var animejs_1 = __importDefault(require("animejs"));
var stopLoadingBarsTransition = function (animator, refs) {
    var root = refs.current.rootRef.current;
    if (root) {
        var container = root.querySelector('.arwes-loading-bars__container');
        animejs_1.default.remove(container);
        Object.assign(container.style, {
            transform: '',
            opacity: ''
        });
    }
};
exports.stopLoadingBarsTransition = stopLoadingBarsTransition;
var startLoadingBarsTransition = function (animator, refs, theme) {
    stopLoadingBarsTransition(animator, refs);
    var duration = animator.duration, flow = animator.flow;
    var isEntering = flow.entering || flow.entered;
    var space = theme.space;
    var root = refs.current.rootRef.current;
    var container = root.querySelector('.arwes-loading-bars__container');
    animejs_1.default({
        targets: container,
        duration: isEntering ? duration.enter : duration.exit,
        easing: 'easeOutSine',
        translateX: isEntering ? [-space(4), 0] : [0, space(4)],
        opacity: isEntering ? [0, 1] : [1, 0]
    });
};
exports.startLoadingBarsTransition = startLoadingBarsTransition;
var stopLoadingBarsUndeterminateAnimation = function (animator, refs, styles) {
    window.cancelAnimationFrame(refs.current.animationFrameId);
    var root = refs.current.rootRef.current;
    if (root) {
        var items = Array.from(root.querySelectorAll('.arwes-loading-bars__item'));
        items.forEach(function (item) {
            Object.assign(item.style, styles.itemInactive);
        });
    }
};
exports.stopLoadingBarsUndeterminateAnimation = stopLoadingBarsUndeterminateAnimation;
var startLoadingBarsUndeterminateAnimation = function (animator, refs, styles, options) {
    stopLoadingBarsUndeterminateAnimation(animator, refs, styles);
    var root = refs.current.rootRef.current;
    var items = Array.from(root.querySelectorAll('.arwes-loading-bars__item'));
    var speed = options.speed;
    // A normal FPS duration times a speed time factor.
    var itemDuration = (1000 / 60) * speed;
    var roundDuration = items.length * itemDuration;
    var timeStart = 0;
    var addNextFrame = function (render) {
        refs.current.animationFrameId = window.requestAnimationFrame(render);
    };
    var renderFrame = function (timestamp) {
        if (!timeStart) {
            timeStart = timestamp;
        }
        var durationProgress = Math.max(timestamp - timeStart, 0);
        var currentRoundDuration = durationProgress % roundDuration;
        var currentPosition = Math.max(Math.floor(currentRoundDuration / itemDuration), 0);
        items.forEach(function (item) {
            Object.assign(item.style, styles.itemInactive);
        });
        if (currentPosition > 0) {
            Object.assign(items[currentPosition - 1].style, styles.itemSecondaryActive);
        }
        Object.assign(items[currentPosition].style, styles.itemPrimaryActive);
        if (currentPosition < items.length - 1) {
            Object.assign(items[currentPosition + 1].style, styles.itemSecondaryActive);
        }
        addNextFrame(renderFrame);
    };
    addNextFrame(renderFrame);
};
exports.startLoadingBarsUndeterminateAnimation = startLoadingBarsUndeterminateAnimation;
