"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTextNodesExitingContentLength = void 0;
var setTextNodesExitingContentLength = function (textNodes, texts, newLength, totalLength) {
    var markerLength = totalLength;
    for (var index = textNodes.length - 1; index >= 0; index--) {
        var textNode = textNodes[index];
        var text = texts[index];
        var newMarkerLength = markerLength - text.length;
        if (newMarkerLength >= newLength) {
            if (textNode.textContent !== '') {
                textNode.textContent = '';
            }
            if (newMarkerLength === newLength) {
                break;
            }
            markerLength = newMarkerLength;
        }
        else {
            var currentTextNodeLengthPortionRight = markerLength - newLength;
            var currentTextNodeLengthPortionLeft = text.length - currentTextNodeLengthPortionRight;
            var currentTextNodeText = text.substring(0, currentTextNodeLengthPortionLeft);
            textNode.textContent = currentTextNodeText;
            break;
        }
    }
};
exports.setTextNodesExitingContentLength = setTextNodesExitingContentLength;
