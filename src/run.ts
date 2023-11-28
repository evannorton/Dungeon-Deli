import { createSpriteInstance, goToLevel, spawnEntity } from "pixel-pigeon";
import { playerSpriteID } from "./sprites";

export const run = (): void => {
  goToLevel("test");
  const playerSpriteInstanceID = createSpriteInstance({
    getAnimationID: (): string => "default", 
    spriteID: playerSpriteID
  });
  const playerEntityID: string = spawnEntity({
    height: 24,
    layerID: "player",
    position: {
      x: 48,
      y: 48
    },
    spriteInstanceID: playerSpriteInstanceID,
    width: 24,
    zIndex: 1,
  })
  console.log(playerEntityID);
};
