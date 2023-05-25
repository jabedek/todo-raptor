export const AZERET_MONO_WIDTH = 7.8;

export function getTagWidth(lettersAmount = 0): number {
  return 36 + lettersAmount * AZERET_MONO_WIDTH;
}
