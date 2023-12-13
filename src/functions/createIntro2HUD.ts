import {
  CreateSpriteOptionsAnimation,
  createInputPressHandler,
  createLabel,
  createSprite,
  getCurrentTime,
} from "pixel-pigeon";
import { Stage } from "../stages";
import { getDefinable } from "../definables";
import { startingStageID } from "../constants/startingStageID";
import { state } from "../state";

let textLine: number = 0;

export const createIntro2HUD = (): void => {
  const clickCooldown: number = 4000;
  const condition = (): boolean => state.values.isIntro2;
  const animation: CreateSpriteOptionsAnimation = {
    frames: [],
    id: "default",
  };
  const duration: number = 250;
  const width: number = 8160;
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
  const messageX: number = 80;
  const messageY: number = 146;
  const messageWidth: number = 314;
  const messageHeight: number = 112;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: messageHeight,
            sourceHeight: 112,
            sourceWidth: width,
            sourceX: 0,
            sourceY: 0,
            width: messageWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: messageX,
      y: messageY,
    },
    imagePath: "intro-box",
  });
  createLabel({
    color: "#8c0c79",
    coordinates: {
      condition,
      x: messageX + 11,
      y: messageY + 11,
    },
    horizontalAlignment: "left",
    text: (): string => {
      if (
        state.values.intro2StartedAt !== null &&
        getCurrentTime() <= state.values.intro2StartedAt + 2500
      ) {
        return "...";
      }
      return "";
    },
  });
  const lines1: string[] = ["A sinkhole?!! WAAAAaaaaaaahhhh!!"];
  lines1.forEach((line: string, index: number): void => {
    createLabel({
      color: "#8c0c79",
      coordinates: {
        condition,
        x: messageX + 11,
        y: messageY + 11 + index * 11,
      },
      horizontalAlignment: "left",
      text: (): string => {
        if (
          state.values.intro2StartedAt !== null &&
          getCurrentTime() > state.values.intro2StartedAt + 2500
        ) {
          return line;
        }
        return "";
      },
    });
  });
  const lines2: string[] = [
    "Uuugh...ouuch...and I was just about to enjoy",
    "my sandwich...",
  ];
  lines2.forEach((line: string, index: number): void => {
    createLabel({
      color: "#8c0c79",
      coordinates: {
        condition,
        x: messageX + 11,
        y: messageY + 30 + index * 11,
      },
      horizontalAlignment: "left",
      text: (): string => {
        if (
          textLine >= 1 &&
          state.values.intro2StartedAt !== null &&
          getCurrentTime() > state.values.intro2StartedAt + 2500
        ) {
          return line;
        }
        return "";
      },
    });
  });
  const lines3: string[] = [
    "Hey wait!! My sandwich! Those critters are",
    "taking it apart!!",
  ];
  lines3.forEach((line: string, index: number): void => {
    createLabel({
      color: "#8c0c79",
      coordinates: {
        condition,
        x: messageX + 11,
        y: messageY + 60 + index * 11,
      },
      horizontalAlignment: "left",
      text: (): string => {
        if (
          textLine >= 2 &&
          state.values.intro2StartedAt !== null &&
          getCurrentTime() > state.values.intro2StartedAt + 2500
        ) {
          return line;
        }
        return "";
      },
    });
  });
  createLabel({
    color: "#8c0c79",
    coordinates: {
      condition,
      x: messageX + Math.floor(messageWidth / 2) + 1,
      y: messageY + messageHeight - 18,
    },
    horizontalAlignment: "center",
    text: (): string => {
      if (
        state.values.intro2StartedAt !== null &&
        getCurrentTime() > state.values.intro2StartedAt + clickCooldown
      ) {
        return "- Click to continue -";
      }
      return "";
    },
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
      if (
        textLine === 0 &&
        state.values.intro2StartedAt !== null &&
        getCurrentTime() > state.values.intro2StartedAt + clickCooldown
      ) {
        textLine++;
      } else {
        if (textLine === 1) {
          textLine++;
        } else if (textLine === 2) {
          state.setValues({
            isIntro2: false,
            isMain: true,
          });
          getDefinable(Stage, startingStageID).start();
        }
      }
    },
  });
};
