import {
  createLabel,
  createQuadrilateral,
  createSpriteInstance,
  goToLevel,
  lockCameraToEntity,
  spawnEntity,
} from "pixel-pigeon";
import { playerSpriteID } from "./sprites";
import { state } from "./state";
import { modes } from "./modes";

export const run = (): void => {
  goToLevel("test_1");
  const playerSpriteInstanceID: string = createSpriteInstance({
    getAnimationID: (): string => "default",
    spriteID: playerSpriteID,
  });
  const playerEntityID: string = spawnEntity({
    height: 24,
    layerID: "player",
    position: {
      x: 48,
      y: 48,
    },
    spriteInstanceID: playerSpriteInstanceID,
    width: 24,
    zIndex: 0,
  });
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
    getText: (): string => modes[state.values.modeIndex].name,
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
    getText: (): string => modes[state.values.nextModeIndex].name,
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
  state.setValues({
    playerEntityID
  });
  lockCameraToEntity(playerEntityID);
};
