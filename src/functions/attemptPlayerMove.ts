import { Character } from "../characters";
import {
  CollisionData,
  EntityPosition,
  getActiveLevelID,
  getEntityPosition,
  getRectangleCollisionData,
  unlockAchievement,
} from "pixel-pigeon";
import { Direction } from "../types/Direction";
import { TurnPart } from "../types/TurnPart";
import { getDefinable } from "definables";
import { reverseModeAchievementID } from "../achievements";
import { reverseModeID, slipperyModeID } from "../modes";
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
      let endPosition: EntityPosition = {
        x: startPosition.x,
        y: startPosition.y,
      };
      if (state.values.modeID === slipperyModeID) {
        let hitCollision: boolean = false;
        while (hitCollision === false) {
          const newPosition: EntityPosition = {
            ...endPosition,
          };
          newPosition.x += xOffset * 24;
          newPosition.y += yOffset * 24;
          const transportCollisionData: CollisionData =
            getRectangleCollisionData({
              entityTypes: ["transport"],
              rectangle: {
                height: 24,
                width: 24,
                x: newPosition.x,
                y: newPosition.y,
              },
            });
          if (transportCollisionData.entityCollidables.length > 0) {
            hitCollision = true;
            endPosition = newPosition;
          }
          const collisionData: CollisionData = getRectangleCollisionData({
            entityTypes: ["chest", "monster"],
            rectangle: {
              height: 24,
              width: 24,
              x: newPosition.x,
              y: newPosition.y,
            },
          });
          if (collisionData.map || collisionData.entityCollidables.length > 0) {
            hitCollision = true;
          } else {
            endPosition = newPosition;
          }
        }
      } else {
        const newPosition: EntityPosition = {
          ...endPosition,
        };
        newPosition.x += xOffset * 24;
        newPosition.y += yOffset * 24;
        const collisionData: CollisionData = getRectangleCollisionData({
          entityTypes: ["chest", "monster"],
          rectangle: {
            height: 24,
            width: 24,
            x: newPosition.x,
            y: newPosition.y,
          },
        });
        if (
          collisionData.map === false &&
          collisionData.entityCollidables.length === 0
        ) {
          endPosition = newPosition;
        }
      }
      if (
        endPosition.x !== startPosition.x ||
        endPosition.y !== startPosition.y
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
        if (state.values.modeID === reverseModeID) {
          unlockAchievement(reverseModeAchievementID);
        }
      }
    }
  }
};
