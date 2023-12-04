import { Direction } from "./types/Direction";
import { PlayerMove } from "./types/PlayerMove";
import { State } from "pixel-pigeon";
import { Step } from "./types/Step";
import { getRandomModeID } from "./functions/getRandomModeID";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";

interface StateSchema {
  direction: Direction;
  modeID: string;
  nextModeID: string;
  playerEntityID: string | null;
  playerMove: PlayerMove | null;
  stageID: string | null;
  step: Step;
  turn: number;
}
const modeID: string = getRandomModeID();
const nextModeID: string = getUniqueRandomModeID(modeID);

export const state: State<StateSchema> = new State({
  direction: Direction.Down,
  modeID,
  nextModeID,
  playerEntityID: null,
  playerMove: null,
  stageID: null,
  step: Step.Left,
  turn: 0,
});
