import {
  CreateSpriteOptionsAnimation,
  createInputPressHandler,
  createSprite,
  playAudioSource,
} from "pixel-pigeon";
import { Stage } from "../stages";
import { getDefinable } from "../definables";
import { musicVolumeChannelID } from "../volumeChannels";
import { startingStageID } from "../constants/startingStageID";
import { state } from "../state";

export const createTitleHUD = (): void => {
  const condition = (): boolean => state.values.isTitle;
  const animation: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "default",
  };
  for (let i: number = 0; i < 8160; i += 480) {
    animation.frames.push({
      duration: 250,
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
            height: 312,
            sourceHeight: 312,
            sourceWidth: 480,
            sourceX: 0,
            sourceY: 0,
            width: 480,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: 0,
      y: 0,
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
    ],
    mouseButtons: [0],
    onInput: (): void => {
      state.setValues({
        isMain: true,
        isTitle: false,
      });
      getDefinable(Stage, startingStageID).start();
      playAudioSource("cavern-theme-base", {
        loopPoint: 12800,
        volumeChannelID: musicVolumeChannelID,
      });
    },
  });
};
