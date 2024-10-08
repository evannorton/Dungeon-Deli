import { Character } from "./characters";
import {
  CollisionData,
  EntityPosition,
  getActiveLevelID,
  getCurrentTime,
  getEntityFieldValue,
  getEntityIDs,
  getEntityPosition,
  getRectangleCollisionData,
  goToLevel,
  setEntityLevel,
  setEntityPosition,
  setEntityZIndex,
  stopAudioSource,
  unlockAchievement,
} from "pixel-pigeon";
import { MonsterInstance } from "./monsterInstances";
import { Stage } from "./stages";
import { TurnPart } from "./types/TurnPart";
import { Weapon } from "./weapons";
import { beginTurn } from "./functions/beginTurn";
import { getDefinable } from "definables";
import { goToNextMode } from "./functions/goToNextMode";
import { playerIsBlocked } from "./functions/playerIsBlocked";
import { slipperyModeAchievementID } from "./achievements";
import { slipperyModeID } from "./modes";
import { startMonsterInstancesMovement } from "./functions/startMonsterInstancesMovement";
import { startingStageID } from "./constants/startingStageID";
import { state } from "./state";

export const tick = (): void => {
  if (state.values.isIntro2 && state.values.intro2StartedAt !== null) {
    if (getCurrentTime() > state.values.intro2StartedAt + 8500) {
      state.setValues({
        isIntro2: false,
        isMain: true,
      });
      getDefinable(Stage, startingStageID).start();
      stopAudioSource("intro");
    }
  }
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
            getRectangleCollisionData({
              entityTypes: ["transport"],
              rectangle: {
                height: 24,
                width: 24,
                x: playerPosition.x,
                y: playerPosition.y,
              },
            });
          const transportEntityID: string | null =
            transportCollisionData.entityCollidables[0]?.entityID ?? null;
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
            if (state.values.modeID === slipperyModeID) {
              unlockAchievement(slipperyModeAchievementID);
            }
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
          const attackingWeaponID: string | undefined =
            state.values.attackingWeaponsIDs[0];
          if (typeof attackingWeaponID === "undefined") {
            throw new Error("No attacking weapon ID found.");
          }
          const firstWeapon: Weapon = getDefinable(Weapon, attackingWeaponID);
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
                goToNextMode();
                if (playerIsBlocked() === false) {
                  state.setValues({ turnPart: null });
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
          const attackingMonsterInstanceID: string | undefined =
            state.values.attackingMonsterInstancesIDs[0];
          if (typeof attackingMonsterInstanceID === "undefined") {
            throw new Error("No attacking monster instance ID found.");
          }
          const firstMonsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            attackingMonsterInstanceID,
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
          character.updateKnockback((): void => {
            const characterPosition: EntityPosition = getEntityPosition(
              character.entityID,
            );
            const transportCollisionData: CollisionData =
              getRectangleCollisionData({
                entityTypes: ["transport"],
                rectangle: {
                  height: 24,
                  width: 24,
                  x: characterPosition.x,
                  y: characterPosition.y,
                },
              });
            const transportEntityID: string | null =
              transportCollisionData.entityCollidables[0]?.entityID ?? null;
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
            goToNextMode();
            if (playerIsBlocked() === false) {
              state.setValues({ turnPart: null });
            } else {
              beginTurn();
            }
          });
        }
        break;
    }
    const levelID: string | null = getActiveLevelID();
    if (levelID !== null) {
      [
        ...getEntityIDs({
          layerIDs: ["characters"],
          levelIDs: [levelID],
        }),
      ]
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
