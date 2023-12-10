import { State } from "pixel-pigeon";
import { TurnPart } from "./types/TurnPart";

interface StateSchema {
  attackingMonsterInstancesIDs: string[];
  attackingWeaponsIDs: string[];
  isMain: boolean;
  isVictory: boolean;
  modeID: string | null;
  movingMonsterInstancesIDs: string[];
  nextModeID: string | null;
  playerCharacterID: string | null;
  stageID: string | null;
  turn: number;
  turnPart: TurnPart | null;
  untilNextMode: number | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  attackingMonsterInstancesIDs: [],
  attackingWeaponsIDs: [],
  isMain: true,
  isVictory: false,
  modeID: null,
  movingMonsterInstancesIDs: [],
  nextModeID: null,
  playerCharacterID: null,
  stageID: null,
  turn: 0,
  turnPart: null,
  untilNextMode: null,
});
(
  window as unknown as {
    state: unknown;
  }
).state = state;
