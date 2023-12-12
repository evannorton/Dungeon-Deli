import { State } from "pixel-pigeon";
import { TurnPart } from "./types/TurnPart";

interface StateSchema {
  readonly attackingMonsterInstancesIDs: string[];
  readonly attackingWeaponsIDs: string[];
  readonly knockbackCharacterIDs: string[];
  readonly instructionsOpen: boolean;
  readonly isMain: boolean;
  readonly isTitle: boolean;
  readonly isVictory: boolean;
  readonly modeID: string | null;
  readonly movingMonsterInstancesIDs: string[];
  readonly musicAudioSourceID: string | null;
  readonly nextModeID: string | null;
  readonly playerCharacterID: string | null;
  readonly stageID: string | null;
  readonly turn: number;
  readonly turnPart: TurnPart | null;
  readonly untilNextMode: number | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  attackingMonsterInstancesIDs: [],
  attackingWeaponsIDs: [],
  instructionsOpen: false,
  isMain: false,
  isTitle: true,
  isVictory: false,
  knockbackCharacterIDs: [],
  modeID: null,
  movingMonsterInstancesIDs: [],
  musicAudioSourceID: null,
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
