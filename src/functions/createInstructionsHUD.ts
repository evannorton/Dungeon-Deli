import { createLabel, createQuadrilateral } from "pixel-pigeon";
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
    text: { value: "Venture into the dungeon to retrieve your sandwich!" },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 22,
    },
    horizontalAlignment: "left",
    text: { value: "Every step is a turn." },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 34,
    },
    horizontalAlignment: "left",
    text: { value: "- Arrow keys/WASD/D-Pad to move." },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 46,
    },
    horizontalAlignment: "left",
    text: { value: "- Click/space/A button to wait (or close menus)." },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 62,
    },
    horizontalAlignment: "left",
    text: { value: "Different terrains influence..." },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 74,
    },
    horizontalAlignment: "left",
    text: { value: "- Powers: Your attacks." },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + 6,
      y: y + 86,
    },
    horizontalAlignment: "left",
    text: { value: "- Modes: Effects on the field." },
  });
};
