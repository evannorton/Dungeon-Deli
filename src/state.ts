import { State } from "pixel-pigeon";
import { getRandomModeID } from "./functions/getRandomModeID";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";

interface StateSchema {
  playerEntityID: string | null;
  modeID: string;
  nextModeID: string;
  stageID: string | null;
  turn: number;
}
const modeID: string = getRandomModeID();
const nextModeID: string = getUniqueRandomModeID(modeID);

export const state: State<StateSchema> = new State({
  modeID,
  nextModeID,
  playerEntityID: null,
  stageID: null,
  turn: 0,
});
