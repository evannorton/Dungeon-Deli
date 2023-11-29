import { getRandomModeIndex } from "./getRandomModeIndex";

export const getUniqueRandomModeIndex = (previousModeIndex: number): number => {
  let randomModeIndex: number = getRandomModeIndex();
  while (randomModeIndex === previousModeIndex) {
    randomModeIndex = getRandomModeIndex();
  }
  return randomModeIndex;
};
