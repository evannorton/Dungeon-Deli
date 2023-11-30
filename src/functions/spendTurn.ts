import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";

export const spendTurn = (): void => {
  state.setValues({
    turnsUntilNextMode: state.values.turnsUntilNextMode - 1,
  });
  if (state.values.turnsUntilNextMode === 0) {
    const modeID: string = state.values.nextModeID;
    state.setValues({
      modeID,
      nextModeID: getUniqueRandomModeID(modeID),
      turnsUntilNextMode: turnsPerMode,
    });
  }
};
