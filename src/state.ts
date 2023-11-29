import { State } from "pixel-pigeon";

interface StateSchema {
  playerEntityID: string | null;
}

export const state: State<StateSchema> = new State({
  playerEntityID: null,
});
