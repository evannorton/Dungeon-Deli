import { createChestHUD } from "./functions/createChestHUD";
import { createChests } from "./functions/createChests";
import { createDeathHUD } from "./functions/createDeathHUD";
import { createInstructionsHUD } from "./functions/createInstructionsHUD";
import { createModeHUD } from "./functions/createModeHUD";
import { createMonsterInstances } from "./functions/createMonsterInstances";
import { createTitleHUD } from "./functions/createTitleHUD";
import { createVictoryHUD } from "./functions/createVictoryHUD";

export const run = (): void => {
  createInstructionsHUD();
  createModeHUD();
  createTitleHUD();
  createDeathHUD();
  createChestHUD();
  createVictoryHUD();
  createMonsterInstances();
  createChests();
};
