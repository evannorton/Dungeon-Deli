import {
  CollisionData,
  EntityPosition,
  getEntityFieldValue,
  getEntityPosition,
  goToLevel,
  setEntityLevel,
  setEntityPosition,
} from "pixel-pigeon";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { spendTurn } from "./spendTurn";
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
  const mapCollisionData: CollisionData = getRectangleCollisionData({
    height: 24,
    width: 24,
    x: newPlayerPosition.x,
    y: newPlayerPosition.y,
  });
  if (mapCollisionData.map === false) {
    const transportCollisionData: CollisionData = getRectangleCollisionData(
      {
        height: 24,
        width: 24,
        x: newPlayerPosition.x,
        y: newPlayerPosition.y,
      },
      ["transports"],
    );
    const transportEntityID: string | null =
      transportCollisionData.entityCollidables.length > 0
        ? transportCollisionData.entityCollidables[0].entityID
        : null;
    const monsterCollisionData: CollisionData = getRectangleCollisionData(
      {
        height: 24,
        width: 24,
        x: newPlayerPosition.x,
        y: newPlayerPosition.y,
      },
      ["monsters"],
    );
    const monsterEntityID: string | null =
      monsterCollisionData.entityCollidables.length > 0
        ? monsterCollisionData.entityCollidables[0].entityID
        : null;
    if (transportEntityID !== null) {
      const targetLevelID: unknown = getEntityFieldValue(
        transportEntityID,
        "target_level_id",
      );
      const targetX: unknown = getEntityFieldValue(
        transportEntityID,
        "target_x",
      );
      const targetY: unknown = getEntityFieldValue(
        transportEntityID,
        "target_y",
      );
      if (typeof targetLevelID !== "string") {
        throw new Error(
          `Entity "${transportEntityID}" has an invalid "target_level_id" value.`,
        );
      }
      if (typeof targetX !== "number") {
        throw new Error(
          `Entity "${transportEntityID}" has an invalid "target_x" value.`,
        );
      }
      if (typeof targetY !== "number") {
        throw new Error(
          `Entity "${transportEntityID}" has an invalid "target_y" value.`,
        );
      }
      setEntityLevel(state.values.playerEntityID, targetLevelID);
      setEntityPosition(state.values.playerEntityID, {
        x: targetX * 24,
        y: targetY * 24,
      });
      goToLevel(targetLevelID);
      spendTurn();
    } else if (monsterEntityID !== null) {
    } else {
      setEntityPosition(state.values.playerEntityID, newPlayerPosition);
      spendTurn();
    }
  }
};
