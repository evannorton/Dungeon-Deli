import { State } from "pixel-pigeon";

interface StateSchema {
  modeLabelID: string | null;
  playerEntityID: string | null;
  playerSpriteInstanceID: string | null;
}

export const state: State<StateSchema> = new State({
  modeLabelID: null,
  playerEntityID: null,
  playerSpriteInstanceID: null,
});
