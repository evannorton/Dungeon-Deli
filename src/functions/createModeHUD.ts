import {
  CreateLabelOptionsText,
  CreateSpriteOptionsAnimation,
  createLabel,
  createQuadrilateral,
  createSprite,
} from "pixel-pigeon";
import { Mode } from "../modes";
import { Stage } from "../stages";
import { getDefinable, getDefinables } from "definables";
import { state } from "../state";

export const createModeHUD = (): void => {
  const width: number = 120;
  const height: number = 66;
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
    text: (): CreateLabelOptionsText => {
      if (state.values.modeID !== null) {
        return {
          value: `${getDefinable(Mode, state.values.modeID).name} Mode`,
        };
      }
      return { value: "" };
    },
  });
  createLabel({
    color: nextModeColor,
    coordinates: {
      condition,
      x: 5,
      y: (): number => y() + 46,
    },
    horizontalAlignment: "left",
    text: { value: "Next:" },
  });
  createLabel({
    color: nextModeColor,
    coordinates: {
      condition,
      x: 2 + width - 2,
      y: (): number => y() + 46,
    },
    horizontalAlignment: "right",
    text: (): CreateLabelOptionsText => {
      if (state.values.nextModeID !== null) {
        return { value: getDefinable(Mode, state.values.nextModeID).name };
      }
      return { value: "N/A" };
    },
  });
  createLabel({
    color: untilNextColor,
    coordinates: {
      condition,
      x: 5,
      y: (): number => y() + 56,
    },
    horizontalAlignment: "left",
    text: { value: "Until next:" },
  });
  createLabel({
    color: untilNextColor,
    coordinates: {
      condition,
      x: 2 + width - 2,
      y: (): number => y() + 56,
    },
    horizontalAlignment: "right",
    text: (): CreateLabelOptionsText => {
      if (
        state.values.nextModeID !== null &&
        state.values.untilNextMode !== null
      ) {
        return {
          value: `${state.values.untilNextMode} ${
            state.values.untilNextMode === 1 ? "turn" : "turns"
          }`,
        };
      }
      return { value: "N/A" };
    },
  });
  const animations: CreateSpriteOptionsAnimation[] = [
    {
      frames: [],
      id: "empty",
    },
  ];
  for (const mode of getDefinables(Mode).values()) {
    animations.push({
      frames: [
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: mode.sourceY,
          width: 24,
        },
      ],
      id: mode.id,
    });
  }
  createSprite({
    animationID: (): string => {
      if (state.values.modeID === null) {
        return "empty";
      }
      return state.values.modeID;
    },
    animations,
    coordinates: {
      condition,
      x: 50,
      y: (): number => y() + 17,
    },
    imagePath: "mode-icons",
  });
};
