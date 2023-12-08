import { Character } from "./characters";
import {
  CollisionData,
  EntityPosition,
  getActiveLevelID,
  getEntityFieldValue,
  getEntityIDs,
  getEntityPosition,
  goToLevel,
  setEntityZIndex,
} from "pixel-pigeon";
import { MonsterInstance } from "./monsterInstances";
import { Stage } from "./stages";
import { TurnPart } from "./types/TurnPart";
import { Weapon } from "./weapons";
import { getDefinable } from "./definables";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";
import { startMonsterInstancesMovement } from "./functions/startMonsterInstancesMovement";
import { state } from "./state";
import { turnsPerMode } from "./constants/turnsPerMode";

export const tick = (): void => {
  if (state.values.playerCharacterID !== null) {
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    switch (state.values.turnPart) {
      case TurnPart.PlayerMoving: {
        playerCharacter.updateMovement((): void => {
          state.setValues({
            turn: state.values.turn + 1,
          });
          const playerPosition: EntityPosition =
            playerCharacter.getEntityPosition();
          const transportCollisionData: CollisionData =
            getRectangleCollisionData(
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
            playerCharacter.setEntityLevel(targetLevelID);
            playerCharacter.setEntityPosition({
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
                  attackingWeaponsIDs: [
                    ...state.values.attackingWeaponsIDs,
                    weapon.id,
                  ],
                });
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
              }
            }
            if (state.values.turn % turnsPerMode === 0) {
              const modeID: string = state.values.nextModeID;
              state.setValues({
                modeID,
                nextModeID: getUniqueRandomModeID(modeID),
              });
            }
          }
        });
        break;
      }
      case TurnPart.WeaponsAttacking:
        if (
          state.values.attackingWeaponsIDs.every(
            (weaponID: string): boolean => {
              const weapon: Weapon = getDefinable(Weapon, weaponID);
              return weapon.isAttacking() === false;
            },
          )
        ) {
          const firstWeapon: Weapon = getDefinable(
            Weapon,
            state.values.attackingWeaponsIDs[0],
          );
          firstWeapon.attack();
        }
        for (const weaponID of state.values.attackingWeaponsIDs) {
          const weapon: Weapon = getDefinable(Weapon, weaponID);
          weapon.updateAttack();
        }
        break;
      case TurnPart.MonstersMoving:
        for (const monsterInstanceID of state.values
          .movingMonsterInstancesIDs) {
          const monsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            monsterInstanceID,
          );
          monsterInstance.character.updateMovement((): void => {
            state.setValues({
              movingMonsterInstancesIDs:
                state.values.movingMonsterInstancesIDs.filter(
                  (id: string): boolean => id !== monsterInstanceID,
                ),
            });
            if (state.values.movingMonsterInstancesIDs.length === 0) {
              if (state.values.attackingMonsterInstancesIDs.length > 0) {
                state.setValues({ turnPart: TurnPart.MonstersAttacking });
              } else {
                state.setValues({ turnPart: null });
              }
            }
          });
        }
        break;
      case TurnPart.MonstersAttacking:
        if (
          state.values.attackingMonsterInstancesIDs.every(
            (monsterInstanceID: string): boolean => {
              const monsterInstance: MonsterInstance = getDefinable(
                MonsterInstance,
                monsterInstanceID,
              );
              return monsterInstance.isAttacking() === false;
            },
          )
        ) {
          const firstMonsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            state.values.attackingMonsterInstancesIDs[0],
          );
          firstMonsterInstance.startAttack();
        }
        for (const monsterInstanceID of state.values
          .attackingMonsterInstancesIDs) {
          const monsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            monsterInstanceID,
          );
          monsterInstance.updateAttack();
        }
        break;
    }
    const levelID: string | null = getActiveLevelID();
    if (levelID !== null) {
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
  }
};
