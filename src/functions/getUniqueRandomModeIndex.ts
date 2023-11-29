import { getRandomModeIndex } from "./getRandomModeIndex";

export const getUniqueRandomModeIndex = (previousModeIndex: number): number => {
  while (true) {
    const randomModeIndex: number = getRandomModeIndex();
    if (randomModeIndex !== previousModeIndex) {
      return randomModeIndex;
    }
  }
};