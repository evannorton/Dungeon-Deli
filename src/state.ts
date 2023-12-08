import { State } from "pixel-pigeon";
import { TurnPart } from "./types/TurnPart";
import { getRandomModeID } from "./functions/getRandomModeID";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";

interface StateSchema {
  attackingMonsterInstancesIDs: string[];
  attackingWeaponsIDs: string[];
  modeID: string;
  movingMonsterInstancesIDs: string[];
  nextModeID: string;
  playerCharacterID: string | null;
  stageID: string | null;
  turn: number;
  turnPart: TurnPart | null;
}
const modeID: string = getRandomModeID();
const nextModeID: string = getUniqueRandomModeID(modeID);

export const state: State<StateSchema> = new State({
  attackingMonsterInstancesIDs: [],
  attackingWeaponsIDs: [],
  modeID,
  movingMonsterInstancesIDs: [],
  nextModeID,
  playerCharacterID: null,
  playerMove: null,
  stageID: null,
  turn: 0,
  turnPart: null,
});
