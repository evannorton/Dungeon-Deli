import { State } from "pixel-pigeon";

interface StateSchema {
  playerEntityID: string | null;
  playerSpriteInstanceID: string | null;
}

export const state: State<StateSchema> = new State({
  playerEntityID: null,
  playerSpriteInstanceID: null,
});
