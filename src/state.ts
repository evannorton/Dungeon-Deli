import { State } from "pixel-pigeon";
import { getRandomModeIndex } from "./functions/getRandomModeIndex";
import { getUniqueRandomModeIndex } from "./functions/getUniqueRandomModeIndex";
import { turnsPerMode } from "./constants/turnsPerMode";

interface StateSchema {
  playerEntityID: string | null;
  modeIndex: number;
  nextModeIndex: number;
  turnsUntilNextMode: number;
}
const modeIndex: number = getRandomModeIndex();
const nextModeIndex: number = getUniqueRandomModeIndex(modeIndex);

export const state: State<StateSchema> = new State({
  modeIndex,
  nextModeIndex,
  playerEntityID: null,
  turnsUntilNextMode: turnsPerMode,
});
