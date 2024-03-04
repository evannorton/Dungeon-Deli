import {
  CreateSpriteOptionsAnimation,
  createInputPressHandler,
  createLabel,
  createSprite,
  getCurrentTime,
} from "pixel-pigeon";
import { createIntro2HUD } from "./createIntro2HUD";
import { passInputCollectionID } from "../inputCollections";
import { state } from "../state";

export const createIntro1HUD = (): void => {
  const condition = (): boolean => state.values.isIntro1;
  const clickCooldown: number = 1000;
  const animation: CreateSpriteOptionsAnimation = {
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
  };
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
  const x: number = 80;
  const y: number = 146;
  const width: number = 314;
  const height: number = 112;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height,
            sourceHeight: 112,
            sourceWidth: width,
            sourceX: 0,
            sourceY: 0,
            width,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x,
      y,
    },
    imagePath: "intro-box",
  });
  const lines: string[] = [
    "What a wonderful place for a picnic! It's so",
    "peaceful out here. I really outdid myself with",
    "this sandwich. Can't wait to take a bite!",
  ];
  lines.forEach((line: string, index: number): void => {
    createLabel({
      color: "#8c0c79",
      coordinates: {
        condition,
        x: x + 11,
        y: y + 11 + index * 11,
      },
      horizontalAlignment: "left",
      text: line,
    });
  });
  createLabel({
    color: "#8c0c79",
    coordinates: {
      condition,
      x: x + Math.floor(width / 2),
      y: y + height - 18,
    },
    horizontalAlignment: "center",
    text: (): string => {
      if (
        state.values.intro1StartedAt !== null &&
        getCurrentTime() > state.values.intro1StartedAt + clickCooldown
      ) {
        return "- Click to continue -";
      }
      return "";
    },
  });
  createInputPressHandler({
    condition,
    inputCollectionID: passInputCollectionID,
    onInput: (): void => {
      if (
        state.values.intro1StartedAt !== null &&
        getCurrentTime() > state.values.intro1StartedAt + clickCooldown
      ) {
        state.setValues({
          intro2StartedAt: getCurrentTime(),
          isIntro1: false,
          isIntro2: true,
        });
        createIntro2HUD();
      }
    },
  });
};
