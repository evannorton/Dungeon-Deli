import { State } from "pixel-pigeon";
import { TurnPart } from "./types/TurnPart";

interface StateSchema {
  readonly attackingMonsterInstancesIDs: string[];
  readonly attackingWeaponsIDs: string[];
  readonly instructionsOpen: boolean;
  readonly knockbackCharacterIDs: string[];
  readonly intro1StartedAt: number | null;
  readonly intro2StartedAt: number | null;
  readonly isIntro1: boolean;
  readonly isIntro2: boolean;
  readonly isMain: boolean;
  readonly isTitle: boolean;
  readonly isVictory: boolean;
  readonly modeID: string | null;
  readonly movingMonsterInstancesIDs: string[];
  readonly musicAudioSourceID: string | null;
  readonly nextModeID: string | null;
  readonly playerCharacterID: string | null;
  readonly stageID: string | null;
  readonly stageStartedAt: number | null;
  readonly turn: number;
  readonly turnPart: TurnPart | null;
  readonly untilNextMode: number | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  attackingMonsterInstancesIDs: [],
  attackingWeaponsIDs: [],
  instructionsOpen: false,
  intro1StartedAt: null,
  intro2StartedAt: null,
  isIntro1: false,
  isIntro2: false,
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
  stageStartedAt: null,
  turn: 0,
  turnPart: null,
  untilNextMode: null,
});
(
  window as unknown as {
    state: unknown;
  }
).state = state;
