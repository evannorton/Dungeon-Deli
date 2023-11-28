import { createSprite } from "pixel-pigeon";

export const playerSpriteID: string = createSprite({
  animations: [
    {
      id: "default",
      frames: [
        {
          height: 24,
          sourceHeight: 24,
          sourceWidth: 24,
          sourceX: 0,
          sourceY: 0,
          width: 24
        },
      ],
    }
  ],
  imagePath: "player"
})