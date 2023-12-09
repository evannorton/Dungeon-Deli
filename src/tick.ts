import { Character } from "./characters";
import {
  EntityPosition,
  getActiveLevelID,
  getEntityIDs,
  getEntityPosition,
  setEntityZIndex,
} from "pixel-pigeon";
import { MonsterInstance } from "./monsterInstances";
import { TurnPart } from "./types/TurnPart";
import { Weapon } from "./weapons";
import { beginTurn } from "./functions/beginTurn";
import { getDefinable } from "./definables";
import { goToNextMode } from "./functions/goToNextMode";
import { playerIsBlocked } from "./functions/playerIsBlocked";
import { state } from "./state";

export const tick = (): void => {
  if (state.values.playerCharacterID !== null) {
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    switch (state.values.turnPart) {
      case TurnPart.PlayerMoving: {
        playerCharacter.updateMovement(beginTurn);
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
