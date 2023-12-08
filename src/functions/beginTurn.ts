import { Character } from "../characters";
import {
  CollisionData,
  EntityPosition,
  getEntityFieldValue,
  getEntityPosition,
  goToLevel,
  setEntityLevel,
  setEntityPosition,
} from "pixel-pigeon";
import { Stage } from "../stages";
import { TurnPart } from "../types/TurnPart";
import { getDefinable } from "../definables";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { startMonsterInstancesMovement } from "./startMonsterInstancesMovement";
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";

export const beginTurn = (): void => {
  if (state.values.playerCharacterID === null) {
    throw new Error("Attempted to begin turn with no player character.");
  }
  state.setValues({
    turn: state.values.turn + 1,
  });
  const playerCharacter: Character = getDefinable(
    Character,
    state.values.playerCharacterID,
  );
  const playerPosition: EntityPosition = getEntityPosition(
    playerCharacter.entityID,
  );
  const transportCollisionData: CollisionData = getRectangleCollisionData(
    {
      height: 24,
      width: 24,
      x: playerPosition.x,
      y: playerPosition.y,
    },
    ["transport"],
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
    setEntityLevel(playerCharacter.entityID, targetLevelID);
    setEntityPosition(playerCharacter.entityID, {
      x: targetX * 24,
      y: targetY * 24,
    });
    goToLevel(targetLevelID);
  }
  if (state.values.stageID !== null) {
    const stage: Stage = getDefinable(Stage, state.values.stageID);
    for (const weapon of stage.weapons) {
      if (state.values.turn % weapon.stepsPerAttack === 0) {
        state.setValues({
          attackingWeaponsIDs: [...state.values.attackingWeaponsIDs, weapon.id],
        });
      }
    }
  }
  if (state.values.attackingWeaponsIDs.length > 0) {
    state.setValues({
      turnPart: TurnPart.WeaponsAttacking,
    });
  } else {
    startMonsterInstancesMovement();
    if (state.values.movingMonsterInstancesIDs.length > 0) {
      state.setValues({ turnPart: TurnPart.MonstersMoving });
    } else if (state.values.attackingMonsterInstancesIDs.length > 0) {
      state.setValues({ turnPart: TurnPart.MonstersAttacking });
    } else {
      state.setValues({ turnPart: null });
    }
    if (state.values.turn % turnsPerMode === 0) {
      const modeID: string = state.values.nextModeID;
      state.setValues({
        modeID,
        nextModeID: getUniqueRandomModeID(modeID),
      });
    }
  }
};
