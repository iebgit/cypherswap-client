"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTextNodesEnteringContentLength = void 0;
var setTextNodesEnteringContentLength = function (textNodes, texts, newLength) {
    var markerLength = 0;
    for (var index = 0; index < textNodes.length; index++) {
        var textNode = textNodes[index];
        var text = texts[index];
        var newMarkerLength = markerLength + text.length;
        if (newMarkerLength <= newLength) {
            if (textNode.textContent !== text) {
                textNode.textContent = text;
            }
            if (newMarkerLength === newLength) {
                break;
            }
            markerLength = newMarkerLength;
        }
        else {
            var currentTextNodeLengthPortion = newLength - markerLength;
            var currentTextNodeText = text.substring(0, currentTextNodeLengthPortion);
            textNode.textContent = currentTextNodeText;
            break;
        }
    }
};
exports.setTextNodesEnteringContentLength = setTextNodesEnteringContentLength;
