"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTextAnimation = exports.stopTextAnimation = void 0;
var css_1 = require("@emotion/css");
var walkTextNodes_1 = require("../walkTextNodes");
var setTextNodesEnteringContentLength_1 = require("../setTextNodesEnteringContentLength");
var setTextNodesExitingContentLength_1 = require("../setTextNodesExitingContentLength");
// TODO: Since these styles could be used simultaneously by many components,
// should these styles be memoized to improve performance?
var styles = {
    cloneNode: {
        display: 'inline-block',
        position: 'absolute',
        zIndex: 0,
        left: '0',
        right: '0',
        top: '0',
        overflow: 'hidden',
        userSelect: 'none'
    }
};
var stopTextAnimation = function (animator, refs) {
    var _a = refs.current, rootRef = _a.rootRef, actualChildrenRef = _a.actualChildrenRef, cloneNode = _a.cloneNode, animationFrame = _a.animationFrame;
    // If there is no animation running, nothing needs to be stopped.
    if (animationFrame.current === null) {
        return;
    }
    window.cancelAnimationFrame(animationFrame.current);
    if (rootRef.current && cloneNode.current) {
        rootRef.current.removeChild(cloneNode.current);
        cloneNode.current = null;
    }
    var isEntering = animator.flow.entering || animator.flow.entered;
    if (isEntering && actualChildrenRef.current) {
        actualChildrenRef.current.style.opacity = '1';
    }
    animationFrame.current = null;
};
exports.stopTextAnimation = stopTextAnimation;
var startTextAnimation = function (animator, refs, callback) {
    var _a, _b;
    var _c = refs.current, rootRef = _c.rootRef, actualChildrenRef = _c.actualChildrenRef, cloneNode = _c.cloneNode, blinkNode = _c.blinkNode, animationFrame = _c.animationFrame;
    stopTextAnimation(animator, refs);
    // If the animation is run when the element is already ENTERED, it should
    // restart the same entering animation.
    var isEntering = animator.flow.entering || animator.flow.entered;
    var durationTotal = isEntering
        ? animator.duration.enter
        : animator.duration.exit;
    cloneNode.current = (_a = actualChildrenRef.current) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
    var textNodes = [];
    var texts = [];
    walkTextNodes_1.walkTextNodes(cloneNode.current, function (child) {
        textNodes.push(child);
        texts.push(child.textContent || '');
        if (isEntering) {
            child.textContent = '';
        }
    });
    var lengthTotal = texts.join('').length;
    if (!lengthTotal) {
        cloneNode.current = null;
        return;
    }
    if (actualChildrenRef.current) {
        actualChildrenRef.current.style.opacity = '0';
    }
    cloneNode.current.setAttribute('style', '');
    cloneNode.current.setAttribute('class', css_1.css(styles.cloneNode));
    (_b = rootRef.current) === null || _b === void 0 ? void 0 : _b.appendChild(cloneNode.current);
    if (blinkNode.current) {
        cloneNode.current.appendChild(blinkNode.current);
    }
    var timeStart = 0;
    var durationProgress = 0;
    var addNextFrame = function (callback) {
        animationFrame.current = window.requestAnimationFrame(callback);
    };
    var runFrame = function (timestamp) {
        if (!timeStart) {
            timeStart = timestamp;
        }
        durationProgress = Math.max(timestamp - timeStart, 0);
        if (!isEntering) {
            durationProgress = durationTotal - durationProgress;
        }
        // partialLength(n) = animationProgressDuration(ms)
        // textTotalLength(n) = totalDuration(ms)
        var lengthNew = Math.round((durationProgress * lengthTotal) / durationTotal);
        if (isEntering) {
            setTextNodesEnteringContentLength_1.setTextNodesEnteringContentLength(textNodes, texts, lengthNew);
        }
        else {
            setTextNodesExitingContentLength_1.setTextNodesExitingContentLength(textNodes, texts, lengthNew, lengthTotal);
        }
        var continueAnimation = isEntering
            ? lengthNew < lengthTotal
            : lengthNew > 0;
        if (continueAnimation) {
            addNextFrame(runFrame);
        }
        else {
            stopTextAnimation(animator, refs);
            callback === null || callback === void 0 ? void 0 : callback();
        }
    };
    addNextFrame(runFrame);
};
exports.startTextAnimation = startTextAnimation;
