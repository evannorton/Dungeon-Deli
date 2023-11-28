import { createSprite } from "pixel-pigeon";

export const pigeonSpriteID: string = createSprite({
  animations: [
    {
      frames: [
        {
          height: 32,
          sourceHeight: 32,
          sourceWidth: 32,
          sourceX: 32,
          sourceY: 0,
          width: 32,
        },
      ],
      id: "idle-down",
    },
    {
      frames: [
        {
          height: 32,
          sourceHeight: 32,
          sourceWidth: 32,
          sourceX: 32,
          sourceY: 32,
          width: 32,
        },
      ],
      id: "idle-left",
    },
    {
      frames: [
        {
          height: 32,
          sourceHeight: 32,
          sourceWidth: 32,
          sourceX: 32,
          sourceY: 64,
          width: 32,
        },
      ],
      id: "idle-right",
    },
    {
      frames: [
        {
          height: 32,
          sourceHeight: 32,
          sourceWidth: 32,
          sourceX: 32,
          sourceY: 96,
          width: 32,
        },
      ],
      id: "idle-up",
    },
  ],
  imagePath: "pigeon",
});
