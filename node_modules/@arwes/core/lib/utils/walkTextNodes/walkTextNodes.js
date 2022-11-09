"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkTextNodes = void 0;
var walkTextNodes = function (node, callback) {
    Array.from(node.childNodes).forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
            callback(child);
        }
        else if (child.nodeType === Node.ELEMENT_NODE) {
            walkTextNodes(child, callback);
        }
    });
};
exports.walkTextNodes = walkTextNodes;
