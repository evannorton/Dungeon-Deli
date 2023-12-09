import { Mode } from "../modes";
import { getDefinable } from "../definables";
import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { state } from "../state";

export const goToNextMode = (): void => {
  const modeID: string | null = state.values.nextModeID;
  if (modeID === null) {
    throw new Error("Attempted to go to next mode with no next mode ID.");
  }
  if (state.values.untilNextMode === null) {
    throw new Error("Attempted to go to next mode with no until next mode.");
  }
  const mode: Mode = getDefinable(Mode, modeID);
  let untilNextMode: number = state.values.untilNextMode - 1;
  if (untilNextMode === 0) {
    untilNextMode = mode.turns;
    state.setValues({
      modeID,
      nextModeID: getUniqueRandomModeID(modeID),
    });
  }
  state.setValues({ untilNextMode });
};
