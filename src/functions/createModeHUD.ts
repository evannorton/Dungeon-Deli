import { Mode } from "../modes";
import { createLabel, createQuadrilateral } from "pixel-pigeon";
import { getDefinable } from "../definables";
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";

export const createModeHUD = (): void => {
  createQuadrilateral({
    color: "#000000",
    coordinates: {
      x: 2,
      y: 270 - 35,
    },
    height: 33,
    opacity: 0.625,
    width: 118,
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 5,
      y: 270 - 32,
    },
    horizontalAlignment: "left",
    text: "Mode:",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 117,
      y: 270 - 32,
    },
    horizontalAlignment: "right",
    text: (): string => {
      if (state.values.modeID !== null) {
        return getDefinable(Mode, state.values.modeID).name;
      }
      return "";
    },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 5,
      y: 270 - 22,
    },
    horizontalAlignment: "left",
    text: "Next mode:",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 117,
      y: 270 - 22,
    },
    horizontalAlignment: "right",
    text: (): string => {
      if (state.values.nextModeID !== null) {
        return getDefinable(Mode, state.values.nextModeID).name;
      }
      return "";
    },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 5,
      y: 270 - 12,
    },
    horizontalAlignment: "left",
    text: "Until next:",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 117,
      y: 270 - 12,
    },
    horizontalAlignment: "right",
    text: (): string =>
      String(turnsPerMode - (state.values.turn % turnsPerMode)),
  });
};
