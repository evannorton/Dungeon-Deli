import {
  createSpriteInstance,
  goToLevel,
  lockCameraToEntity,
  spawnEntity,
} from "pixel-pigeon";
import { playerSpriteID } from "./sprites";
import { state } from "./state";

export const run = (): void => {
  goToLevel("test");
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
    zIndex: 1,
  });
  state.setValues({
    playerEntityID,
    playerSpriteInstanceID,
  });
  lockCameraToEntity(playerEntityID);
};
