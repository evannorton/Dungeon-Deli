import { Character } from "../characters";
import { Stage } from "../stages";
import {
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
} from "pixel-pigeon";
import { getDefinable } from "../definables";
import { state } from "../state";

export const createDeathHUD = (): void => {
  const centerX: number = Math.floor(480 / 2);
  const width: number = 63;
  const height: number = 19;
  const x: number = centerX - Math.floor(width / 2);
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
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: centerX + 1,
      y: y + 6,
    },
    horizontalAlignment: "center",
    text: "You died!",
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
