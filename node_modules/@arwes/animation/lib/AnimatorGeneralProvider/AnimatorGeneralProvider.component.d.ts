import { FC } from 'react';
import { AnimatorGeneralProviderSettings } from '../constants';
interface AnimatorGeneralProviderProps {
    animator?: AnimatorGeneralProviderSettings;
    children?: any;
}
declare const AnimatorGeneralProvider: FC<AnimatorGeneralProviderProps>;
export { AnimatorGeneralProviderProps, AnimatorGeneralProvider };
