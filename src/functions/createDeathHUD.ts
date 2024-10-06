import { Character } from "../characters";
import { Stage } from "../stages";
import { createInputPressHandler, createSprite } from "pixel-pigeon";
import { getDefinable } from "definables";
import { passInputCollectionID } from "../inputCollections";
import { state } from "../state";

export const createDeathHUD = (): void => {
  const centerX: number = Math.floor(480 / 2);
  const y: number = 24;
  const condition = (): boolean => {
    if (state.values.playerCharacterID !== null) {
      const playerCharacter: Character = getDefinable(
        Character,
        state.values.playerCharacterID,
      );
      return playerCharacter.isAlive() === false;
    }
    return false;
  };
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
      x: centerX - 54,
      y,
    },
    imagePath: "retry",
  });
  createInputPressHandler({
    condition,
    inputCollectionID: passInputCollectionID,
    onInput: (): void => {
      if (
        state.values.playerCharacterID !== null &&
        state.values.stageID !== null
      ) {
        const stage: Stage = getDefinable(Stage, state.values.stageID);
        stage.start();
      }
    },
  });
};
