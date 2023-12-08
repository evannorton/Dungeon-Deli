import { MonsterInstance } from "../monsterInstances";
import { getActiveLevelID, getEntityIDs } from "pixel-pigeon";
import { getDefinable } from "../definables";

export const startMonsterInstancesMovement = (): void => {
  const levelID: string | null = getActiveLevelID();
  if (levelID !== null) {
    for (const entityID of getEntityIDs({
      layerIDs: ["characters"],
      levelIDs: [levelID],
      types: ["monster"],
    })) {
      const monsterInstance: MonsterInstance = getDefinable(
        MonsterInstance,
        entityID,
      );
      monsterInstance.startMovement();
    }
  }
};
