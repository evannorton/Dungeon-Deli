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
      y: 163,
    },
    height: 15,
    opacity: 0.5,
    width: 156,
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      x: 6,
      y: 167,
    },
    getText: (): string => "Current mode: lorem ipsum",
    horizontalAlignment: "left",
    verticalAlignment: "top",
  });
  state.setValues({
    playerEntityID,
  });
  lockCameraToEntity(playerEntityID);
};
