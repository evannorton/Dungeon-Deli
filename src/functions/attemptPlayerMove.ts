import { CollisionData, EntityPosition, getEntityPosition } from "pixel-pigeon";
import { Direction } from "../types/Direction";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { movePlayer } from "./movePlayer";
import { state } from "../state";

export const attemptPlayerMove = (xOffset: number, yOffset: number): void => {
  if (state.values.playerEntityID === null) {
    throw new Error("Attempted to move player with no player entity ID.");
  }
  if (state.values.playerMove === null) {
    const startPosition: EntityPosition = getEntityPosition(
      state.values.playerEntityID,
    );
    const endPosition: EntityPosition = {
      x: startPosition.x + xOffset * 24,
      y: startPosition.y + yOffset * 24,
    };
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
      movePlayer(startPosition, endPosition);
    } else {
      if (xOffset > 0) {
        state.setValues({ direction: Direction.Right });
      } else if (xOffset < 0) {
        state.setValues({ direction: Direction.Left });
      } else if (yOffset > 0) {
        state.setValues({ direction: Direction.Down });
      } else if (yOffset < 0) {
        state.setValues({ direction: Direction.Up });
      }
    }
  }
};
