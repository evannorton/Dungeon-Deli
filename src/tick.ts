import { Character } from "./characters";
import {
  EntityPosition,
  getActiveLevelID,
  getEntityIDs,
  getEntityPosition,
  setEntityZIndex,
} from "pixel-pigeon";
import { MonsterInstance } from "./monsterInstances";
import { doTurn } from "./functions/doTurn";
import { getDefinable } from "./definables";
import { playerIsBlocked } from "./functions/playerIsBlocked";
import { state } from "./state";

export const tick = (): void => {
  const levelID: string | null = getActiveLevelID();
  if (levelID !== null) {
    if (state.values.playerCharacterID !== null) {
      const playerCharacter: Character = getDefinable(
        Character,
        state.values.playerCharacterID,
      );
      playerCharacter.updateMovement((): void => {
        doTurn();
      });
      if (
        playerCharacter.isMoving() === false &&
        getEntityIDs({
          layerIDs: ["characters"],
          levelIDs: [levelID],
          types: ["monster"],
        }).every((entityID: string): boolean => {
          const monsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            entityID,
          );
          return monsterInstance.isMoving() === false;
        })
      ) {
        if (playerCharacter.isAlive() && playerIsBlocked()) {
          doTurn();
        }
      }
    }
    for (const entityID of getEntityIDs({
      layerIDs: ["characters"],
      levelIDs: [levelID],
      types: ["monster"],
    })) {
      const monsterInstance: MonsterInstance = getDefinable(
        MonsterInstance,
        entityID,
      );
      monsterInstance.updateMovement();
    }
    if (state.values.attackingMonsterInstancesIDs.length > 0) {
      const attackingMonsterInstance: MonsterInstance = getDefinable(
        MonsterInstance,
        state.values.attackingMonsterInstancesIDs[0],
      );
      if (attackingMonsterInstance.isAttacking()) {
        attackingMonsterInstance.updateAttack();
      } else {
        attackingMonsterInstance.attack();
      }
    }
    getEntityIDs({
      layerIDs: ["characters"],
      levelIDs: [levelID],
    })
      .sort((a: string, b: string): number => {
        const aPosition: EntityPosition = getEntityPosition(a);
        const bPosition: EntityPosition = getEntityPosition(b);
        if (aPosition.y < bPosition.y) {
          return -1;
        }
        if (aPosition.y > bPosition.y) {
          return 1;
        }
        return 0;
      })
      .forEach((entityID: string, entityIndex: number): void => {
        setEntityZIndex(entityID, entityIndex);
      });
  }
};
