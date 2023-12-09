import { Character } from "../characters";
import { MonsterInstance } from "../monsterInstances";
import { Stage } from "../stages";
import {
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
} from "pixel-pigeon";
import { getDefinable, getDefinables } from "../definables";
import { getRandomModeID } from "./getRandomModeID";
import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { state } from "../state";

export const createDeathHUD = (): void => {
  const centerX: number = Math.floor(480 / 2);
  const width: number = 161;
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
    opacity: 0.625,
    width,
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: centerX + 2,
      y: y + 6,
    },
    horizontalAlignment: "center",
    text: "You died! Click to restart.",
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
        const playerCharacter: Character = getDefinable(
          Character,
          state.values.playerCharacterID,
        );
        playerCharacter.reset();
        const stage: Stage = getDefinable(Stage, state.values.stageID);
        stage.reset();
        for (const monsterInstance of getDefinables(MonsterInstance).values()) {
          monsterInstance.reset();
        }
        const modeID: string = getRandomModeID();
        state.setValues({
          attackingMonsterInstancesIDs: [],
          attackingWeaponsIDs: [],
          modeID,
          movingMonsterInstancesIDs: [],
          nextModeID: getUniqueRandomModeID(modeID),
          turn: 0,
          turnPart: null,
        });
      }
    },
  });
};
