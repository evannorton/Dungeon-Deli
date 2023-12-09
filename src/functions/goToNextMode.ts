import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";

export const goToNextMode = (): void => {
  const modeID: string | null = state.values.nextModeID;
  if (modeID === null) {
    throw new Error("Attempted to go to next mode with no next mode ID.");
  }
  let untilNextMode: number = state.values.untilNextMode - 1;
  if (untilNextMode === 0) {
    untilNextMode = turnsPerMode;
    state.setValues({
      modeID,
      nextModeID: getUniqueRandomModeID(modeID),
    });
  }
  state.setValues({ untilNextMode });
};
