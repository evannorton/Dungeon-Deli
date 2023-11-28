import {
  CollisionData,
  EntityPosition,
  getEntityPosition,
  setEntityPosition,
} from "pixel-pigeon";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { state } from "../state";

export const movePlayer = (xOffset: number, yOffset: number): void => {
  if (state.values.playerEntityID === null) {
    throw new Error("Attempted to move player with no player entity ID.");
  }
  const playerPosition: EntityPosition = getEntityPosition(
    state.values.playerEntityID,
  );
  const newPlayerPosition: EntityPosition = {
    x: playerPosition.x + xOffset * 24,
    y: playerPosition.y + yOffset * 24,
  };
  const collisionData: CollisionData = getRectangleCollisionData({
    height: 24,
    width: 24,
    x: newPlayerPosition.x,
    y: newPlayerPosition.y,
  });
  if (collisionData.map === false) {
    setEntityPosition(state.values.playerEntityID, newPlayerPosition);
  }
};
