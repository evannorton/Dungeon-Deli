import { Mode } from "../modes";
import { createLabel, createQuadrilateral } from "pixel-pigeon";
import { getDefinable } from "../definables";
import { state } from "../state";

export const createHUD = (): void => {
  createQuadrilateral({
    color: "#000000",
    coordinates: {
      x: 2,
      y: 145,
    },
    height: 33,
    opacity: 0.5,
    width: 138,
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 5,
      y: 148,
    },
    getText: (): string => "Mode:",
    horizontalAlignment: "left",
    verticalAlignment: "top",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 137,
      y: 148,
    },
    getText: (): string => getDefinable(Mode, state.values.modeID).name,
    horizontalAlignment: "right",
    verticalAlignment: "top",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 5,
      y: 158,
    },
    getText: (): string => "Next mode:",
    horizontalAlignment: "left",
    verticalAlignment: "top",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 137,
      y: 158,
    },
    getText: (): string => getDefinable(Mode, state.values.nextModeID).name,
    horizontalAlignment: "right",
    verticalAlignment: "top",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 5,
      y: 168,
    },
    getText: (): string => "Until next:",
    horizontalAlignment: "left",
    verticalAlignment: "top",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 137,
      y: 168,
    },
    getText: (): string => String(state.values.turnsUntilNextMode),
    horizontalAlignment: "right",
    verticalAlignment: "top",
  });
};
