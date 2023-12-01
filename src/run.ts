import { Stage } from "./stages";
import { createHUD } from "./functions/createHUD";
import { createMonsterSpriteInstances } from "./functions/createMonsterSpriteInstances";
import { getDefinable } from "./definables";
import { stageIDs } from "./constants/stageIDs";

export const run = (): void => {
  if (stageIDs.length === 0) {
    throw new Error("Attempted to run with no stages.");
  }
  createHUD();
  createMonsterSpriteInstances();
  getDefinable(Stage, stageIDs[0]).start();
};
