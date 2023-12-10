import { createSprite } from "pixel-pigeon";
import { state } from "../state";

export const createVictoryHUD = (): void => {
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
      condition: (): boolean => state.values.isVictory,
      x: 0,
      y: 0,
    },
    imagePath: "victory",
  });
};
