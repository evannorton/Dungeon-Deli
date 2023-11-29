import { modes } from "../modes";

export const getRandomModeIndex = (): number =>
  Math.floor(Math.random() * modes.length);
