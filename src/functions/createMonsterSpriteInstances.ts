import { Monster } from "../monsters";
import { getDefinable } from "../definables";
import { getEntityFieldValue, getEntityIDs } from "pixel-pigeon";

export const createMonsterSpriteInstances = (): void => {
  for (const entityID of getEntityIDs({ layerID: "monsters" })) {
    const monsterID: unknown = getEntityFieldValue(entityID, "monster_id");
    if (typeof monsterID !== "string") {
      throw new Error(
        `Entity "${entityID}" has an invalid "monster_id" value.`,
      );
    }
    const monster: Monster = getDefinable(Monster, monsterID);
    monster.createSpriteInstance(entityID);
  }
};
