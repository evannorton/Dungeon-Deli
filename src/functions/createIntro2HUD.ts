import { CreateSpriteOptionsAnimation, createSprite } from "pixel-pigeon";
import { state } from "../state";

export const createIntro2HUD = (): void => {
  const condition = (): boolean => state.values.isIntro2;
  const animation: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "default",
  };
  const duration: number = 250;
  const width: number = 12480;
  const frameWidth: number = 480;
  for (let i: number = 0; i < width; i += frameWidth) {
    animation.frames.push({
      duration,
      height: 312,
      sourceHeight: 312,
      sourceWidth: 480,
      sourceX: i,
      sourceY: 0,
      width: 480,
    });
  }
  delete animation.frames[animation.frames.length - 1].duration;
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
