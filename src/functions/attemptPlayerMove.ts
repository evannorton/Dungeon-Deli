import { Character } from "../characters";
import {
  CollisionData,
  EntityPosition,
  getActiveLevelID,
  getEntityIDs,
} from "pixel-pigeon";
import { Direction } from "../types/Direction";
import { MonsterInstance } from "../monsterInstances";
import { getDefinable } from "../definables";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { state } from "../state";

export const attemptPlayerMove = (xOffset: number, yOffset: number): void => {
  if (state.values.playerCharacterID === null) {
    throw new Error("Attempted to move player with no player character ID.");
  }
  const character: Character = getDefinable(
    Character,
    state.values.playerCharacterID,
  );
  const levelID: string | null = getActiveLevelID();
  if (levelID === null) {
    throw new Error(
      "Attempted to attempt player move with no active level ID.",
    );
  }
  const startPosition: EntityPosition = character.getEntityPosition();
  const endPosition: EntityPosition = {
    x: startPosition.x + xOffset * 24,
    y: startPosition.y + yOffset * 24,
  };
  if (
    character.isMoving() === false &&
    getEntityIDs({
      layerID: "monster",
      levelID,
    }).every((entityID: string): boolean => {
      const monsterInstance: MonsterInstance = getDefinable(
        MonsterInstance,
        entityID,
      );
      return monsterInstance.isMoving() === false;
    })
  ) {
    const mapCollisionData: CollisionData = getRectangleCollisionData({
      height: 24,
      width: 24,
      x: endPosition.x,
      y: endPosition.y,
    });
    const monsterCollisionData: CollisionData = getRectangleCollisionData(
      {
        height: 24,
        width: 24,
        x: endPosition.x,
        y: endPosition.y,
      },
      ["monsters"],
    );
    if (
      mapCollisionData.map === false &&
      monsterCollisionData.entityCollidables.length === 0
    ) {
      character.startMovement(endPosition);
    } else {
      if (xOffset > 0) {
        character.direction = Direction.Right;
      } else if (xOffset < 0) {
        character.direction = Direction.Left;
      } else if (yOffset > 0) {
        character.direction = Direction.Down;
      } else if (yOffset < 0) {
        character.direction = Direction.Up;
      }
    }
  }
};
