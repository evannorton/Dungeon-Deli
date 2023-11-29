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
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";
import { getUniqueRandomModeIndex } from "./getUniqueRandomModeIndex";

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
  const transportCollisionData: CollisionData = getRectangleCollisionData(
    {
      height: 24,
      width: 24,
      x: newPlayerPosition.x,
      y: newPlayerPosition.y,
    },
    ["transport"],
  );
  if (mapCollisionData.map === false) {
    const transportEntityID: string | null =
      transportCollisionData.entityCollidables.length > 0
        ? transportCollisionData.entityCollidables[0].entityID
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
      setEntityPosition(state.values.playerEntityID, {
        x: targetX * 24,
        y: targetY * 24,
      });
      setEntityLevel(state.values.playerEntityID, targetLevelID);
      goToLevel(targetLevelID);
    } else {
      setEntityPosition(state.values.playerEntityID, newPlayerPosition);
    }
    state.setValues({
      turnsUntilNextMode: state.values.turnsUntilNextMode - 1,
    });
    if (state.values.turnsUntilNextMode === 0) {
      const modeIndex: number = state.values.nextModeIndex;
      state.setValues({
        modeIndex,
        nextModeIndex: getUniqueRandomModeIndex(modeIndex),
        turnsUntilNextMode: turnsPerMode,
      });
    }
  }
};
