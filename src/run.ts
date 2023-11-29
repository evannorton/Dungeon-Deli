import {
  createLabel,
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
  const modeLabelID: string = createLabel({
    color: "#ffffff",
    coordinates: {
      x: 8,
      y: 8,
    },
    getText: (): string => "Current mode: lorem ipsum"
  })
  state.setValues({
    modeLabelID,
    playerEntityID,
    playerSpriteInstanceID,
  });
  lockCameraToEntity(playerEntityID);
};
