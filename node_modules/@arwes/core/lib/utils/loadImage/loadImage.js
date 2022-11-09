"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImage = void 0;
var loadImage = function (url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onerror = img.onabort = function () { return reject(); };
        img.onload = function () { return resolve(); };
        img.src = url;
    });
};
exports.loadImage = loadImage;
