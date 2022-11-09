"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBleep = void 0;
var howler_1 = require("howler");
var createBleep = function (audioSettings, playerSettings) {
    var _a = __assign(__assign({}, audioSettings), playerSettings), disabled = _a.disabled, settings = __rest(_a, ["disabled"]);
    // TODO: The Howler API does not provide a public interface to know if
    // the browser audio is locked or not. But it has a private flag.
    // This could potentially break this library if it changes unexpectedly,
    // but there is no proper way to know.
    var isGlobalAudioLocked = !howler_1.Howler._audioUnlocked;
    var isLocked = isGlobalAudioLocked;
    var lastId;
    var howl = new howler_1.Howl(__assign(__assign({}, settings), { onunlock: function () {
            isLocked = false;
        } }));
    // In a loop sound, if the sound is played by multiple sources
    // (e.g. multiple components multiple times), to stop the sound,
    // all of the play() calls must also call stop().
    // Otherwise, a race-condition issue can happen.
    var sourcesAccount = {};
    var play = function (instanceId) {
        // Even if the audio is set up to be preloaded, sometimes the file
        // is not loaded, probably because the browser has locked the playback.
        if (howl.state() === 'unloaded') {
            howl.load();
        }
        // If the browser audio is locked, if the audio is played, it will be queued
        // until the browser audio is unlocked. But if in-between the audio is stopped,
        // the play is still queued. It is also accumulated, regardless of passing down
        // the same playback id.
        if (isLocked) {
            return;
        }
        sourcesAccount[instanceId] = true;
        // If the sound is being loaded, the play action will be
        // queued until it is loaded.
        var newId = howl.play(lastId);
        // If the sound is being loaded, it returns null.
        // To prevent errors, the id to pass to play must be a number or undefined.
        lastId = newId || undefined;
    };
    var stop = function (instanceId) {
        delete sourcesAccount[instanceId];
        var noActiveSources = !Object.keys(sourcesAccount).length;
        var canStop = settings.loop ? noActiveSources : true;
        if (canStop && howl.playing()) {
            howl.stop();
        }
    };
    var getIsPlaying = function () {
        return howl.playing();
    };
    var getDuration = function () {
        return howl.duration();
    };
    var unload = function () {
        howl.unload();
    };
    return {
        _settings: settings,
        _howl: howl,
        play: play,
        stop: stop,
        getIsPlaying: getIsPlaying,
        getDuration: getDuration,
        unload: unload
    };
};
exports.createBleep = createBleep;
