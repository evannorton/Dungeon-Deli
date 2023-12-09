import { Stage } from "./stages";
import { createChestHUD } from "./functions/createChestHUD";
import { createChests } from "./functions/createChests";
import { createDeathHUD } from "./functions/createDeathHUD";
import { createModeHUD } from "./functions/createModeHUD";
import { createMonsterInstances } from "./functions/createMonsterInstances";
import { getDefinable } from "./definables";
import { musicVolumeChannelID } from "./volumeChannels";
import { playAudioSource } from "pixel-pigeon";
import { startingStageID } from "./constants/startingStageID";

export const run = (): void => {
  createModeHUD();
  createDeathHUD();
  createChestHUD();
  createMonsterInstances();
  createChests();
  getDefinable(Stage, startingStageID).start();
  playAudioSource("cavern-theme-base", {
    loopPoint: 12800,
    volumeChannelID: musicVolumeChannelID,
  });
};
