import { Mode } from "../modes";
import { Stage } from "../stages";
import { createLabel, createQuadrilateral } from "pixel-pigeon";
import { getDefinable } from "../definables";
import { state } from "../state";

export const createModeHUD = (): void => {
  const width: number = 120;
  const height: number = 37;
  const y = (): number => {
    if (state.values.stageID === null) {
      throw new Error("Attempted to get mode hud y with no stage ID");
    }
    const stage: Stage = getDefinable(Stage, state.values.stageID);
    return 312 - stage.weapons.length * 10 - height - 21;
  };
  const condition = (): boolean =>
    state.values.isMain && state.values.stageID !== null;
  const modeColor = (): string => {
    if (state.values.modeID !== null) {
      const mode: Mode = getDefinable(Mode, state.values.modeID);
      return mode.color;
    }
    return "#ffffff";
  };
  const nextModeColor = (): string => {
    if (state.values.nextModeID !== null) {
      const mode: Mode = getDefinable(Mode, state.values.nextModeID);
      return mode.color;
    }
    return "#a8a8a8";
  };
  const untilNextColor = (): string => {
    if (state.values.untilNextMode === 1) {
      return "#58d332";
    }
    return "#a8a8a8";
  };
  createQuadrilateral({
    color: "#000000",
    coordinates: {
      condition,
      x: 2,
      y,
    },
    height,
    opacity: 0.75,
    width,
  });
  createLabel({
    color: modeColor,
    coordinates: {
      condition,
      x: 2 + Math.floor(width / 2),
      y: (): number => y() + 5,
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
    color: nextModeColor,
    coordinates: {
      condition,
      x: 5,
      y: (): number => y() + 17,
    },
    horizontalAlignment: "left",
    text: "Next:",
  });
  createLabel({
    color: nextModeColor,
    coordinates: {
      condition,
      x: 2 + width - 2,
      y: (): number => y() + 17,
    },
    horizontalAlignment: "right",
    text: (): string => {
      if (state.values.nextModeID !== null) {
        return getDefinable(Mode, state.values.nextModeID).name;
      }
      return "N/A";
    },
  });
  createLabel({
    color: untilNextColor,
    coordinates: {
      condition,
      x: 5,
      y: (): number => y() + 27,
    },
    horizontalAlignment: "left",
    text: "Until next:",
  });
  createLabel({
    color: untilNextColor,
    coordinates: {
      condition,
      x: 2 + width - 2,
      y: (): number => y() + 27,
    },
    horizontalAlignment: "right",
    text: (): string => {
      if (
        state.values.nextModeID !== null &&
        state.values.untilNextMode !== null
      ) {
        return String(state.values.untilNextMode);
      }
      return "N/A";
    },
  });
};
