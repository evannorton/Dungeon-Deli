import {
  CreateSpriteOptionsAnimation,
  createQuadrilateral,
  createSprite,
  getCurrentTime,
} from "pixel-pigeon";
import { state } from "../state";

export const createVictoryHUD = (): void => {
  const animation1: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "1",
  };
  const duration: number = 100;
  const width: number = 3360;
  const height: number = 2184;
  const frameWidth: number = 480;
  const frameHeight: number = 312;
  for (let sourceY: number = 0; sourceY < height; sourceY += frameHeight) {
    for (let sourceX: number = 0; sourceX < width; sourceX += frameWidth) {
      animation1.frames.push({
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
  const animation2: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "2",
  };
  animation2.frames.push(animation1.frames[animation1.frames.length - 2]);
  const animation3: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "3",
  };
  animation3.frames.push(animation1.frames[animation1.frames.length - 1]);
  animation1.frames.pop();
  animation1.frames.pop();
  delete animation1.frames[animation1.frames.length - 1].duration;
  delete animation2.frames[animation2.frames.length - 1].duration;
  delete animation3.frames[animation3.frames.length - 1].duration;
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
  const startTime: number = getCurrentTime();
  createSprite({
    animationID: (): string => {
      const now: number = getCurrentTime();
      if (now > startTime + duration * 75 + duration) {
        return "3";
      }
      if (now > startTime + duration * 75) {
        return "2";
      }
      return "1";
    },
    animations: [animation1, animation2, animation3],
    coordinates: {
      condition: (): boolean => state.values.isVictory,
      x: 0,
      y: 0,
    },
    imagePath: "outro",
  });
};
