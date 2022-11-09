import { Howl } from 'howler';
export declare const BLEEPS_BACKGROUND = "background";
export declare const BLEEPS_TRANSITION = "transition";
export declare const BLEEPS_INTERACTION = "interaction";
export declare const BLEEPS_NOTIFICATION = "notification";
export declare const BLEEPS_CATEGORIES: string[];
export interface BleepsAudioGroupSettings {
    volume?: number;
    rate?: number;
    preload?: boolean;
    disabled?: boolean;
}
export declare type BleepCategoryName = typeof BLEEPS_BACKGROUND | typeof BLEEPS_TRANSITION | typeof BLEEPS_INTERACTION | typeof BLEEPS_NOTIFICATION;
export declare type BleepsAudioCategoriesSettings = Partial<Record<BleepCategoryName, BleepsAudioGroupSettings>>;
export interface BleepsAudioSettings {
    common?: BleepsAudioGroupSettings;
    categories?: BleepsAudioCategoriesSettings;
}
export declare type BleepPlayerName = string;
export interface BleepPlayerSettings {
    src: string[];
    format?: string[];
    loop?: boolean;
    rate?: number;
    disabled?: boolean;
}
export declare type BleepsPlayersSettings = Record<BleepPlayerName, BleepPlayerSettings>;
export declare type BleepName = string;
export interface BleepSettings {
    player: BleepPlayerName;
    category?: BleepCategoryName;
}
export declare type BleepsSettings = Record<BleepName, BleepSettings | undefined>;
export declare type BleepGenericInstanceId = number | string;
export interface BleepGeneric {
    play: (instanceId: BleepGenericInstanceId) => void;
    stop: (instanceId: BleepGenericInstanceId) => void;
    getIsPlaying: () => boolean;
    getDuration: () => number;
    unload: () => void;
    _settings: BleepsAudioGroupSettings & BleepPlayerSettings;
    _howl: Howl;
}
export declare type BleepsGenerics = Record<BleepName, BleepGeneric>;
export interface Bleep extends BleepGeneric {
    play: () => void;
    stop: () => void;
}
export declare type Bleeps = Record<BleepName, Bleep>;
export interface BleepsSetup {
    audioSettings: BleepsAudioSettings;
    playersSettings: BleepsPlayersSettings;
    bleepsSettings: BleepsSettings;
    bleepsGenerics: BleepsGenerics;
}
