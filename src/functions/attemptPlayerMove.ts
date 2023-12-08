import { Character } from "../characters";
import {
  CollisionData,
  EntityPosition,
  getActiveLevelID,
  getEntityPosition,
} from "pixel-pigeon";
import { Direction } from "../types/Direction";
import { TurnPart } from "../types/TurnPart";
import { getDefinable } from "../definables";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { state } from "../state";

export const attemptPlayerMove = (xOffset: number, yOffset: number): void => {
  if (state.values.playerCharacterID === null) {
    throw new Error("Attempted to move player with no player character ID.");
  }
  if (state.values.turnPart === null) {
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    const levelID: string | null = getActiveLevelID();
    if (levelID === null) {
      throw new Error(
        "Attempted to attempt player move with no active level ID.",
      );
    }
    if (playerCharacter.isAlive()) {
      const startPosition: EntityPosition = getEntityPosition(
        playerCharacter.entityID,
      );
      const endPosition: EntityPosition = {
        x: startPosition.x + xOffset * 24,
        y: startPosition.y + yOffset * 24,
      };
      const collisionData: CollisionData = getRectangleCollisionData(
        {
          height: 24,
          width: 24,
          x: endPosition.x,
          y: endPosition.y,
        },
        ["monster"],
      );
      if (
        collisionData.map === false &&
        collisionData.entityCollidables.length === 0
      ) {
        playerCharacter.startMovement(endPosition);
        state.setValues({ turnPart: TurnPart.PlayerMoving });
      } else {
        if (xOffset > 0) {
          playerCharacter.direction = Direction.Right;
        } else if (xOffset < 0) {
          playerCharacter.direction = Direction.Left;
        } else if (yOffset > 0) {
          playerCharacter.direction = Direction.Down;
        } else if (yOffset < 0) {
          playerCharacter.direction = Direction.Up;
        }
      }
    }
  }
};
