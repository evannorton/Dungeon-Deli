import {
  CollisionData,
  EntityPosition,
  getActiveLevelID,
  getEntityFieldValue,
  getEntityIDs,
  getEntityPosition,
  goToLevel,
  setEntityLevel,
  setEntityPosition,
} from "pixel-pigeon";
import { MonsterInstance } from "../monsterInstances";
import { Stage } from "../stages";
import { getDefinable } from "../definables";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";

export const doTurn = (): void => {
  if (state.values.playerEntityID === null) {
    throw new Error("Attempted to do turn with no player entity.");
  }
  if (state.values.stageID === null) {
    throw new Error("Attempted to do turn with no active stage.");
  }
  state.setValues({
    turn: state.values.turn + 1,
  });
  const entityPosition: EntityPosition = getEntityPosition(
    state.values.playerEntityID,
  );
  const transportCollisionData: CollisionData = getRectangleCollisionData(
    {
      height: 24,
      width: 24,
      x: entityPosition.x,
      y: entityPosition.y,
    },
    ["transports"],
  );
  const transportEntityID: string | null =
    transportCollisionData.entityCollidables.length > 0
      ? transportCollisionData.entityCollidables[0].entityID
      : null;
  if (transportEntityID !== null) {
    const targetLevelID: unknown = getEntityFieldValue(
      transportEntityID,
      "target_level_id",
    );
    const targetX: unknown = getEntityFieldValue(transportEntityID, "target_x");
    const targetY: unknown = getEntityFieldValue(transportEntityID, "target_y");
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
  }
  getDefinable(Stage, state.values.stageID).doTurn();
  const levelID: string | null = getActiveLevelID();
  if (levelID === null) {
    throw new Error("Attempted to do turn with no active level.");
  }
  console.log(levelID);
  for (const entityID of getEntityIDs({
    layerID: "monsters",
    levelID,
  })) {
    console.log("move monster");
    const monsterInstance: MonsterInstance = getDefinable(
      MonsterInstance,
      entityID,
    );
    monsterInstance.doTurn();
  }
  if (state.values.turn % turnsPerMode === 0) {
    const modeID: string = state.values.nextModeID;
    state.setValues({
      modeID,
      nextModeID: getUniqueRandomModeID(modeID),
    });
  }
};
