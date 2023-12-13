import {
  CreateSpriteOptionsAnimation,
  createInputPressHandler,
  createSprite,
  getCurrentTime,
} from "pixel-pigeon";
import { createIntro1HUD } from "./createIntro1HUD";
import { state } from "../state";

export const createTitleHUD = (): void => {
  const condition = (): boolean => state.values.isTitle;
  const animation: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "default",
  };
  for (let i: number = 0; i < 8160; i += 480) {
    animation.frames.push({
      duration: 200,
      height: 312,
      sourceHeight: 312,
      sourceWidth: 480,
      sourceX: i,
      sourceY: 0,
      width: 480,
    });
  }
  createSprite({
    animationID: "default",
    animations: [animation],
    coordinates: {
      condition,
      x: 0,
      y: 0,
    },
    imagePath: "title-animation",
  });
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 105,
            sourceHeight: 105,
            sourceWidth: 256,
            sourceX: 0,
            sourceY: 0,
            width: 256,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: 225,
      y: 0,
    },
    imagePath: "title-sign",
  });
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 46,
            sourceHeight: 46,
            sourceWidth: 108,
            sourceX: 0,
            sourceY: 0,
            width: 108,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: 360,
      y: 249,
    },
    imagePath: "title-start",
  });
  createInputPressHandler({
    condition,
    gamepadButtons: [0],
    keyboardButtons: [
      {
        value: "Space",
      },
      {
        value: "Numpad5",
        withoutNumlock: true,
      },
    ],
    mouseButtons: [0],
    onInput: (): void => {
      state.setValues({
        intro1StartedAt: getCurrentTime(),
        isIntro1: true,
        isTitle: false,
      });
      createIntro1HUD();
    },
  });
};
