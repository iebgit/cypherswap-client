declare type FactorMultiplier = (multiplier?: number) => number;
declare const createThemeFactorMultiplier: (factor: number) => FactorMultiplier;
export { FactorMultiplier, createThemeFactorMultiplier };
