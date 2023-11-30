import { State } from "pixel-pigeon";
import { getRandomModeID } from "./functions/getRandomModeID";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";
import { turnsPerMode } from "./constants/turnsPerMode";

interface StateSchema {
  playerEntityID: string | null;
  modeID: string;
  nextModeID: string;
  turnsUntilNextMode: number;
}
const modeID: string = getRandomModeID();
const nextModeID: string = getUniqueRandomModeID(modeID);

export const state: State<StateSchema> = new State({
  modeID,
  nextModeID,
  playerEntityID: null,
  turnsUntilNextMode: turnsPerMode,
});
