import { Character } from "./characters";
import {
  CollisionData,
  EntityPosition,
  getActiveLevelID,
  getEntityFieldValue,
  getEntityIDs,
  getEntityPosition,
  getRectangleCollisionData,
  goToLevel,
  setEntityLevel,
  setEntityPosition,
  setEntityZIndex,
} from "pixel-pigeon";
import { MonsterInstance } from "./monsterInstances";
import { TurnPart } from "./types/TurnPart";
import { Weapon } from "./weapons";
import { beginTurn } from "./functions/beginTurn";
import { getDefinable } from "./definables";
import { goToNextMode } from "./functions/goToNextMode";
import { playerIsBlocked } from "./functions/playerIsBlocked";
import { startMonsterInstancesMovement } from "./functions/startMonsterInstancesMovement";
import { state } from "./state";

export const tick = (): void => {
  if (state.values.playerCharacterID !== null) {
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    switch (state.values.turnPart) {
      case TurnPart.PlayerMoving: {
        playerCharacter.updateMovement((): void => {
          if (state.values.playerCharacterID === null) {
            throw new Error(
              "Attempted to tick player moving with no player character.",
            );
          }
          const updatedPlayerCharacter: Character = getDefinable(
            Character,
            state.values.playerCharacterID,
          );
          const playerPosition: EntityPosition = getEntityPosition(
            updatedPlayerCharacter.entityID,
          );
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
            setEntityLevel(playerCharacter.entityID, targetLevelID);
            setEntityPosition(playerCharacter.entityID, {
              x: targetX,
              y: targetY,
            });
            goToLevel(targetLevelID);
          }
          beginTurn();
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
      case TurnPart.MonstersKnockback:
        for (const characterID of state.values.knockbackCharacterIDs) {
          const character: Character = getDefinable(Character, characterID);
          character.updateKnockback((): void => {
            state.setValues({
              knockbackCharacterIDs: state.values.knockbackCharacterIDs.filter(
                (id: string): boolean => id !== characterID,
              ),
            });
            if (state.values.knockbackCharacterIDs.length === 0) {
              startMonsterInstancesMovement();
              if (state.values.movingMonsterInstancesIDs.length > 0) {
                state.setValues({ turnPart: TurnPart.MonstersMoving });
              } else if (state.values.attackingMonsterInstancesIDs.length > 0) {
                state.setValues({ turnPart: TurnPart.MonstersAttacking });
              } else {
                state.setValues({ turnPart: null });
                goToNextMode();
              }
            }
          });
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
                if (playerIsBlocked() === false) {
                  state.setValues({ turnPart: null });
                  goToNextMode();
                } else {
                  beginTurn();
                }
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
      case TurnPart.PlayerKnockback:
        for (const characterID of state.values.knockbackCharacterIDs) {
          const character: Character = getDefinable(Character, characterID);
          const characterPosition: EntityPosition = getEntityPosition(
            character.entityID,
          );
          character.updateKnockback((): void => {
            const transportCollisionData: CollisionData =
              getRectangleCollisionData(
                {
                  height: 24,
                  width: 24,
                  x: characterPosition.x,
                  y: characterPosition.y,
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
              setEntityLevel(character.entityID, targetLevelID);
              setEntityPosition(character.entityID, {
                x: targetX,
                y: targetY,
              });
              goToLevel(targetLevelID);
            }
            state.setValues({
              knockbackCharacterIDs: state.values.knockbackCharacterIDs.filter(
                (id: string): boolean => id !== characterID,
              ),
            });
            if (playerIsBlocked() === false) {
              state.setValues({ turnPart: null });
              goToNextMode();
            } else {
              beginTurn();
            }
          });
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
