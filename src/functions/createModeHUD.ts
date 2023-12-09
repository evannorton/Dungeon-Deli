import { Mode } from "../modes";
import { createLabel, createQuadrilateral } from "pixel-pigeon";
import { getDefinable } from "../definables";
import { state } from "../state";

export const createModeHUD = (): void => {
  const width: number = 120;
  const height: number = 37;
  const y: number = 312 - 2 - height;
  createQuadrilateral({
    color: "#000000",
    coordinates: {
      x: 2,
      y,
    },
    height,
    opacity: 0.75,
    width,
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 2 + Math.floor(width / 2),
      y: y + 5,
    },
    horizontalAlignment: "center",
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
      y: 312 - 22,
    },
    horizontalAlignment: "left",
    text: "Next:",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 2 + width - 2,
      y: 312 - 22,
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
      y: 312 - 12,
    },
    horizontalAlignment: "left",
    text: "Until next:",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 2 + width - 2,
      y: 312 - 12,
    },
    horizontalAlignment: "right",
    text: (): string => String(state.values.untilNextMode),
  });
};
