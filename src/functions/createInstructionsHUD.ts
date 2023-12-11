import {
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
} from "pixel-pigeon";
import { state } from "../state";

export const createInstructionsHUD = (): void => {
  const centerX: number = Math.floor(480 / 2);
  const width: number = 302 + 12;
  const height: number = 67;
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
      y: y + 18,
    },
    horizontalAlignment: "left",
    text: "- Arrow keys/WASD/D-pad to move.",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 30,
    },
    horizontalAlignment: "left",
    text: "- Powers trigger as you step.",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 42,
    },
    horizontalAlignment: "left",
    text: "- Click/space/A button to wait.",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 54,
    },
    horizontalAlignment: "left",
    text: "- Click/space/A button to close menus.",
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
