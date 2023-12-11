import {
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
} from "pixel-pigeon";
import { state } from "../state";

export const createInstructionsHUD = (): void => {
  const centerX: number = Math.floor(480 / 2);
  const width: number = 302 + 12;
  const height: number = 99;
  const x: number = centerX - Math.floor(width / 2);
  const y: number = 24;
  const condition = (): boolean => state.values.instructionsOpen;
  createQuadrilateral({
    color: "#000000",
    coordinates: {
      condition,
      x,
      y,
    },
    height,
    opacity: 0.75,
    width,
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 6,
    },
    horizontalAlignment: "left",
    text: "Venture into the dungeon to retrieve your sandwich!",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 22,
    },
    horizontalAlignment: "left",
    text: "Every step is an action.",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 34,
    },
    horizontalAlignment: "left",
    text: "- Arrow keys/WASD/D-Pad to move.",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 46,
    },
    horizontalAlignment: "left",
    text: "- Click/space/A button to wait (or close menus).",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 62,
    },
    horizontalAlignment: "left",
    text: "Different terrains influence...",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 74,
    },
    horizontalAlignment: "left",
    text: "- Powers: Your attacks.",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 86,
    },
    horizontalAlignment: "left",
    text: "- Modes: Effects on the field.",
  });
  createInputPressHandler({
    condition,
    gamepadButtons: [0],
    keyboardButtons: [
      {
        value: "Space",
      },
    ],
    mouseButtons: [0],
    onInput: (): void => {
      state.setValues({ instructionsOpen: false });
    },
  });
};
