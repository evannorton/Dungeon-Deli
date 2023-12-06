import { Character } from "./characters";
import { MonsterInstance } from "./monsterInstances";
import { doTurn } from "./functions/doTurn";
import { getActiveLevelID, getEntityIDs } from "pixel-pigeon";
import { getDefinable } from "./definables";
import { state } from "./state";

export const tick = (): void => {
  if (state.values.playerCharacterID !== null) {
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    playerCharacter.updateMovement((): void => {
      doTurn();
    });
  }
  const levelID: string | null = getActiveLevelID();
  if (levelID !== null) {
    for (const entityID of getEntityIDs({
      layerID: "monsters",
      levelID,
    })) {
      const monsterInstance: MonsterInstance = getDefinable(
        MonsterInstance,
        entityID,
      );
      monsterInstance.updateMovement();
    }
  }
};
