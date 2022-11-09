import { FC } from 'react';
import { BleepsAudioSettings, BleepsPlayersSettings, BleepsSettings } from '../constants';
interface BleepsProviderProps {
    audioSettings?: BleepsAudioSettings;
    playersSettings?: BleepsPlayersSettings;
    bleepsSettings?: BleepsSettings;
}
declare const BleepsProvider: FC<BleepsProviderProps>;
export { BleepsProviderProps, BleepsProvider };
