import { BleepsAudioSettings, BleepsPlayersSettings, BleepsSettings, BleepsGenerics } from '../../constants';
declare const createOrUpdateBleeps: (providedBleeps: BleepsGenerics | undefined, audioSettings: BleepsAudioSettings, playersSettings: BleepsPlayersSettings, bleepsSettings: BleepsSettings) => BleepsGenerics;
export { createOrUpdateBleeps };
