import { CreateSpriteOptionsAnimation, createSprite } from "pixel-pigeon";
import { state } from "../state";

export const createIntro2HUD = (): void => {
  const condition = (): boolean => state.values.isIntro2;
  const animation: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "default",
  };
  const duration: number = 250;
  const width: number = 6240;
  const height: number = 624;
  const frameWidth: number = 480;
  const frameHeight: number = 312;
  for (let sourceY: number = 0; sourceY < height; sourceY += frameHeight) {
    for (let sourceX: number = 0; sourceX < width; sourceX += frameWidth) {
      animation.frames.push({
        duration,
        height: frameHeight,
        sourceHeight: frameHeight,
        sourceWidth: frameWidth,
        sourceX,
        sourceY,
        width: frameWidth,
      });
    }
  }
  delete animation.frames[animation.frames.length - 1]?.duration;
  createSprite({
    animationID: "default",
    animations: [animation],
    coordinates: {
      condition,
      x: 0,
      y: 0,
    },
    imagePath: "intro",
  });
};
