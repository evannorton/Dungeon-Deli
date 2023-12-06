import { Character } from "./characters";
import { MonsterInstance } from "./monsterInstances";
import { doTurn } from "./functions/doTurn";
import { EntityPosition, getActiveLevelID, getEntityIDs, getEntityPosition, setEntityZIndex } from "pixel-pigeon";
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
      layerIDs: ["characters"],
      levelIDs: [levelID],
      types: ["monster"]
    })) {
      const monsterInstance: MonsterInstance = getDefinable(
        MonsterInstance,
        entityID,
      );
      monsterInstance.updateMovement();
    }
    getEntityIDs({
      layerIDs: ["characters"],
      levelIDs: [levelID],
    }).sort((a: string, b: string): number => {
      const aPosition: EntityPosition = getEntityPosition(a);
      const bPosition: EntityPosition = getEntityPosition(b);
      if (aPosition.y < bPosition.y) {
        return -1;
      } else if (aPosition.y > bPosition.y) {
        return 1;
      }
      return 0;
    }).forEach((entityID: string, entityIndex: number): void => {
      setEntityZIndex(entityID, entityIndex);
    });
  }
};
