import { Chest } from "../chests";
import { Ingredient } from "../ingredients";
import { Stage } from "../stages";
import {
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
  createSprite,
} from "pixel-pigeon";
import { getDefinable, getDefinables } from "../definables";
import { getPlayerChest } from "./getPlayerChest";
import { state } from "../state";

export const createChestHUD = (): void => {
  const centerX: number = Math.floor(480 / 2);
  const width: number = 161;
  const height: number = 65;
  const x: number = centerX - Math.floor(width / 2);
  const y: number = 24;
  const condition = (): boolean => {
    const chest: Chest | null = getPlayerChest();
    if (chest !== null) {
      return chest.isOpen();
    }
    return false;
  };
  createQuadrilateral({
    color: "#000000",
    coordinates: {
      condition,
      x,
      y,
    },
    height,
    opacity: 0.625,
    width,
  });
  getDefinables<Ingredient>(Ingredient);
  for (const ingredient of getDefinables(Ingredient).values()) {
    createSprite({
      animationID: "default",
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
          id: "default",
        },
      ],
      coordinates: {
        condition: (): boolean => {
          if (state.values.stageID !== null && condition()) {
            const stage: Stage = getDefinable(Stage, state.values.stageID);
            return stage.ingredient.id === ingredient.id;
          }
          return false;
        },
        x: centerX - 12,
        y: y + 6,
      },
      imagePath: ingredient.imagePath,
    });
  }
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: centerX + 1,
      y: y + 36,
    },
    horizontalAlignment: "center",
    text: "New sandwich ingredient!",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: centerX + 2,
      y: y + 48,
    },
    horizontalAlignment: "center",
    text: "Click to go to next level.",
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
      if (state.values.stageID !== null) {
        const stage: Stage = getDefinable(Stage, state.values.stageID);
        stage.goToNext();
      }
    },
  });
};
