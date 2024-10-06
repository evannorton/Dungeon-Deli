import { Stage } from "../stages";
import { getDefinable } from "definables";
import { getRandomModeID } from "./getRandomModeID";
import { state } from "../state";

export const getUniqueRandomModeID = (
  previousModeIndex: string,
): string | null => {
  if (state.values.stageID === null) {
    throw new Error("Attempted to get unique random mode id with no stage.");
  }
  let randomModeID: string = getRandomModeID();
  const stage: Stage = getDefinable(Stage, state.values.stageID);
  if (stage.modes.length === 1) {
    return null;
  }
  while (randomModeID === previousModeIndex) {
    randomModeID = getRandomModeID();
  }
  return randomModeID;
};
