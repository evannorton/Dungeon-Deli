import { getRandomModeID } from "./getRandomModeID";

export const getUniqueRandomModeID = (previousModeIndex: string): string => {
  let randomModeID: string = getRandomModeID();
  while (randomModeID === previousModeIndex) {
    randomModeID = getRandomModeID();
  }
  return randomModeID;
};
