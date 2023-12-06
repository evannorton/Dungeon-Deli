import { State } from "pixel-pigeon";
import { getRandomModeID } from "./functions/getRandomModeID";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";

interface StateSchema {
  modeID: string;
  nextModeID: string;
  playerCharacterID: string | null;
  stageID: string | null;
  turn: number;
}
const modeID: string = getRandomModeID();
const nextModeID: string = getUniqueRandomModeID(modeID);

export const state: State<StateSchema> = new State({
  modeID,
  nextModeID,
  playerCharacterID: null,
  playerMove: null,
  stageID: null,
  turn: 0,
});
