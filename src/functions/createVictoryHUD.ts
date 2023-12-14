import {
  CreateSpriteOptionsAnimation,
  createQuadrilateral,
  createSprite,
} from "pixel-pigeon";
import { state } from "../state";

export const createVictoryHUD = (): void => {
  const animation: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "default",
  };
  const duration: number = 100;
  const width: number = 10560;
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
  delete animation.frames[animation.frames.length - 1].duration;
  createQuadrilateral({
    color: "#582f41",
    coordinates: {
      condition: (): boolean => state.values.isVictory,
      x: 0,
      y: 0,
    },
    height: frameHeight,
    width: frameWidth,
  });
  createSprite({
    animationID: "default",
    animations: [animation],
    coordinates: {
      condition: (): boolean => state.values.isVictory,
      x: 0,
      y: 0,
    },
    imagePath: "outro",
  });
};
