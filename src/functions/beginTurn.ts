import { Chest } from "../chests";
import { Stage } from "../stages";
import { TurnPart } from "../types/TurnPart";
import { Weapon } from "../weapons";
import { getDefinable } from "definables";
import { getPlayerChest } from "./getPlayerChest";
import { goToNextMode } from "./goToNextMode";
import { startMonsterInstancesMovement } from "./startMonsterInstancesMovement";
import { state } from "../state";

export const beginTurn = (): void => {
  state.setValues({
    turn: state.values.turn + 1,
  });
  const chest: Chest | null = getPlayerChest();
  if (chest !== null) {
    chest.open();
    state.setValues({ instructionsOpen: false });
  } else {
    if (state.values.stageID !== null) {
      const stage: Stage = getDefinable(Stage, state.values.stageID);
      for (const weaponGroup of stage.weapons) {
        for (const weaponID of weaponGroup.weaponIDs) {
          const weapon: Weapon = getDefinable(Weapon, weaponID);
          if (
            (state.values.turn + weapon.stepsOffset) % weapon.stepsPerAttack ===
            0
          ) {
            state.setValues({
              attackingWeaponsIDs: [
                ...state.values.attackingWeaponsIDs,
                weapon.id,
              ],
            });
          }
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
        goToNextMode();
      }
    }
  }
};
