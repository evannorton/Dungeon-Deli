import { createSprite } from "pixel-pigeon";
import { walkDuration } from "./constants/walkDuration";

const playerWalkFrameDuration: number = Math.round(walkDuration / 2);

export const playerSpriteID: string = createSprite({
  animations: [
    {
      frames: [
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 0,
          width: 24,
        },
      ],
      id: "idle-down",
    },
    {
      frames: [
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 24,
          width: 24,
        },
      ],
      id: "idle-right",
    },
    {
      frames: [
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 48,
          width: 24,
        },
      ],
      id: "idle-left",
    },
    {
      frames: [
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 72,
          width: 24,
        },
      ],
      id: "idle-up",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 24,
          sourceY: 0,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 0,
          width: 24,
        },
      ],
      id: "walk-down-step-right",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 48,
          sourceY: 0,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 0,
          width: 24,
        },
      ],
      id: "walk-down-step-left",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 24,
          sourceY: 24,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 24,
          width: 24,
        },
      ],
      id: "walk-right-step-right",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 48,
          sourceY: 24,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 24,
          width: 24,
        },
      ],
      id: "walk-right-step-left",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 24,
          sourceY: 48,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 48,
          width: 24,
        },
      ],
      id: "walk-left-step-right",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 48,
          sourceY: 48,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 48,
          width: 24,
        },
      ],
      id: "walk-left-step-left",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 24,
          sourceY: 72,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 72,
          width: 24,
        },
      ],
      id: "walk-up-step-right",
    },
    {
      frames: [
        {
          duration: playerWalkFrameDuration,
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 48,
          sourceY: 72,
          width: 24,
        },
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 72,
          width: 24,
        },
      ],
      id: "walk-up-step-left",
    },
  ],
  imagePath: "player",
});
