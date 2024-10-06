import {
  CreateLabelOptionsText,
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
  createSprite,
} from "pixel-pigeon";
import { Ingredient } from "../ingredients";
import { Stage } from "../stages";
import { getDefinable, getDefinables } from "definables";
import { passInputCollectionID } from "../inputCollections";
import { state } from "../state";

export const createChestHUD = (): void => {
  const centerX: number = Math.floor(480 / 2);
  const width: number = 158;
  const height: number = 79;
  const x: number = centerX - Math.floor(width / 2);
  const y: number = 24;
  const condition = (): boolean => {
    if (state.values.isMain) {
      return state.values.openChestID !== null;
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
    opacity: 0.75,
    width,
  });
  getDefinables<Ingredient>(Ingredient);
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
          return true;
        }
        return false;
      },
      x: centerX - 12,
      y: y + 6,
    },
    imagePath: "food-border",
  });
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
      x: centerX,
      y: y + 36,
    },
    horizontalAlignment: "center",
    text: { value: "New sandwich ingredient!" },
  });
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
        if (condition() && state.values.stageID !== null) {
          return (
            state.values.turn >
            getDefinable(Stage, state.values.stageID).parSteps
          );
        }
        return false;
      },
      x: 173,
      y: 73,
    },
    imagePath: "stars/silver",
  });
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
        if (condition() && state.values.stageID !== null) {
          return (
            state.values.turn <=
            getDefinable(Stage, state.values.stageID).parSteps
          );
        }
        return false;
      },
      x: 173,
      y: 73,
    },
    imagePath: "stars/gold",
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 209,
      y: 75,
    },
    horizontalAlignment: "left",
    text: { value: "Your steps:" },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 209,
      y: 88,
    },
    horizontalAlignment: "left",
    text: { value: "Goal steps:" },
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 309,
      y: 75,
    },
    horizontalAlignment: "right",
    text: (): CreateLabelOptionsText => ({
      value: state.values.turn > 999 ? "999+" : String(state.values.turn),
    }),
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 309,
      y: 88,
    },
    horizontalAlignment: "right",
    text: (): CreateLabelOptionsText => {
      if (state.values.stageID !== null) {
        return {
          value: String(getDefinable(Stage, state.values.stageID).parSteps),
        };
      }
      return { value: "" };
    },
  });
  createInputPressHandler({
    condition,
    inputCollectionID: passInputCollectionID,
    onInput: (): void => {
      if (state.values.stageID !== null) {
        const stage: Stage = getDefinable(Stage, state.values.stageID);
        stage.goToNext();
      }
    },
  });
};
