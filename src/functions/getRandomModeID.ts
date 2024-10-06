import { Mode } from "../modes";
import { Stage } from "../stages";
import { getDefinable } from "definables";
import { state } from "../state";

export const getRandomModeID = (): string => {
  if (state.values.stageID === null) {
    throw new Error("Attempted to get random mode id with no stage.");
  }
  const stage: Stage = getDefinable(Stage, state.values.stageID);
  const index: number = Math.floor(Math.random() * stage.modes.length);
  const mode: Mode | undefined = stage.modes[index];
  if (typeof mode === "undefined") {
    throw new Error("No mode found.");
  }
  return mode.id;
};
