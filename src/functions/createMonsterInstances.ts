import { MonsterInstance } from "../monsterInstances";
import { getEntityFieldValue, getEntityIDs } from "pixel-pigeon";

export const createMonsterInstances = (): void => {
  for (const entityID of getEntityIDs({
    layerIDs: ["characters"],
    types: ["monster"],
  })) {
    const monsterID: unknown = getEntityFieldValue(entityID, "monster_id");
    if (typeof monsterID !== "string") {
      throw new Error(
        `Entity "${entityID}" has an invalid "monster_id" value.`,
      );
    }
    new MonsterInstance({
      entityID,
      monsterID,
    });
  }
};
